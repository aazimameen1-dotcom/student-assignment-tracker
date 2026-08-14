# DPDP Act (India) Compliance Audit & Implementation Progress Log

**Branch:** `compliance/dpdp`  
**Date:** August 14, 2026  
**Status:** In Progress / Draft for Legal Review  
**Target Legislation:** Digital Personal Data Protection Act, 2023 (DPDP Act, 2023 - India)

---

## 1. Executive Summary
This document logs the compliance audit, architectural changes, consent mechanisms, and statutory artifact generation performed for the **Scholar - Student Assignment & Academic Tracker** web application to align with the provisions of India's Digital Personal Data Protection Act, 2023.

---

## 2. Personal Data Inventory & Collection Points Audit

| Data Category | Collection Point(s) | Processing Purpose | Legal Basis / Consent | Storage & Retention |
| :--- | :--- | :--- | :--- | :--- |
| **Account Credentials** (Email, Password Hash, Display Name) | `src/pages/Login.jsx` (Sign up / Sign in) | Authentication, account security, session management | Explicit Consent (DPDP Sec 6) | Supabase Auth (Active account duration + 30 days post-deletion) |
| **Student Identity & Academics** (Student ID, Degree, Institution, Semester, GPA) | `src/pages/Profile.jsx`, `src/pages/Settings.jsx` | Academic curriculum tracking and personalized milestone planning | Explicit Consent (DPDP Sec 6) | Supabase DB / Encrypted Cloud |
| **Contact Data** (Personal/Contact Email, Phone Number, GitHub/LinkedIn URLs) | `src/pages/Profile.jsx` | Scholar profile representation, peer collaboration, notifications | Explicit Opt-in | Supabase User Metadata / Local Cache |
| **Academic Deliverables** (Tasks, Milestone titles, Professor names & office hours, Grades) | `src/pages/Tasks.jsx`, `src/pages/Projects.jsx`, `src/pages/AssignmentDetails.jsx` | Core assignment management & deadline calculation | Core Service Contractual Necessity | Cloud Database (user-managed deletion) |
| **Study Notes & Scratchpad** | `src/pages/Dashboard.jsx` | Temporary personal study scratchpad | User Input (Local Storage) | Browser `localStorage` (Cleared on logout/cache reset) |
| **Client Telemetry & Diagnostics** | `src/utils/telemetry.js` | Performance monitoring, error diagnostics, fault tolerance | Granular Consent (Gated via Consent Banner) | Client In-Memory (Max 50 events, not transmitted to 3rd party without consent) |

### Third-Party Processors & Service Providers
1. **Supabase Inc.** (Cloud Infrastructure, PostgreSQL Database, Auth Engine) - Data Host & Processor.
2. **OpenAlex API** (`api.openalex.org`) - Public academic research paper discovery (Search queries only; no PII transmitted).
3. **Google Fonts** (`fonts.googleapis.com`) - Web font delivery.
4. **Unsplash** (`images.unsplash.com`) - Static avatar preset delivery.

---

## 3. Implemented DPDP Compliance Components

- [x] **Privacy Notice Page (`src/pages/PrivacyPolicy.jsx`)**: Comprehensive statutory disclosure specifying data categories, processing purposes, retention terms, third-party sub-processors, and full Data Principal statutory rights under DPDP Act 2023.
- [x] **Terms of Service with Data Protection Clauses (`src/pages/TermsOfService.jsx`)**: Enforceable terms establishing Data Fiduciary responsibilities, acceptable use, and Data Protection Board of India (DPBI) grievance escalation.
- [x] **Granular Unbundled Opt-In Consent Form (`src/pages/Login.jsx`)**: Unticked-by-default, purpose-specific consent checkboxes during registration, capturing timestamped consent metadata records.
- [x] **Cookie & Diagnostics Consent Banner (`src/components/ConsentBanner.jsx`)**: Explicit gating of telemetry and non-essential trackers with customize choices modal.
- [x] **Data Principal Statutory Rights Request Portal (`src/pages/DataRightsRequest.jsx`)**: Self-service interface for Access/Summary, Correction, Erasure, Consent Withdrawal, and Nominee Registration (Section 14).
- [x] **Published Grievance Redressal Officer Information**: DPO contact details published on the Privacy Policy, Terms, Data Rights portal, and global footers.
- [x] **Personal Data Breach Management Runbook (`BREACH_RUNBOOK.md`)**: Operational guidelines, severity tiering, 72-hour Board notification protocols, and user incident communication templates.
- [x] **Security Gaps Assessment & Remediation**: Documented in Section 5 below.

---

## 4. Legal Review Required Markers (Flagged for Legal Counsel)

> [!WARNING]
> **LEGAL REVIEW REQUIRED - ITEMS REQUIRING FORMAL LEGAL SIGN-OFF**
> 1. **DPO Contact & Entity Details**: Replace placeholder company name (`Scholar Academic Technologies Pvt. Ltd.`) and DPO address (`100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038`) with actual registered corporate entity details.
> 2. **Cross-Border Transfer Adequacy**: Confirm that cloud hosting locations (e.g. Supabase AWS regions) comply with Central Government notifications under DPDP Act Section 16 regarding restricted countries/territories.
> 3. **Parental Consent Verification (Minors / Age Gate)**: DPDP Section 9 mandates verifiable parental consent for users under 18 years old. Current application assumes university students (18+). Legal counsel should confirm whether an explicit age affirmation checkbox (e.g., "I confirm I am 18 years of age or older") suffices for the target student demographic.
> 4. **Retention Window Specifics**: Legal review of data retention windows post-account-inactivity (currently defined as 180 days post-deletion).

---

## 5. Security Gaps Audit & Hardening Notes

| Security Vector | Current Status | Risk Rating | Remediation / Recommendation |
| :--- | :--- | :--- | :--- |
| **Transport Layer Security (HTTPS / HSTS)** | Managed via Render/Vite static host | Low | Ensure HTTP Strict Transport Security (`Strict-Transport-Security: max-age=31536000; includeSubDomains`) is enforced at reverse proxy level (`render.yaml`). |
| **Authentication Rate Limiting** | Client-side 1 req/min limit + Supabase Auth rate limiter | Medium | Implement server-side turnstile/hCaptcha verification on login/signup endpoints to mitigate brute force credential attacks. |
| **Local Storage Data Sanitization** | Non-sensitive UI states & cached avatar | Low | Critical session tokens remain stored in secure cookies/Supabase storage. `localStorage.clear()` provided in cache management. |
| **Row Level Security (RLS) & Multi-Tenant Query Scoping** | Hardened with `.eq('user_id', user.id)` defense-in-depth | Low | Enforced in all task and subject mutation queries in `AppContext.jsx`. |
| **File Upload Security** | 5MB upload limit, strict MIME allowlisting, canvas image sanitization | Low | Complete rasterization and canvas re-encoding prevents SVG/script polyglot injection. |

---

## 6. Open Action Items
- [ ] Incorporate verified corporate entity details once legal review concludes.
- [ ] Connect Data Rights Request form to operational support ticket API endpoint / automated webhook.
