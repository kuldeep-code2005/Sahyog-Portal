/**
 * Sahyog Portal - Route Guard Module
 * Verifies officer authentication on restricted portals and hydrates user profile in header.
 */
(function (global) {
  'use strict';

  const SESSION_KEY = 'sahyog_authenticated_session';
  const LOGIN_URL = '1.html';

  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (session.expiresAt && Date.now() > session.expiresAt) {
        clearSession();
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  // 1. Immediate security check
  const activeSession = getSession();
  if (!activeSession) {
    console.warn('Unauthorized access. Redirecting to Sahyog Portal Login.');
    window.location.replace(LOGIN_URL);
  }

  // 2. Hydrate UI once DOM is loaded
  document.addEventListener('DOMContentLoaded', function () {
    const session = getSession();
    if (!session) {
      window.location.replace(LOGIN_URL);
      return;
    }

    // Populate officer metadata across the page
    const nameEls = document.querySelectorAll('.officer-name, #officerName');
    nameEls.forEach(el => el.textContent = session.name || 'Authorized Officer');

    const desigEls = document.querySelectorAll('.officer-designation, #officerDesignation');
    desigEls.forEach(el => el.textContent = session.designation || 'Nodal Officer');

    const agencyEls = document.querySelectorAll('.officer-agency, #officerAgency');
    agencyEls.forEach(el => el.textContent = session.agency || 'Indian Cyber Crime Coordination Centre (I4C)');

    const badgeEls = document.querySelectorAll('.officer-badge, #officerBadge');
    badgeEls.forEach(el => el.textContent = session.badgeId || 'I4C-LE-2026');

    const emailEls = document.querySelectorAll('.officer-email, #officerEmail');
    emailEls.forEach(el => el.textContent = session.govEmail || session.userId || '');

    const stationEls = document.querySelectorAll('.officer-station, #officerStation');
    stationEls.forEach(el => el.textContent = session.department || 'Cyber Crime Division, MHA');

    // Attach logout handlers
    const logoutBtns = document.querySelectorAll('.btn-logout, #btnLogoutHeader');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to securely log out from the Sahyog Portal?')) {
          clearSession();
          window.location.replace(LOGIN_URL);
        }
      });
    });
  });

  global.SahyogGuard = {
    getSession: getSession,
    clearSession: clearSession
  };
})(window);
