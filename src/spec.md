# Specification

## Summary
**Goal:** Enable users to delete any Work Zone project item and any Study Zone assignment (completed or not), with proper backend authorization for Study Zone deletions.

**Planned changes:**
- Work Zone: add a per-item delete (trash) control on each project item row that removes the item from the currently selected project’s items list (local UI state).
- Backend: add a method to delete a Study Zone assignment regardless of completion status with per-user authorization; ensure it is removed from the subject’s assignments list and delete any underlying linked Task (taskId) as part of the operation.
- Study Zone frontend: show a per-assignment delete (trash) control on every assignment row and wire it to the new backend delete method via React Query, including per-item loading/disabled states and English success/error toasts.

**User-visible outcome:** Users can delete any Work Zone item from a project and delete any Study Zone assignment (completed or active) via a trash button, with immediate UI updates and clear English confirmation/error messages.
