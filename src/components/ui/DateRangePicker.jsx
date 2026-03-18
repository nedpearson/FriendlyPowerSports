import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export const DateRangePicker = ({ initialStart, initialEnd, onRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Default to September 2025 for demo consistency
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8, 1)); 
  const [startDate, setStartDate] = useState(initialStart || new Date(2025, 8, 1));
  const [endDate, setEndDate] = useState(initialEnd || new Date(2025, 8, 18));
  const [hoverDate, setHoverDate] = useState(null);
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
        setIsOpen(false);
        if (onRangeChange) onRangeChange(startDate, date);
      }
    }
  };

  const isSelected = (date) => {
    if (!date) return false;
    if (startDate && date.getTime() === startDate.getTime()) return true;
    if (endDate && date.getTime() === endDate.getTime()) return true;
    return false;
  };

  const isHovered = (date) => {
    if (!date || !startDate || endDate || !hoverDate) return false;
    return date > startDate && date <= hoverDate;
  };

  const isBetween = (date) => {
    if (!date || !startDate || !endDate) return false;
    return date > startDate && date < endDate;
  };

  const formatDateLabel = () => {
    if (!startDate) return 'Select Date Range';
    const sStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!endDate) return `${sStr} - ...`;
    const eStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `MTD: ${sStr} - ${eStr}`;
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs border border-border bg-black hover:border-gold hover:text-white px-3 py-1.5 rounded transition-colors text-text-muted"
      >
        <CalendarIcon className="w-3 h-3 text-gold" />
        <span>{formatDateLabel()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 p-4 bg-charcoal border border-border rounded shadow-xl z-50 w-72 flex flex-col animate-fade-in origin-top-right transition-all">
           <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
              <button className="text-text-muted hover:text-white transition-colors" onClick={handlePrevMonth}><ChevronLeft className="w-4 h-4"/></button>
              <div className="text-white font-bold text-sm">
                 {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <button className="text-text-muted hover:text-white transition-colors" onClick={handleNextMonth}><ChevronRight className="w-4 h-4"/></button>
           </div>
           
           <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                 <div key={d} className="text-[10px] text-text-muted font-bold tracking-widest uppercase">{d}</div>
              ))}
           </div>
           
           <div className="grid grid-cols-7 gap-y-1">
              {days.map((d, i) => {
                 if (!d) return <div key={i} className="p-1"></div>;
                 const selected = isSelected(d);
                 const between = isBetween(d) || isHovered(d);
                 return (
                    <button 
                       key={i} 
                       onMouseEnter={() => setHoverDate(d)}
                       onClick={() => handleDateClick(d)}
                       className={`
                          text-xs py-1.5 w-full rounded-sm transition-colors relative
                          ${selected ? 'bg-gold text-black font-bold shadow-md' : ''}
                          ${between ? 'bg-gold/10 text-gold' : ''}
                          ${!selected && !between ? 'text-text hover:text-white hover:bg-black' : ''}
                       `}
                    >
                       {d.getDate()}
                    </button>
                 );
              })}
           </div>

           <div className="mt-4 pt-3 border-t border-border flex flex-col gap-2">
              <button className="text-[10px] uppercase tracking-widest font-mono text-text-muted hover:text-gold text-left transition-colors" onClick={() => { setStartDate(new Date(2025, 8, 1)); setEndDate(new Date(2025, 8, 18)); setIsOpen(false); }}>» Month to Date</button>
              <button className="text-[10px] uppercase tracking-widest font-mono text-text-muted hover:text-gold text-left transition-colors" onClick={() => { setStartDate(new Date(2025, 7, 18)); setEndDate(new Date(2025, 8, 18)); setIsOpen(false); }}>» Last 30 Days</button>
              <button className="text-[10px] uppercase tracking-widest font-mono text-text-muted hover:text-gold text-left transition-colors" onClick={() => { setStartDate(new Date(2025, 0, 1)); setEndDate(new Date(2025, 8, 18)); setIsOpen(false); }}>» Year to Date</button>
           </div>
        </div>
      )}
    </div>
  );
};
