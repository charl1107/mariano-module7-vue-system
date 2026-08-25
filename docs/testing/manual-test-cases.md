# Manual Test Cases — Module 8

**System:** Event Management System
**Repository:** https://github.com/charl1107/mariano-module7-vue-system
**Tester:** MARIANO, Dominic Charl P. (BSCS 3A)
**Date Executed:** August 25, 2026

---

### TC-01 — Add a valid event (Positive)
- **Feature:** Add Event (Create)
- **Preconditions:** Logged in as admin, on Events tab
- **Steps:** 1. Click "Add Event" 2. Fill Title ("Foundation Day"), Description ("Annual founding anniversary"), Date ("2026-09-15"), Location ("Main Quadrangle") 3. Click "Add Event"
- **Test Data:** Title: "Foundation Day", Description: "Annual founding anniversary", Date: 2026-09-15, Location: "Main Quadrangle", Status: "Upcoming"
- **Expected Result:** Event card appears in the list; total event count increases; success notification displayed
- **Actual Result:** Event card "Foundation Day" created successfully; count updated from 3 to 4; toast message shown
- **Status:** Pass
- **Evidence:** `01-existing-application.png`

### TC-02 — Reject event with empty title (Negative/Validation)
- **Feature:** Add Event (Validation)
- **Preconditions:** Logged in as admin, on Events tab
- **Steps:** 1. Click "Add Event" 2. Leave Title blank, fill Description, Date, Location 3. Click "Add Event"
- **Expected Result:** Submission blocked; validation error "Please complete all required fields before submitting." shown
- **Actual Result:** Form submission prevented; error toast alert displayed; record not created
- **Status:** Pass
- **Evidence:** Manual validation verified in browser

### TC-03 — Display all events (Positive/Read)
- **Feature:** Display Records
- **Preconditions:** Logged in as admin, open Events tab
- **Steps:** 1. Navigate to Events tab
- **Expected Result:** All seeded/added events render as styled cards with title, date, location, description, and status badges
- **Actual Result:** 4 event cards rendered accurately in responsive grid layout with color-coded status badges
- **Status:** Pass
- **Evidence:** `01-existing-application.png`

### TC-04 — Edit an existing event (Positive/Update)
- **Feature:** Edit Event
- **Preconditions:** Logged in as admin, on Events tab
- **Steps:** 1. Click "Edit" on an event 2. Change Status to "Ongoing" 3. Click "Save Changes"
- **Expected Result:** Card updates immediately to show new status; change persists
- **Actual Result:** Status updated to "Ongoing" with corresponding badge styling; updated immediately in grid
- **Status:** Pass
- **Evidence:** Manual edit verified in browser

### TC-05 — Delete an event with registrations (Positive/Delete, cascade)
- **Feature:** Delete Event
- **Preconditions:** Event has at least one linked participant registration
- **Steps:** 1. Click "Delete" on target event 2. Confirm deletion in modal dialog
- **Expected Result:** Event removed from list; linked participant registrations automatically removed from Registrations tab
- **Actual Result:** Event removed; linked participant registrations removed from localStorage and Registrations view
- **Status:** Pass
- **Evidence:** Manual deletion verified in browser

### TC-06 — Cancel event deletion (Negative/Edge)
- **Feature:** Delete Event
- **Preconditions:** On Events tab with existing events
- **Steps:** 1. Click "Delete" on an event 2. Click "Cancel" in confirmation modal
- **Expected Result:** Deletion aborted; event remains untouched in list
- **Actual Result:** Confirmation modal closes; event remains intact in grid
- **Status:** Pass
- **Evidence:** Manual cancel verified in browser

### TC-07 — Search for an existing event (Positive/Search)
- **Feature:** Search / Filtering
- **Preconditions:** Multiple events exist on Events tab
- **Steps:** 1. Type "Orientation" into search filter box
- **Expected Result:** Only matching event card ("Freshman Orientation Day") is visible in grid
- **Actual Result:** Grid dynamically filtered to show only "Freshman Orientation Day" card
- **Status:** Pass
- **Evidence:** Manual search verified in browser

### TC-08 — Register participant with invalid email (Negative/Edge, defect BUG-01)
- **Feature:** Registration Validation (BUG-01)
- **Preconditions:** On Registrations tab, at least one event exists
- **Steps:** 1. Click "Register Participant" 2. Enter Participant Name ("Maria Santos") 3. Enter Email ("not-an-email") 4. Select event 5. Click "Register"
- **Expected Result (after fix):** Form submission rejected with message "Please enter a valid email address."
- **Actual Result (before fix):** Accepted invalid email `not-an-email` (BUG-01 defect)
- **Actual Result (after fix):** Rejected submission with error message "Please enter a valid email address."
- **Status:** Pass (Fixed & Retested)
- **Evidence:** `04-identified-defect.png`, `06-successful-retesting.png`, `src/utils/registrationValidation.test.js`

### TC-09 — Verify persistence after refresh (Positive/Persistence)
- **Feature:** localStorage Persistence
- **Preconditions:** Added a new event or participant registration
- **Steps:** 1. Add new event 2. Perform hard refresh of browser page (F5 / Ctrl+R)
- **Expected Result:** Added event remains present after reload; state restored from localStorage
- **Actual Result:** Added records and theme settings persisted cleanly across browser reloads
- **Status:** Pass
- **Evidence:** Manual refresh persistence verified

### TC-10 — Responsive layout on narrow width (Edge/Responsive)
- **Feature:** Responsive Interface
- **Preconditions:** System open in browser
- **Steps:** 1. Resize browser viewport to mobile width (<640px) 2. Navigate through Events, Registrations, Attendance tabs
- **Expected Result:** Top nav collapses to hamburger menu; cards stack in single column; tables adjust to card view
- **Actual Result:** Header converted to mobile drawer menu; all grids and tables gracefully stacked in single column
- **Status:** Pass
- **Evidence:** Manual mobile view verified
