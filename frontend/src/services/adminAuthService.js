// =================================================================
// GEN Z VOICES — SECURE ADMIN AUTHENTICATION & AUDIT SERVICE
// Single Admin Role ("ADMIN") Credentials: admin / admin123
// =================================================================

const ADMIN_STORAGE_KEY = 'genz_admin_session_token';
const ADMIN_AUDIT_LOG_KEY = 'genz_admin_audit_logs';

// SHA-256 hash helper to ensure raw passwords are never stored in client state
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Development credentials hash for admin / admin123
// SHA-256 of "admin123": 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
const PREDEFINED_ADMIN_USER = 'admin';
const PREDEFINED_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

export const adminAuthService = {
  /**
   * Authenticate admin user using development credentials
   */
  async login(username, password) {
    if (!username || !password) {
      return { success: false, error: 'Please enter both username and password.' };
    }

    const inputUser = username.trim().toLowerCase();
    const inputHash = await sha256(password);

    if (inputUser === PREDEFINED_ADMIN_USER && inputHash === PREDEFINED_PASSWORD_HASH) {
      const session = {
        role: 'ADMIN',
        username: PREDEFINED_ADMIN_USER,
        name: 'System Administrator',
        authenticatedAt: new Date().toISOString(),
        token: `genz_adm_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
      this.logAction('LOGIN', 'Admin Portal', 'SUCCESS');

      return { success: true, session };
    }

    this.logAction('FAILED_LOGIN', 'Admin Portal', 'REJECTED');
    return { success: false, error: 'Invalid admin username or password.' };
  },

  /**
   * Terminate admin session
   */
  logout() {
    this.logAction('LOGOUT', 'Admin Portal', 'SUCCESS');
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  },

  /**
   * Check if current session is authenticated
   */
  isAuthenticated() {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return false;
    try {
      const session = JSON.parse(raw);
      return session && session.role === 'ADMIN' && Boolean(session.token);
    } catch (e) {
      return false;
    }
  },

  /**
   * Get active admin session info
   */
  getAdminSession() {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  /**
   * Log administrative audit action
   */
  logAction(action, target, status = 'SUCCESS', details = '') {
    const logs = this.getAuditLogs();
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      action,
      target,
      status,
      details,
      actor: 'admin',
    };

    logs.unshift(newLog);
    // Keep last 200 audit logs
    const trimmed = logs.slice(0, 200);
    localStorage.setItem(ADMIN_AUDIT_LOG_KEY, JSON.stringify(trimmed));
  },

  /**
   * Retrieve audit logs
   */
  getAuditLogs() {
    const raw = localStorage.getItem(ADMIN_AUDIT_LOG_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  },
};
