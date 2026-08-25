# Defect Report — BUG-01

| Field | Value |
|---|---|
| Defect ID | BUG-01 |
| Summary | Registration form accepts malformed email addresses |
| Application version/commit | Initial Module 7 baseline |
| Environment | Chrome (latest), Windows 11, Vue 3.4 / Vite 5 dev server |
| Preconditions | At least one event exists so the Registration form is available |
| Steps to reproduce | 1. Go to Registrations tab<br>2. Click "Register Participant"<br>3. Enter valid participant name ("Maria Santos")<br>4. Enter `not-an-email` in Email field<br>5. Select any event<br>6. Click "Register" |
| Expected result | Submission is rejected with error message "Please enter a valid email address." |
| Actual result | Submission succeeds; the registration is saved with invalid email string |
| Severity | Medium — no system crash, but corrupts participant contact records |
| Priority | Medium |
| Evidence | `03-failed-unit-test.png`, `04-identified-defect.png`, failing unit test `src/utils/registrationValidation.test.js` |
| Status | Fixed |
| Fix commit | `Fix BUG-01: Add email regex validation to registration form` |

---

## Root Cause
`validateRegistration()` in `src/utils/registrationValidation.js` only checked `!form.email || !form.email.trim()` — verifying only that the field was non-empty. It lacked regex format validation, allowing any arbitrary non-empty string (such as `not-an-email` or `test@`) to be accepted as a valid email address.

---

## Source Code Correction
Added an `EMAIL_PATTERN` regular expression (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) and an validation branch that pushes `"Please enter a valid email address"` to the error array when `form.email.trim()` fails pattern matching. Integrated `validateRegistration()` into `src/components/RegistrationForm.vue`.

```javascript
// src/utils/registrationValidation.js
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRegistration(form) {
  const errors = []

  if (!form.participantName || !form.participantName.trim()) {
    errors.push('Participant name is required')
  }

  if (!form.email || !form.email.trim()) {
    errors.push('Email is required')
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.push('Please enter a valid email address')
  }

  if (!form.eventId) {
    errors.push('Event is required')
  }

  return { valid: errors.length === 0, errors }
}
```

---

## Retest Results
- **Automated Retest:** Re-ran Vitest suite (`src/utils/registrationValidation.test.js`). The test `"rejects a registration with an invalid email format"` now passes.
- **Manual Retest:** Re-executed TC-08 in browser. Submitting `not-an-email` displays error banner `"Please enter a valid email address."` and blocks form submission.

---

## Regression Testing Results
Re-ran full automated test suite (`npm run test:run`). All 9 unit tests across 4 test suites passed cleanly with 0 failures, confirming no breakage to event validation, keyword filtering, or attendance summary calculations.
