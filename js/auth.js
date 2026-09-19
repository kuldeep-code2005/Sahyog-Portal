/**
 * Sahyog Portal - Authentication & Session Management Module
 * Handles credential verification, session tokens, profile persistence, and redirection.
 */
(function (global) {
  'use strict';

  const SESSION_KEY = 'sahyog_authenticated_session';
  const REDIRECT_TARGET = 'send.html';

  // Registered Authorized Officers Database (Simulating National Identity & Access Management)
  const AUTHORIZED_USERS = [
    {
      userId: 'officer@sahyog.gov.in',
      passwordHash: 'Sahyog@2026',
      name: 'Dr. Rajesh Kumar Sharma, IPS',
      designation: 'Authorized Nodal Officer & Joint Director',
      agency: 'Indian Cyber Crime Coordination Centre (I4C)',
      department: 'Cyber & Information Security (CIS) Division, MHA',
      badgeId: 'I4C-NODAL-0941',
      govEmail: 'officer@sahyog.gov.in',
      contact: '+91-11-23438000',
      jurisdiction: 'Pan-India Central Authority (IT Act Sec 79(3)(b) & 69A)',
      role: 'NODAL_OFFICER'
    },
    {
      userId: 'admin',
      passwordHash: 'Sahyog@2026',
      name: 'Col. Amitav Verma',
      designation: 'Chief Technology Administrator',
      agency: 'Ministry of Home Affairs (MHA)',
      department: 'National Cyber Crime Portal Operations',
      badgeId: 'MHA-ADM-1022',
      govEmail: 'admin@sahyog.gov.in',
      contact: '+91-11-23092011',
      jurisdiction: 'Central Administration',
      role: 'SUPER_ADMIN'
    },
    {
      userId: 'NODAL-I4C-01',
      passwordHash: 'Sahyog@2026',
      name: 'Vikramaditya Rao, IPS',
      designation: 'Deputy Commissioner of Police (Cyber Crime)',
      agency: 'Cyber Crime Investigation Unit',
      department: 'Law Enforcement Agency (Central Division)',
      badgeId: 'LEA-DEL-4019',
      govEmail: 'nodal.i4c@gov.in',
      contact: '+91-11-20892233',
      jurisdiction: 'Section 79(3)(b) IT Act Requisition Authority',
      role: 'LEA_OFFICER'
    }
  ];

  const AuthManager = {
    /**
     * Check if active session exists
     * @returns {boolean}
     */
    isAuthenticated: function () {
      const session = this.getCurrentUser();
      if (!session) return false;
      // Optional check for expiry (e.g. 8 hours)
      const now = Date.now();
      if (session.expiresAt && now > session.expiresAt) {
        this.logout(false);
        return false;
      }
      return true;
    },

    /**
     * Retrieve current user profile
     * @returns {object|null}
     */
    getCurrentUser: function () {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.error('Failed to parse session:', e);
        return null;
      }
    },

    /**
     * Perform login authentication
     */
    login: function (userId, password, captchaInput) {
      return new Promise((resolve, reject) => {
        // 1. Sanitize inputs
        const cleanUserId = (userId || '').trim();
        const cleanPassword = (password || '').trim();
        const cleanCaptcha = (captchaInput || '').trim();

        // 2. Validate empty fields
        if (!cleanUserId) {
          return reject({ field: 'txtuseridothers', message: 'Please enter your Authorized User ID' });
        }
        if (!cleanPassword) {
          return reject({ field: 'TxtPWD', message: 'Please enter your password' });
        }
        if (!cleanCaptcha) {
          return reject({ field: 'txtcapcha', message: 'Please enter the security captcha' });
        }

        // 3. Validate Captcha
        if (global.CaptchaManager && !global.CaptchaManager.validate(cleanCaptcha)) {
          if (global.CaptchaManager.refresh) global.CaptchaManager.refresh();
          return reject({
            field: 'txtcapcha',
            message: 'Invalid captcha entered. Please try again with the new code.'
          });
        }

        // 4. Verify Credentials
        const matchedUser = AUTHORIZED_USERS.find(
          u => u.userId.toLowerCase() === cleanUserId.toLowerCase() && u.passwordHash === cleanPassword
        );

        if (!matchedUser) {
          // Check if valid gov email format with correct password for dynamic test users
          const isGovDomain = cleanUserId.endsWith('.gov.in') || cleanUserId.endsWith('.nic.in');
          if (isGovDomain && cleanPassword === 'Sahyog@2026') {
            const dynamicUser = {
              userId: cleanUserId,
              name: 'Authorized Law Enforcement Officer',
              designation: 'Nodal Officer / Investigating Officer',
              agency: 'State / Central Cyber Crime Division',
              department: 'Law Enforcement Agency',
              badgeId: 'LEA-' + Math.floor(1000 + Math.random() * 9000),
              govEmail: cleanUserId,
              contact: '+91-11-23438000',
              jurisdiction: 'Authorized Under Section 79(3)(b) IT Act',
              role: 'LEA_OFFICER'
            };
            return this._establishSession(dynamicUser, resolve);
          }

          if (global.CaptchaManager && global.CaptchaManager.refresh) {
            global.CaptchaManager.refresh();
          }
          return reject({
            field: 'general',
            message: 'Authentication failed. Invalid User ID or Password.'
          });
        }

        // 5. Successful authentication
        this._establishSession(matchedUser, resolve);
      });
    },

    /**
     * Create session record and store
     */
    _establishSession: function (user, resolve) {
      const sessionData = {
        ...user,
        sessionId: 'SYG-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        loginTime: new Date().toISOString(),
        expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours session
      };

      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        // Also persist in localStorage for multi-tab continuity
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      } catch (e) {
        console.warn('Could not persist to storage:', e);
      }

      resolve({
        success: true,
        user: sessionData,
        redirectTo: REDIRECT_TARGET
      });
    },

    /**
     * Sign out user
     */
    logout: function (redirect = true) {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
      if (redirect) {
        window.location.href = '1.html';
      }
    },

    /**
     * Pre-fill demo credentials for seamless testing
     */
    fillDemoCredentials: function () {
      const userEl = document.getElementById('txtuseridothers');
      const pwdEl = document.getElementById('TxtPWD');
      const captchaEl = document.getElementById('txtcapcha');

      if (userEl) userEl.value = 'officer@sahyog.gov.in';
      if (pwdEl) pwdEl.value = 'Sahyog@2026';
      if (captchaEl && global.CaptchaManager) {
        captchaEl.value = global.CaptchaManager.getCurrent();
      }
    },

    /**
     * Bind form events
     */
    init: function () {
      const loginForm = document.querySelector('.login-form') || document.getElementById('loginForm');
      if (!loginForm) return;

      const userEl = document.getElementById('txtuseridothers');
      const pwdEl = document.getElementById('TxtPWD');
      const captchaEl = document.getElementById('txtcapcha');
      const submitBtn = document.getElementById('btnLogin');
      const messageContainer = document.getElementById('authMessageContainer');

      // Clear errors on input
      [userEl, pwdEl, captchaEl].forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => {
          input.classList.remove('input-error');
          if (messageContainer) {
            messageContainer.style.display = 'none';
          }
        });
      });

      // Handle submit
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userId = userEl ? userEl.value : '';
        const password = pwdEl ? pwdEl.value : '';
        const captcha = captchaEl ? captchaEl.value : '';

        // Visual loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner"></span> Authenticating...';
        }

        this.login(userId, password, captcha)
          .then(res => {
            if (messageContainer) {
              messageContainer.className = 'auth-message success';
              messageContainer.innerHTML = `
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                <span>Credentials verified. Redirecting to Sahyog Portal...</span>
              `;
              messageContainer.style.display = 'flex';
            }

            setTimeout(() => {
              window.location.href = res.redirectTo;
            }, 600);
          })
          .catch(err => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = 'Login';
            }

            if (err.field && document.getElementById(err.field)) {
              document.getElementById(err.field).classList.add('input-error');
              document.getElementById(err.field).focus();
            }

            if (messageContainer) {
              messageContainer.className = 'auth-message error';
              messageContainer.innerHTML = `
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                <span>${err.message || 'Authentication error'}</span>
              `;
              messageContainer.style.display = 'flex';
            }
          });
      });

      // Quick test filler helper button if present
      const demoBtn = document.getElementById('btnDemoFill');
      if (demoBtn) {
        demoBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.fillDemoCredentials();
        });
      }
    }
  };

  // Export to global scope
  global.AuthManager = AuthManager;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AuthManager.init());
  } else {
    AuthManager.init();
  }
})(window);
