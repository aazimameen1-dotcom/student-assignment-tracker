# Personal Data Breach Response & Management Runbook
**Statutory Framework:** Digital Personal Data Protection Act, 2023 (DPDP Act, Section 8(6))  
**Target Entity:** Scholar Academic Technologies  
**Classification:** Internal Security Operations Manual  
**Last Updated:** August 14, 2026  

---

## 1. Objective & Statutory Mandate
Under **Section 8(6) of the Digital Personal Data Protection Act, 2023**, in the event of a personal data breach, the Data Fiduciary shall give the **Data Protection Board of India (DPBI)** and each affected **Data Principal** (user) intimation of such breach in such form and manner as may be prescribed.

This runbook defines the mandatory incident triage, technical containment, 72-hour Board notification, and user communication procedures.

---

## 2. Breach Severity Classification Matrix

| Severity Tier | Criteria | Notification Mandate | Response SLA |
| :--- | :--- | :--- | :--- |
| **P1 - Critical Breach** | Unauthorized exfiltration, modification, or exposure of authentication credentials, full academic transcripts, personal contact data (email/phone) affecting >100 users. | Immediate Board notice (<72 hrs) + Direct User Notice | Immediate Containment (<2 hrs) |
| **P2 - High Severity** | Accidental exposure or vulnerability allowing potential unauthorized access to individual user profile records, without evidence of automated mass exfiltration. | Immediate Board notice (<72 hrs) + Affected Individual Notices | Containment (<6 hrs) |
| **P3 - Medium / Contained** | Localized leakage of non-identifying telemetry or transient debug logs, immediately contained with zero credential leakage. | Internal security log documentation + Board notice if statutory threshold met | Containment (<24 hrs) |

---

## 3. Incident Response Workflow (Phase-by-Phase)

### Phase 1: Detection & Immediate Technical Containment (Hours 0 – 6)
1. **Identify the Breach Vector**: Determine compromised API endpoints, database tokens, misconfigured RLS rules, or malicious session hijacking.
2. **Containment Actions**:
   - Immediately rotate all Supabase API keys, database credentials, and service role tokens.
   - Invalidate all active user sessions (`supabase.auth.signOut()` or revoke refresh tokens via admin console).
   - Freeze affected database tables / apply emergency firewall rules if exfiltration is active.
3. **Evidence Preservation**:
   - Capture forensic snapshots of database audit logs, Cloudflare/CDN access logs, and application error traces.
   - Preserve chronological timestamps and source IP records without altering log integrity.

### Phase 2: Impact Assessment & Forensic Scoping (Hours 6 – 24)
1. Determine exact categories of personal data accessed or disclosed (e.g. Email addresses, Hashed passwords, Student IDs, Course tasks).
2. Quantify total number of affected Data Principals.
3. Assess potential harm, identity theft risks, or reputational damage to affected students.

### Phase 3: Statutory Board Notification (Hours 24 – 72)
Draft and submit the official intimations to the **Data Protection Board of India (DPBI)** within the statutory 72-hour window.

---

## 4. Statutory Notification Templates

### Template A: 72-Hour Notice to the Data Protection Board of India (DPBI)
```text
FORM OF INTIMATION OF PERSONAL DATA BREACH TO THE DATA PROTECTION BOARD OF INDIA
[Pursuant to Section 8(6) of the Digital Personal Data Protection Act, 2023]

To:
The Data Protection Board of India (DPBI)
New Delhi, India

Date: [Insert Date within 72h of Breach Detection]
Subject: Intimation of Personal Data Breach under Section 8(6) of the DPDP Act, 2023

1. Details of the Data Fiduciary:
   - Entity Name: Scholar Academic Technologies Pvt. Ltd.
   - Registration / CIN: [Insert Company CIN]
   - Registered Address: [Insert Registered Office Address, Bengaluru, Karnataka]
   - Contact Person (DPO): Grievance Redressal & Data Protection Officer
   - Email: grievance-officer@scholar.app | Phone: +91-80-XXXX-XXXX

2. Nature and Circumstances of the Personal Data Breach:
   - Date and Time of Occurrence: [Insert Timestamp - IST]
   - Date and Time of Detection: [Insert Timestamp - IST]
   - Incident Vector: [e.g., Compromised credential / Misconfigured API endpoint / Database vulnerability]
   - Nature of Breach: [Confidentiality / Integrity / Availability Compromise]

3. Categories and Approximate Volume of Personal Data Affected:
   - Categories of Personal Data: [e.g., User Email Addresses, Hashed Passwords, Student Registration IDs, Course Task Titles]
   - Approximate Number of Affected Data Principals: [Insert Number]

4. Assessment of Likely Consequences & Harm:
   - Potential Risk of Identity Misuse: [Low / Moderate / High]
   - Impact Assessment: [Summarize potential impact on academic privacy and account security]

5. Technical Containment and Remedial Measures Taken:
   - [e.g., Immediate token rotation and session invalidation completed at Timestamp]
   - [e.g., Vulnerability patched in commit hash <commit_id> within X hours]
   - [e.g., Mandatory password reset enforced for all affected users]

6. User Communication Status:
   - Direct individual notification to affected Data Principals commenced on [Insert Date/Time] via registered email.

Submitted on behalf of Scholar Academic Technologies Pvt. Ltd.

___________________________________________
[Name & Signature of Data Protection Officer]
Data Protection Officer / Authorized Signatory
Scholar Academic Technologies Pvt. Ltd.
```

---

### Template B: Direct User Notification to Affected Data Principals
```text
Subject: Important Security Notice Regarding Your Scholar Account

Dear [User Name / Student],

We are writing to inform you of a data security incident that may have affected your personal account information on Scholar, and to share the proactive steps we have taken to secure your data and what you can do to protect your account.

1. What Happened?
On [Insert Date], our security monitoring systems detected unauthorized access affecting certain database records. Our engineering team immediately took steps to isolate the issue, terminate the unauthorized access, and patch the underlying vulnerability within [X] hours.

2. What Information Was Involved?
Our investigation indicates that the following categories of information associated with your account may have been accessed:
- Your name and registered university email address
- Your student ID and course enrollment details
- [Note: Payment information is never stored by Scholar and was NOT involved.]
- [Note: Your password was stored in salted, cryptographically hashed form.]

3. What We Have Done:
- We immediately secured all database endpoints and rotated all administrative credentials.
- We have invalidated all active sessions and required a password reset for affected accounts.
- We have formally notified the Data Protection Board of India in accordance with the Digital Personal Data Protection Act, 2023.
- We have engaged an independent third-party security firm to audit our systems.

4. What You Should Do:
- Reset Your Password: When you next visit Scholar, please create a new, strong password.
- If you use the same password on other websites, we strongly advise updating your passwords on those services as well.
- Remain vigilant against phishing emails pretending to represent university departments or academic services.

5. For More Information & Support:
If you have any questions or wish to exercise your rights under the DPDP Act, please contact our Data Protection & Grievance Redressal Officer directly:
- Email: grievance-officer@scholar.app
- Helpdesk: https://scholar.app/data-rights

Sincerely,
The Scholar Security & Data Protection Team
Scholar Academic Technologies Pvt. Ltd.
```

---

## 5. Post-Incident Review & Compliance Checklist
- [ ] Root cause analysis (RCA) documented within 7 calendar days.
- [ ] Codebase audit and automated penetration test performed using Strix/SAST scanners.
- [ ] Consent and data retention registries updated.
- [ ] Final post-breach closure report submitted to DPBI if requested.
