/**
 * Sahyog Portal - Captcha Generation & Verification Module
 * Generates secure, randomized alphanumeric captcha tokens.
 */
(function (global) {
  'use strict';

  // Character set excluding easily confused characters (0/O, 1/l/I)
  const CHARACTERS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  const CAPTCHA_LENGTH = 6;

  let currentCaptcha = '';

  const CaptchaManager = {
    /**
     * Generate a new random captcha string
     */
    generate: function () {
      let code = '';
      for (let i = 0; i < CAPTCHA_LENGTH; i++) {
        const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
        code += CHARACTERS.charAt(randomIndex);
      }
      currentCaptcha = code;
      this.render();
      return currentCaptcha;
    },

    /**
     * Get the current active captcha string
     */
    getCurrent: function () {
      return currentCaptcha;
    },

    /**
     * Render the generated captcha into DOM
     */
    render: function () {
      const displayEl = document.getElementById('captchaDisplay') || 
                        document.querySelector('.captcha-box span');
      if (displayEl) {
        displayEl.textContent = currentCaptcha;
      }
    },

    /**
     * Validate user input against current captcha (case-insensitive for convenience or strict)
     * @param {string} input - User submitted captcha string
     * @param {boolean} caseSensitive - Whether to enforce case sensitivity (default: false for user friendliness)
     * @returns {boolean}
     */
    validate: function (input, caseSensitive = false) {
      if (!input || typeof input !== 'string') return false;
      const cleanInput = input.trim();
      if (caseSensitive) {
        return cleanInput === currentCaptcha;
      }
      return cleanInput.toLowerCase() === currentCaptcha.toLowerCase();
    },

    /**
     * Trigger refresh animation and generate new code
     */
    refresh: function () {
      const btn = document.getElementById('btnRefreshCaptcha') || 
                  document.querySelector('.captcha-refresh-btn');
      if (btn) {
        btn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
          btn.style.transform = '';
        }, 300);
      }
      const newCode = this.generate();
      // Clear input field if present
      const inputEl = document.getElementById('txtcapcha') || 
                      document.querySelector('.captcha-input');
      if (inputEl) {
        inputEl.value = '';
        inputEl.classList.remove('input-error');
      }
      return newCode;
    },

    /**
     * Bind listeners to refresh button
     */
    init: function () {
      this.generate();

      const refreshBtn = document.getElementById('btnRefreshCaptcha') || 
                         document.querySelector('.captcha-refresh-btn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.refresh();
        });
      }
    }
  };

  // Export to global scope
  global.CaptchaManager = CaptchaManager;

  // Auto-initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CaptchaManager.init());
  } else {
    CaptchaManager.init();
  }
})(window);
