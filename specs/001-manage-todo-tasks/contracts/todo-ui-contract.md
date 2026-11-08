# TODO UI Contract

## Purpose

Define the user-visible and accessibility contract for the single-page TODO application. This is a
UI contract, not a network API; the application exposes no external service endpoints.

## Required Controls and States

| Area | User-visible contract |
|---|---|
| Add task | A labelled text input and submit button add one task when the trimmed description is non-empty. Invalid input receives clear feedback and does not create a task. |
| Task list | Tasks appear as list items with their description and an observable incomplete or complete state. |
| Completion | Each task has a keyboard-operable native checkbox that toggles its completion state. Completion is not indicated by color alone. |
| Deletion | Each task has a labelled delete button. Activating it removes the task immediately, without a confirmation step. |
| Empty state | An understandable empty-state message appears when no tasks exist. Completion and deletion controls are absent. |
| Status | A persistent polite status region announces additions, completion changes, deletions, and persistence failures. Focus must not move to this region. |
| Storage failure | The interface keeps the current in-memory result and clearly communicates that the affected change may not persist. |

## Accessibility Contract

- Every interactive control has an accessible name that identifies its action and, for deletion,
  the affected task.
- All primary flows are usable by keyboard alone.
- Visible focus is maintained for keyboard users.
- After deletion, focus moves to the next task control, then the previous task control, or the
  task input if no tasks remain.
- The layout remains usable at narrow and wide viewport widths.

## Persistence Contract

- The application loads and saves the task list only in the current browser on the current device.
- A successful add, completion change, or deletion survives a browser reload.
- No account, synchronization, import/export, or external data transfer is part of this feature.
