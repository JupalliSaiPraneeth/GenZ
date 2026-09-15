// =================================================================
// GEN Z VOICES — SECURE SUPABASE ADMIN AUTHENTICATION SERVICE
// Authenticates against public.admin_users (s_no, admin_username, admin_password)
// =================================================================

import { supabase, isSupabaseConfigured } from './supabaseClient';

const ADMIN_STORAGE_KEY = 'genz_admin_session_token';
const ADMIN_AUDIT_LOG_KEY = 'genz_admin_audit_logs';

/**
 * SHA-256 helper for hash matching
 */
async function sha256(message) {
  if (!message) return '';
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const adminAuthService = {
  /**
   * Authenticate admin user against public.admin_users table in Supabase
   */
  async login(username, password) {
    if (!username || !password) {
      return { success: false, error: 'Please enter both username and password.' };
    }

    const inputUser = username.trim();
    const inputPass = password.trim();

    try {
      if (!isSupabaseConfigured) {
        return { success: false, error: 'Supabase configuration is missing in .env file.' };
      }

      // 1. Fetch user from public.admin_users table by admin_username
      const { data: adminRecord, error } = await supabase
        .from('admin_users')
        .select('*')
        .ilike('admin_username', inputUser)
        .maybeSingle();

      if (error || !adminRecord) {
        await this.logAction('FAILED_LOGIN', 'Admin Portal', 'REJECTED', `User not found: ${inputUser}`);
        return { success: false, error: 'Invalid admin username or password.' };
      }

      // 2. Verify password against plain text or SHA-256 hash
      const passHash = await sha256(inputPass);
      const isPasswordValid =
        adminRecord.admin_password === inputPass ||
        adminRecord.admin_password === passHash;

      if (!isPasswordValid) {
        await this.logAction('FAILED_LOGIN', 'Admin Portal', 'REJECTED', `Invalid password for ${inputUser}`);
        return { success: false, error: 'Invalid admin username or password.' };
      }

      // 3. Save Admin Session
      const adminSession = {
        role: 'ADMIN',
        sNo: adminRecord.s_no,
        username: adminRecord.admin_username,
        name: adminRecord.admin_username,
        authenticatedAt: new Date().toISOString(),
        token: `genz_adm_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminSession));
      await this.logAction('LOGIN', 'Admin Portal', 'SUCCESS', `Logged in as ${adminRecord.admin_username}`);

      return { success: true, session: adminSession };
    } catch (err) {
      console.error('Admin authentication error:', err);
      return { success: false, error: err.message || 'An error occurred during authentication.' };
    }
  },

  /**
   * Authenticate admin via Supabase Google OAuth (optional)
   */
  async loginWithGoogle() {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase configuration missing.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/dashboard`,
        },
      });

      if (error) {
        await this.logAction('FAILED_LOGIN', 'Admin Portal', 'REJECTED', error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message || 'Google authentication failed.' };
    }
  },

  /**
   * Check session on Google OAuth return
   */
  async checkSupabaseAuthSession() {
    if (!isSupabaseConfigured) return null;

    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const user = data.session.user;
        const adminSession = {
          role: 'ADMIN',
          username: user.email?.split('@')[0] || 'admin',
          name: user.user_metadata?.full_name || user.email,
          authenticatedAt: new Date().toISOString(),
          token: data.session.access_token,
        };

        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminSession));
        return adminSession;
      }
    } catch (e) {}
    return null;
  },

  /**
   * Terminate admin session
   */
  async logout() {
    await this.logAction('LOGOUT', 'Admin Portal', 'SUCCESS');
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
  },

  /**
   * Check if current session is authenticated
   */
  isAuthenticated() {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw);
        if (session && session.role === 'ADMIN' && Boolean(session.token)) {
          return true;
        }
      } catch (e) {}
    }

    const sbKey = Object.keys(localStorage).find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (sbKey && localStorage.getItem(sbKey)) {
      return true;
    }

    return false;
  },

  /**
   * Get active admin session info
   */
  getAdminSession() {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return null;
  },

  /**
   * Log administrative audit action
   */
  async logAction(action, target, status = 'SUCCESS', details = '') {
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
