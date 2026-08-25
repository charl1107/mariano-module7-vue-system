# Module 8 — Test Plan

**System:** Event Management System (Module 6 → Module 7 → Module 8)
**Repository:** https://github.com/charl1107/mariano-module7-vue-system
**Student:** MARIANO, Dominic Charl P. (BSCS 3A)

## 1. Objectives
Verify that the Event, Registration, and Attendance features implemented in
Module 7 behave correctly against the requirements defined in the Module 6
architectural design, and demonstrate a controlled defect-detection,
correction, and regression workflow using Vitest and manual testing.

## 2. Scope

### In scope
- Event CRUD (Add, Display, Edit, Delete)
- Registration CRUD, including event linkage
- Event/registration search (filter by keyword)
- Form validation (required fields, email format)
- localStorage persistence across page reloads
- Responsive layout (mobile vs. desktop)

### Out of scope
- Authentication security (hardcoded credentials are a known, accepted
  prototype limitation per the Module 7 README)
- Backend/API integration (none exists — localStorage is the data layer)
- Attendance tracking UI beyond the summary counts (covered indirectly via
  the `getAttendanceSummary` unit tests)

## 3. Test Environment
- Browser: Chrome (latest)
- Node.js: v20+/v22
- Test runner: Vitest 4.x with jsdom environment
- OS: Windows (student machine)

## 4. Items Tested
| Feature | Test Type |
|---|---|
| Add Event | Manual + automated (`validateEvent`) |
| Edit Event | Manual |
| Delete Event (with cascade) | Manual |
| Event Search | Manual + automated (`filterByKeyword`) |
| Register Participant | Manual + automated (`validateRegistration`) |
| Attendance summary counts | Automated (`getAttendanceSummary`) |
| localStorage persistence | Manual |
| Responsive layout | Manual |

## 5. Risks
- localStorage is per-browser; data does not sync across devices — accepted
  prototype limitation, not treated as a defect.
- No input sanitization beyond required-field/format checks — validation
  logic is the primary testing focus for this reason.

## 6. Entry Criteria
- Module 7 application builds and runs (`npm run build` succeeds).
- Vitest, Vue Test Utils, and jsdom installed and configured.

## 7. Exit Criteria
- At least 5 automated Vitest tests pass (achieved: 9 tests across 4 files).
- 10 manual test cases executed and recorded with actual results.
- At least 1 defect documented, corrected, retested, and regression-checked.
- `npm run test:run` and `npm run build` both succeed on the final commit.
- GitHub Actions workflow passes on push.

## 8. Deliverables
- This test plan
- Manual test case results (`docs/testing/manual-test-cases.md`)
- Defect report (`docs/testing/defect-report.md`)
- Automated tests (`src/utils/*.test.js`)
- Updated CI workflow (`.github/workflows/build.yml`)
- Final PDF report (`MARIANO_Module8_SoftwareTesting.pdf`)
