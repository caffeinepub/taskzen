# Specification

## Summary
**Goal:** Let users delete completed tasks, set task reminders with in-app/browser notifications, add a Study Zone for subjects/assignments, and use a Focus Mode that emphasizes notifications in a distraction-minimized view.

**Planned changes:**
- Add backend task deletion by id with owner/admin permission enforcement and clear errors for missing/unauthorized deletes.
- Update Tasks UI to show a delete control for completed tasks, including loading/disabled state and user-friendly error messaging.
- Add backend support for an optional per-task reminder time, including set/update/clear methods with owner/admin permission checks.
- Add Tasks UI controls to set/clear reminder times and persist reminder state across refresh.
- Implement due-reminder notifications while the app is open: in-app notification and (when permitted) browser Notifications API, plus a UI flow to request notification permission.
- Add a Study Zone module with backend persistence and per-user access control: subjects and assignments (create/list; and at minimum mark assignment completed or delete).
- Add routed Study Zone pages (subjects list, subject detail with assignments, add-subject and add-assignment forms) and navigation entry.
- Add a Focus Mode route/page with an on/off toggle; when enabled and permission is granted, due reminders prefer browser notifications, and the page uses a simplified/distraction-minimized layout.

**User-visible outcome:** Users can remove completed tasks, set reminders and receive due notifications while the app is open, manage subjects and assignments in a Study Zone area, and enable Focus Mode to get clearer notification behavior in a calmer interface.
