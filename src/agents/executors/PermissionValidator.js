/**
 * Structured permission validation logic evaluating the user's role against action requirements.
 */
export const PermissionValidator = {
  // Role Hierarchy: Owner > General Manager > Manager > Sales Associate / Employee
  ROLE_LEVELS: {
    'Owner': 100,
    'General Manager': 90,
    'Manager': 80,
    'Sales Associate': 50,
    'Employee': 10
  },

  /**
   * Evaluates if the given role has permission to execute the required scopes
   */
  hasPermission(role, requiredScopes = []) {
    if (!role) return false;
    
    // Normalize role string to handle different casing/system roles
    const normalizedRole = this._normalizeRole(role);
    const userAccessLevel = this.ROLE_LEVELS[normalizedRole] || 0;

    // If no specific scopes are required, assume public/basic employee access
    if (requiredScopes.length === 0) return true;

    for (const scope of requiredScopes) {
      if (!this._evaluateScope(userAccessLevel, scope)) {
        return false;
      }
    }

    return true;
  },

  _normalizeRole(role) {
    if (role === 'system' || role === 'SYSTEM') return 'Owner'; // SYSTEM context often has full access in backend
    return role;
  },

  _evaluateScope(userLevel, scope) {
    switch (scope) {
      case 'FINANCE_EXECUTE':
      case 'SYSTEM_ADMIN':
        return userLevel >= this.ROLE_LEVELS['Owner'];
      case 'MANAGER_OVR':
      case 'REASSIGN_OWNER':
      case 'VIEW_SENSITIVE':
        return userLevel >= this.ROLE_LEVELS['Manager'];
      case 'CREATE_TASK':
      case 'SNOOZE_REC':
      case 'BASIC_WRITE':
        return userLevel >= this.ROLE_LEVELS['Employee'];
      default:
        return false; // Unknown scopes strictly deny access
    }
  }
};
