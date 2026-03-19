/**
 * Mock API Client
 * Simulates asynchronous network requests with artificial latency to prove 
 * the UI can handle loading states (skeletons) without locking the main thread.
 */

const LATENCY_MS_BASE = 800;
const LATENCY_JITTER = 400;

export const simulateLatency = async () => {
  const latency = LATENCY_MS_BASE + Math.floor(Math.random() * LATENCY_JITTER);
  return new Promise(resolve => setTimeout(resolve, latency));
};

export const fetchMockData = async (selectorFn, ...args) => {
  // Wait to simulate network hop
  await simulateLatency();
  // Execute the synchronous selector function to get the data payload
  try {
    const data = selectorFn(...args);
    return data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw new Error("Failed to fetch mock data");
  }
};
