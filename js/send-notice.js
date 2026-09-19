/**
 * Sahyog Portal - VASP Statutory Requisition & Asset Freezing System
 * Directs legal orders to Virtual Asset Service Providers (VASPs) under Section 106 BNSS / 102 CrPC & IT Act, 2000.
 */
(function (global) {
  'use strict';

  const STORAGE_NOTICES_KEY = 'sahyog_vasp_sent_notices';

  // Registered Virtual Asset Service Providers (VASPs) and Crypto Exchanges in India & Global
  const VASP_PROVIDERS_DATA = [
    {
      id: "binance",
      name: "Binance Holdings Ltd (Global Centralized Exchange)",
      category: "Virtual Asset Service Provider (VASP)",
      nodalOfficer: "Head of Global Law Enforcement Investigations",
      email: "case@binance.com",
      address: "Binance Global LEA Response Desk, Cayman Islands / Regulatory Compliance Hub",
      slaHours: 2,
      defaultRelief: ["Immediate Asset Freeze", "Beneficial Owner KYC", "IP Access Logs", "P2P Off-Ramp Bank Details"]
    },
    {
      id: "coindcx",
      name: "CoinDCX (Neblio Technologies Pvt Ltd)",
      category: "FIU-IND Registered Indian VASP",
      nodalOfficer: "Chief Compliance & Nodal Officer (Law Enforcement Support)",
      email: "lea@coindcx.com",
      address: "4th Floor, Tower B, Prestige Tech Park, Marathahalli, Bengaluru, Karnataka - 560103",
      slaHours: 2,
      defaultRelief: ["Immediate Asset Freeze", "Full KYC (Aadhaar/PAN)", "Bank Withdrawal Records", "IP Access Logs"]
    },
    {
      id: "wazirx",
      name: "WazirX (Zanmai Labs Pvt Ltd)",
      category: "FIU-IND Registered Indian VASP",
      nodalOfficer: "Grievance Officer & LEA Compliance Liaison",
      email: "nodal@wazirx.com",
      address: "Crowne Plaza, 5th Floor, Bandra Kurla Complex, Mumbai, Maharashtra - 400051",
      slaHours: 2,
      defaultRelief: ["Immediate Asset Freeze", "Full KYC Records", "Linked Indian Bank Accounts", "180 Days Log Preservation"]
    },
    {
      id: "coinswitch",
      name: "CoinSwitch Kuber (Bitcipher Labs LLP)",
      category: "FIU-IND Registered Indian VASP",
      nodalOfficer: "Nodal Compliance Officer (Cybercrime & LEA Desk)",
      email: "compliance.lea@coinswitch.co",
      address: "Prathik Tech Park, Outer Ring Road, Bellandur, Bengaluru, Karnataka - 560103",
      slaHours: 2,
      defaultRelief: ["Immediate Asset Freeze", "Aadhaar/PAN KYC", "INR Bank Transfer Trails", "Device Fingerprints"]
    },
    {
      id: "zebpay",
      name: "ZebPay (Awlencan Innovations India Ltd)",
      category: "FIU-IND Registered Indian VASP",
      nodalOfficer: "General Manager & Nodal Officer (Cyber Cell Liaison)",
      email: "compliance@zebpay.com",
      address: "Mondeal Heights, Near Wide Angle, S.G. Highway, Ahmedabad, Gujarat - 380015",
      slaHours: 2,
      defaultRelief: ["Immediate Asset Freeze", "KYC & Bank Withdrawal Details", "IPDR Logs"]
    },
    {
      id: "mudrex",
      name: "Mudrex (Mudrex Financial India Pvt Ltd)",
      category: "FIU-IND Registered Indian VASP",
      nodalOfficer: "Resident Compliance & Grievance Officer",
      email: "support-lea@mudrex.com",
      address: "Salarpuria Sattva, Hosur Road, Bengaluru, Karnataka - 560068",
      slaHours: 4,
      defaultRelief: ["Immediate Asset Freeze", "KYC Information", "Audit Logs"]
    },
    {
      id: "bybit",
      name: "Bybit Fintech Limited (Centralized Exchange)",
      category: "Virtual Asset Service Provider (VASP)",
      nodalOfficer: "Bybit Law Enforcement Requisition Team",
      email: "lawenforcement@bybit.com",
      address: "Level 11, One Central, Dubai World Trade Centre, Dubai, UAE",
      slaHours: 4,
      defaultRelief: ["Deposit Wallet Freeze", "Account Suspension", "Full KYC", "IP Logs"]
    },
    {
      id: "kucoin",
      name: "KuCoin Exchange (Mek Global Limited)",
      category: "Virtual Asset Service Provider (VASP)",
      nodalOfficer: "Global Legal Enforcement Operations",
      email: "lea@kucoin.com",
      address: "Suite 201, 2nd Floor, Eden Plaza, Eden Island, Mahé, Seychelles",
      slaHours: 4,
      defaultRelief: ["Account Debit Freeze", "User KYC Data", "Login Timestamps & IPs"]
    },
    {
      id: "okx",
      name: "OKX Exchange (Aux Cayes FinTech Co. Ltd)",
      category: "Virtual Asset Service Provider (VASP)",
      nodalOfficer: "OKX Law Enforcement Operations Team",
      email: "enforcement@okx.com",
      address: "Seychelles & Global Regulatory Operations Centre",
      slaHours: 4,
      defaultRelief: ["Wallet Freeze", "Beneficial Ownership Disclosure", "Transaction Ledger"]
    },
    {
      id: "kraken",
      name: "Kraken (Payward, Inc.)",
      category: "Virtual Asset Service Provider (VASP)",
      nodalOfficer: "Kraken Compliance & LEA Subpoena Desk",
      email: "subpoena@kraken.com",
      address: "237 Kearny Street #102, San Francisco, CA 94108, USA",
      slaHours: 6,
      defaultRelief: ["Immediate Asset Freeze", "Subpoena KYC Records", "Linked Banking Details"]
    }
  ];

  // Seed sample notices for ledger
  const SEED_NOTICES = [
    {
      noticeId: "MHA/I4C/2026/SEC79-8421",
      dispatchDate: "18-Sep-2026 15:40 IST",
      statutoryProvision: "Section 106 BNSS 2023 / Section 102 CrPC & Section 79(3)(b) IT Act",
      urgency: "Emergency Asset Freezing (2 Hours SLA)",
      intermediaryName: "Binance Holdings Ltd (Global Centralized Exchange)",
      intermediaryEmail: "case@binance.com",
      ncrpNumber: "NCRP/2026/894012 - Crypto Extortion",
      violationCategory: "Crypto Investment Fraud & Phishing",
      urls: [
        { url: "0x45271d4596ae638640f6becec56264ca98b77ceb", type: "Suspect Unhosted Wallet", category: "Crypto Investment Fraud" },
        { url: "0xa1cce2664c845129233511701867f15f211bb608", type: "Direct Deposit Address at VASP", category: "Laundering Proceeds" }
      ],
      reliefDemanded: ["Immediate Asset Freeze", "Full KYC Disclosure", "IP Login Logs", "P2P Off-Ramp Bank Details"],
      officerName: "Dr. Rajesh Kumar Sharma, IPS",
      officerDesignation: "Joint Director & Authorized Officer",
      status: "Asset Frozen / Under Review",
      acknowledgementToken: "ACK-VASP-BINANCE-908124"
    },
    {
      noticeId: "MHA/I4C/2026/SEC79-8415",
      dispatchDate: "17-Sep-2026 11:20 IST",
      statutoryProvision: "Section 94 BNSS 2023 / Section 91 CrPC (Production of KYC)",
      urgency: "High Priority (6 Hours SLA)",
      intermediaryName: "CoinDCX (Neblio Technologies Pvt Ltd)",
      intermediaryEmail: "lea@coindcx.com",
      ncrpNumber: "FIR No. 204/2026 IFSO Cyber Crime PS",
      violationCategory: "Ransomware Payment & Extortion",
      urls: [
        { url: "TLyqzViLGLxy1JY4UnRWBbfnRFrSTGu99J", type: "Suspect Unhosted Wallet", category: "Ransomware Extortion" }
      ],
      reliefDemanded: ["Immediate Asset Freeze", "Beneficial Owner KYC", "Linked Indian Bank Accounts"],
      officerName: "Vikramaditya Rao, IPS",
      officerDesignation: "Deputy Commissioner of Police (Cyber Crime)",
      status: "Acknowledged by VASP",
      acknowledgementToken: "ACK-VASP-DCX-98214"
    }
  ];

  let currentIntermediaries = VASP_PROVIDERS_DATA;
  let attachedFiles = [];

  const SendNoticeApp = {
    init: function () {
      this.ensureSeedNotices();
      this.loadVaspData();
      this.generateNoticeNumber();
      this.bindDynamicUrlRows();
      this.bindEvidenceDropzone();
      this.bindActions();
      this.renderLedger();
      this.bindTabs();
      this.bindSearch();
    },

    loadVaspData: function () {
      fetch('data/intermediaries.json')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            currentIntermediaries = data;
          }
          this.populateIntermediaryDropdown();
          this.renderVaspCards();
        })
        .catch(() => {
          this.populateIntermediaryDropdown();
          this.renderVaspCards();
        });
    },

    ensureSeedNotices: function () {
      if (!localStorage.getItem(STORAGE_NOTICES_KEY)) {
        localStorage.setItem(STORAGE_NOTICES_KEY, JSON.stringify(SEED_NOTICES));
      }
    },

    getNotices: function () {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_NOTICES_KEY)) || [];
      } catch (e) {
        return [];
      }
    },

    saveNotice: function (notice) {
      const notices = this.getNotices();
      notices.unshift(notice);
      localStorage.setItem(STORAGE_NOTICES_KEY, JSON.stringify(notices));
      this.renderLedger();
      this.updateBadgeCount();
    },

    generateNoticeNumber: function () {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const noticeId = `MHA/I4C/2026/SEC79-${randomDigits}`;
      const noticeIdEl = document.getElementById('txtNoticeId');
      const refPill = document.getElementById('refNoticePill');
      if (noticeIdEl) noticeIdEl.value = noticeId;
      if (refPill) refPill.textContent = noticeId;
      return noticeId;
    },

    populateIntermediaryDropdown: function () {
      const select = document.getElementById('selectIntermediary');
      if (!select) return;

      select.innerHTML = '<option value="">-- Select Target Virtual Asset Service Provider (VASP) / Crypto Exchange --</option>';
      currentIntermediaries.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = `${item.name} (${item.category})`;
        select.appendChild(opt);
      });

      this.bindIntermediaryChange();
    },

    renderVaspCards: function () {
      const grid = document.getElementById('vaspCardsGrid');
      if (!grid) return;
      grid.innerHTML = currentIntermediaries.map(v => `
        <div class="border border-slate-200 rounded-lg p-4 bg-slate-50 hover:shadow-md transition">
          <div class="flex justify-between items-start mb-2">
            <h4 class="font-bold text-sm text-sahyog-navy">${v.name}</h4>
            <span class="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">${v.slaHours}h SLA</span>
          </div>
          <p class="text-xs text-slate-600 font-medium">${v.category}</p>
          <div class="mt-3 text-xs space-y-1">
            <p><strong>Nodal Desk:</strong> ${v.nodalOfficer || 'Law Enforcement Liaison'}</p>
            <p><strong>Channel:</strong> <span class="font-mono text-blue-900 font-semibold">${v.email}</span></p>
            <p class="text-[11px] text-slate-500">${v.address || 'Registered Compliance Office'}</p>
          </div>
        </div>
      `).join('');
    },

    bindIntermediaryChange: function () {
      const select = document.getElementById('selectIntermediary');
      const previewCard = document.getElementById('intermediaryPreviewCard');
      if (!select || !previewCard) return;

      select.addEventListener('change', () => {
        const selectedId = select.value;
        const item = currentIntermediaries.find(i => i.id === selectedId);

        if (item) {
          previewCard.style.display = 'grid';
          document.getElementById('prevNodalOfficer').textContent = item.nodalOfficer;
          document.getElementById('prevEmail').textContent = item.email;
          document.getElementById('prevAddress').textContent = item.address;
          document.getElementById('prevSla').textContent = `${item.slaHours} Hours Statutory Freezing Window`;

          // Set suggested SLA dropdown
          const urgencySelect = document.getElementById('selectUrgency');
          if (urgencySelect) {
            if (item.slaHours <= 2) {
              urgencySelect.value = "Emergency Asset Freezing (2 Hours SLA)";
            } else {
              urgencySelect.value = "Statutory Standard (24 Hours SLA)";
            }
          }
        } else {
          previewCard.style.display = 'none';
        }
      });
    },

    bindDynamicUrlRows: function () {
      const addBtn = document.getElementById('btnAddUrlRow');
      const tableBody = document.getElementById('urlTableBody');
      const countBadge = document.getElementById('urlCountBadge');

      if (!addBtn || !tableBody) return;

      const updateCount = () => {
        const rows = tableBody.querySelectorAll('tr');
        if (countBadge) countBadge.textContent = `${rows.length} Identifier(s)`;
      };

      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <input type="text" class="form-input row-url font-mono" placeholder="e.g. 0x45271d4596ae638640f6becec56264ca98b77ceb or TNPeeaa..." required style="width: 100%;">
          </td>
          <td>
            <select class="form-select row-category" style="width: 100%;">
              <option value="Crypto Investment Fraud & Phishing" selected>Crypto Investment Fraud & Phishing</option>
              <option value="Ransomware Payment & Extortion">Ransomware Payment & Extortion</option>
              <option value="Laundering of Crime Proceeds">Laundering of Crime Proceeds</option>
              <option value="Darknet Marketplace Transaction">Darknet Marketplace Transaction</option>
              <option value="Terrorism Financing Ecosystem">Terrorism Financing Ecosystem</option>
              <option value="Impersonation & Fake VASP Scheme">Impersonation & Fake VASP Scheme</option>
              <option value="Unlawful P2P Off-Ramp / Bank Fraud">Unlawful P2P Off-Ramp / Bank Fraud</option>
              <option value="Other Cybercrime Violation">Other Cybercrime Violation</option>
            </select>
          </td>
          <td>
            <select class="form-select row-type" style="width: 100%;">
              <option value="Suspect Unhosted Wallet" selected>Suspect Unhosted Wallet</option>
              <option value="Direct Deposit Address at VASP">Direct Deposit Address at VASP</option>
              <option value="Transaction Hash (TxID)">Transaction Hash (TxID)</option>
              <option value="Exchange Hot Wallet / Cluster">Exchange Hot Wallet / Cluster</option>
              <option value="Mixer / Tumbler Ingress">Mixer / Tumbler Ingress</option>
              <option value="DeFi Bridge Contract">DeFi Bridge Contract</option>
              <option value="Custodial Wallet UID">Custodial Wallet UID</option>
            </select>
          </td>
          <td style="text-align: center;">
            <button type="button" class="btn-delete-row" title="Remove Identifier">&times; Remove</button>
          </td>
        `;

        tr.querySelector('.btn-delete-row').addEventListener('click', () => {
          if (tableBody.querySelectorAll('tr').length > 1) {
            tr.remove();
            updateCount();
          } else {
            alert('At least one suspect cryptocurrency wallet address or deposit identifier is required.');
          }
        });

        tableBody.appendChild(tr);
        updateCount();
      });

      // Bind first existing row delete button
      const firstDelete = tableBody.querySelector('.btn-delete-row');
      if (firstDelete) {
        firstDelete.addEventListener('click', () => {
          if (tableBody.querySelectorAll('tr').length > 1) {
            firstDelete.closest('tr').remove();
            updateCount();
          } else {
            alert('At least one suspect cryptocurrency wallet address or deposit identifier is required.');
          }
        });
      }

      updateCount();
    },

    bindEvidenceDropzone: function () {
      const dropzone = document.getElementById('evidenceDropzone');
      const fileInput = document.getElementById('fileEvidenceInput');
      const fileList = document.getElementById('uploadedFilesList');

      if (!dropzone || !fileInput) return;

      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#083375';
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = '#cbd5e1';
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#cbd5e1';
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.handleFiles(e.dataTransfer.files, fileList);
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
          this.handleFiles(fileInput.files, fileList);
        }
      });
    },

    handleFiles: function (files, listEl) {
      Array.from(files).forEach(file => {
        attachedFiles.push(file.name);
        if (listEl) {
          const item = document.createElement('div');
          item.style.cssText = 'display: inline-flex; align-items: center; gap: 6px; background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 11px; margin: 4px;';
          item.innerHTML = `<span>&#128206; ${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>`;
          listEl.appendChild(item);
        }
      });
    },

    collectFormData: function () {
      const session = (global.SahyogGuard && global.SahyogGuard.getSession()) || {};
      const noticeId = document.getElementById('txtNoticeId').value;
      const statutoryProvision = document.getElementById('selectStatute').value;
      const urgency = document.getElementById('selectUrgency').value;
      const ncrpNumber = document.getElementById('txtCrimeNumber').value || 'Pending FIR/NCRP Crypto Reference';
      const intermediaryId = document.getElementById('selectIntermediary').value;
      const intermediaryObj = currentIntermediaries.find(i => i.id === intermediaryId);
      const groundsSummary = document.getElementById('txtGrounds').value;

      // Extract Identifiers
      const rows = document.querySelectorAll('#urlTableBody tr');
      const urls = [];
      rows.forEach(r => {
        const urlVal = r.querySelector('.row-url')?.value.trim();
        const catVal = r.querySelector('.row-category')?.value;
        const typeVal = r.querySelector('.row-type')?.value;
        if (urlVal) {
          urls.push({ url: urlVal, category: catVal, type: typeVal });
        }
      });

      // Extract Relief
      const reliefCheckboxes = document.querySelectorAll('.relief-check:checked');
      const reliefDemanded = Array.from(reliefCheckboxes).map(cb => cb.value);

      const isDeclared = document.getElementById('chkDeclaration').checked;

      return {
        noticeId,
        statutoryProvision,
        urgency,
        ncrpNumber,
        intermediaryId,
        intermediaryName: intermediaryObj ? intermediaryObj.name : 'Target VASP',
        intermediaryEmail: intermediaryObj ? intermediaryObj.email : 'case@binance.com',
        intermediaryAddress: intermediaryObj ? intermediaryObj.address : 'Registered VASP Desk',
        urls,
        groundsSummary,
        reliefDemanded,
        isDeclared,
        officerName: session.name || 'Dr. Rajesh Kumar Sharma, IPS',
        officerDesignation: session.designation || 'Joint Director & Authorized Officer',
        officerAgency: session.agency || 'Indian Cyber Crime Coordination Centre (I4C)',
        officerBadge: session.badgeId || 'I4C-LE-2026',
        dispatchDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        status: 'Requisition Dispatched to VASP',
        acknowledgementToken: 'SYG-VASP-' + Math.floor(100000 + Math.random() * 900000)
      };
    },

    validateForm: function (data) {
      if (!data.intermediaryId) {
        alert('Please select the Target Virtual Asset Service Provider (VASP) / Crypto Exchange from the dropdown.');
        document.getElementById('selectIntermediary')?.focus();
        return false;
      }
      if (!data.urls || data.urls.length === 0) {
        alert('Please provide at least one valid Suspect Cryptocurrency Wallet Address or Deposit Identifier.');
        return false;
      }
      if (!data.groundsSummary || data.groundsSummary.trim().length < 15) {
        alert('Please provide a brief description of the grounds and investigation findings (minimum 15 characters).');
        document.getElementById('txtGrounds')?.focus();
        return false;
      }
      if (!data.isDeclared) {
        alert('You must accept the Statutory Officer Undertaking before dispatching the notice to the VASP.');
        document.getElementById('chkDeclaration')?.focus();
        return false;
      }
      return true;
    },

    bindActions: function () {
      const btnPreview = document.getElementById('btnPreviewNotice');
      const modal = document.getElementById('noticePreviewModal');
      const btnCloseModal = document.getElementById('btnClosePreviewModal');
      const btnCloseModalX = document.getElementById('btnClosePreviewModalX');
      const btnPrint = document.getElementById('btnPrintNotice');
      const btnDispatchFromModal = document.getElementById('btnDispatchFromModal');
      const form = document.getElementById('noticeForm');
      const btnReset = document.getElementById('btnResetForm');

      if (btnPreview && modal) {
        btnPreview.addEventListener('click', (e) => {
          e.preventDefault();
          const data = this.collectFormData();
          if (!data.intermediaryId) {
            alert('Please select the Target VASP / Crypto Exchange first to preview the requisition memo.');
            return;
          }
          this.renderPreviewDocument(data);
          modal.style.display = 'flex';
        });
      }

      [btnCloseModal, btnCloseModalX].forEach(btn => {
        if (btn) {
          btn.addEventListener('click', () => {
            modal.style.display = 'none';
          });
        }
      });

      if (btnPrint) {
        btnPrint.addEventListener('click', () => {
          window.print();
        });
      }

      if (btnDispatchFromModal) {
        btnDispatchFromModal.addEventListener('click', () => {
          modal.style.display = 'none';
          this.dispatchNotice();
        });
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.dispatchNotice();
        });
      }

      if (btnReset) {
        btnReset.addEventListener('click', () => {
          if (confirm('Clear form fields and generate new requisition number?')) {
            form.reset();
            this.generateNoticeNumber();
            document.getElementById('intermediaryPreviewCard').style.display = 'none';
            document.getElementById('uploadedFilesList').innerHTML = '';
            attachedFiles = [];
          }
        });
      }
    },

    renderPreviewDocument: function (data) {
      const container = document.getElementById('modalMemoContent');
      if (!container) return;

      const urlRowsHtml = data.urls.map((u, i) => `
        <tr>
          <td style="width: 30px; text-align: center;">${i + 1}</td>
          <td><strong style="word-break: break-all; font-family: monospace;">${u.url}</strong></td>
          <td>${u.type}</td>
          <td><span style="color: #991b1b; font-weight: 600;">${u.category}</span></td>
        </tr>
      `).join('');

      const reliefListHtml = data.reliefDemanded.map(r => `<li>${r}</li>`).join('');

      container.innerHTML = `
        <div class="gov-memo-doc">
          <div class="gov-memo-header">
            <div class="gov-memo-title-hi">भारत सरकार / GOVERNMENT OF INDIA</div>
            <div class="gov-memo-title-en">MINISTRY OF HOME AFFAIRS (MHA)</div>
            <div class="gov-memo-sub">INDIAN CYBER CRIME COORDINATION CENTRE (I4C)</div>
            <div style="font-size: 11px; color: #475569; margin-top: 4px;">SAHYOG PORTAL - VIRTUAL ASSET SERVICE PROVIDER (VASP) STATUTORY REQUISITION GATEWAY</div>
          </div>

          <table class="memo-meta-table">
            <tr>
              <td><strong>NOTICE REF NO:</strong> ${data.noticeId}</td>
              <td style="text-align: right;"><strong>DATE & TIME:</strong> ${data.dispatchDate}</td>
            </tr>
            <tr>
              <td><strong>STATUTORY PROVISION:</strong> ${data.statutoryProvision}</td>
              <td style="text-align: right;"><strong>COMPLIANCE SLA:</strong> <span style="color: #b91c1c; font-weight: bold;">${data.urgency}</span></td>
            </tr>
            <tr>
              <td colspan="2"><strong>LINKED NCRP/CRIME REF:</strong> ${data.ncrpNumber}</td>
            </tr>
          </table>

          <div style="margin-bottom: 14px; font-size: 13px;">
            <strong>TO:</strong><br>
            The Designated Grievance / Nodal Officer,<br>
            <strong>${data.intermediaryName}</strong><br>
            Compliance Channel: <em>${data.intermediaryEmail}</em><br>
            Address: ${data.intermediaryAddress}
          </div>

          <div style="border-top: 1px solid #cbd5e1; margin: 12px 0;"></div>

          <p class="memo-body-para">
            <strong>SUBJECT:</strong> STATUTORY REQUISITION NOTICE UNDER ${data.statutoryProvision.toUpperCase()} FOR IMMEDIATE ASSET FREEZING, BENEFICIAL OWNER KYC DISCLOSURE, AND TRANSACTION LOG PRESERVATION.
          </p>

          <p class="memo-body-para">
            1. Whereas, during criminal investigation into cyber frauds and laundering of crime proceeds, the following suspect cryptocurrency wallet addresses, transaction hashes, and deposit identifiers have been traced directly terminating at your custodial exchange infrastructure:
          </p>

          <p class="memo-body-para">
            2. <strong>GROUNDS & INVESTIGATION BRIEF:</strong><br>
            ${data.groundsSummary}
          </p>

          <p class="memo-body-para">
            3. <strong>SCHEDULE OF TARGET WALLETS & IDENTIFIERS:</strong>
          </p>

          <table class="memo-urls-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Target Identifier / Suspect Wallet Address / TxID</th>
                <th>Classification Type</th>
                <th>Crime Typology</th>
              </tr>
            </thead>
            <tbody>
              ${urlRowsHtml}
            </tbody>
          </table>

          <p class="memo-body-para">
            4. <strong>DIRECTIONS & RELIEF DEMANDED FROM VASP:</strong><br>
            In accordance with the statutory powers conferred under Indian Law, you are hereby mandated to execute the following directives within the designated compliance window:
          </p>
          <ul style="margin-left: 24px; margin-bottom: 14px; font-size: 13px; line-height: 1.6;">
            ${reliefListHtml}
          </ul>

          <p class="memo-body-para" style="font-size: 12px; color: #64748b;">
            <em>Note: Failure to comply with this statutory direction within the mandated SLA may attract liability under relevant provisions of law and regulatory reporting to FIU-IND.</em>
          </p>

          <div class="official-signature-box">
            <div class="signature-stamp">
              <div>&#10004; DIGITALLY CERTIFIED & DISPATCHED</div>
              <div style="margin-top: 4px; font-size: 12px; color: #083375;">${data.officerName}</div>
              <div style="font-size: 10px; color: #475569;">${data.officerDesignation}</div>
              <div style="font-size: 9.5px; color: #64748b;">${data.officerAgency}</div>
              <div style="font-size: 9px; margin-top: 4px; color: #0284c7;">Sahyog VASP Token: ${data.acknowledgementToken}</div>
            </div>
          </div>
        </div>
      `;
    },

    dispatchNotice: function () {
      const data = this.collectFormData();
      if (!this.validateForm(data)) return;

      const submitBtn = document.getElementById('btnSubmitNotice');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Relaying to VASP Compliance Desk...';
      }

      setTimeout(() => {
        this.saveNotice(data);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Dispatch Requisition to VASP';
        }

        this.showToast(`Statutory Notice ${data.noticeId} dispatched to ${data.intermediaryName}!`);

        document.getElementById('noticeForm').reset();
        this.generateNoticeNumber();
        document.getElementById('intermediaryPreviewCard').style.display = 'none';
        document.getElementById('uploadedFilesList').innerHTML = '';
        attachedFiles = [];

        this.switchTab('tabLedger');
      }, 700);
    },

    renderLedger: function (filterQuery = '') {
      const tbody = document.getElementById('ledgerTableBody');
      if (!tbody) return;

      let notices = this.getNotices();

      if (filterQuery) {
        const q = filterQuery.toLowerCase();
        notices = notices.filter(n =>
          n.noticeId.toLowerCase().includes(q) ||
          n.intermediaryName.toLowerCase().includes(q) ||
          n.status.toLowerCase().includes(q) ||
          (n.ncrpNumber && n.ncrpNumber.toLowerCase().includes(q))
        );
      }

      if (notices.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 24px; color: #64748b;">
              No VASP notices found matching the search criteria.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = notices.map((n, idx) => {
        let badgeClass = 'status-dispatched';
        if (n.status.includes('Acknowledged')) badgeClass = 'status-acknowledged';
        if (n.status.includes('Frozen') || n.status.includes('KYC')) badgeClass = 'status-complied';

        return `
          <tr>
            <td><strong>${n.noticeId}</strong></td>
            <td>${n.dispatchDate}</td>
            <td>
              <div style="font-weight: 600;">${n.intermediaryName}</div>
              <div style="font-size: 11px; color: #64748b;">${n.intermediaryEmail}</div>
            </td>
            <td>
              <span style="font-size: 12px; font-weight: 500;">${n.violationCategory || (n.urls && n.urls[0] ? n.urls[0].category : 'Crypto Fraud')}</span>
              <div style="font-size: 10px; color: #64748b; font-family: monospace;">${n.urls ? n.urls.length : 1} Identifier(s)</div>
            </td>
            <td>${n.urgency || '24 Hours'}</td>
            <td><span class="status-badge ${badgeClass}">&#9679; ${n.status}</span></td>
            <td>
              <button type="button" class="btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="window.SahyogSendApp.viewNoticeModal('${n.noticeId}')">
                View Memo
              </button>
            </td>
          </tr>
        `;
      }).join('');
    },

    viewNoticeModal: function (noticeId) {
      const notices = this.getNotices();
      const match = notices.find(n => n.noticeId === noticeId);
      if (match) {
        this.renderPreviewDocument(match);
        const modal = document.getElementById('noticePreviewModal');
        if (modal) modal.style.display = 'flex';
      }
    },

    updateBadgeCount: function () {
      const badge = document.getElementById('ledgerCountBadge');
      if (badge) {
        badge.textContent = this.getNotices().length;
      }
    },

    bindTabs: function () {
      const tabs = document.querySelectorAll('.nav-tab-btn');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const targetId = tab.getAttribute('data-tab');
          this.switchTab(targetId);
        });
      });
      this.updateBadgeCount();
    },

    switchTab: function (tabId) {
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
      });

      document.querySelectorAll('.tab-content-panel').forEach(panel => {
        panel.style.display = (panel.id === tabId) ? 'block' : 'none';
      });

      if (tabId === 'tabLedger') {
        this.renderLedger();
      }
    },

    bindSearch: function () {
      const searchInput = document.getElementById('txtSearchLedger');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.renderLedger(e.target.value.trim());
        });
      }
    },

    showToast: function (message) {
      const existing = document.querySelector('.sahyog-toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = 'sahyog-toast';
      toast.style.cssText = 'position: fixed; bottom: 24px; right: 24px; background: #083375; color: white; padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; box-shadow: 0 10px 15px rgba(0,0,0,0.25); z-index: 3000; display: flex; align-items: center; gap: 8px;';
      toast.innerHTML = `
        <svg style="width: 18px; height: 18px; color: #4ade80;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>${message}</span>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4500);
    }
  };

  global.SahyogSendApp = SendNoticeApp;

  document.addEventListener('DOMContentLoaded', () => {
    SendNoticeApp.init();
  });
})(window);
