# Data Model: Manage TODO Tasks

## Task

| Field | Description | Validation |
|---|---|---|
| `id` | Stable identifier for an individual task. | Required; generated when the task is created; unique within the task list. |
| `text` | User-entered task description. | Required after trimming; cannot be empty or whitespace-only. |
| `completed` | Whether the task is finished. | Required boolean; defaults to `false`. |
| `createdAt` | Time the task was created. | Required numeric timestamp; display is out of scope. |

## Task List

The task list is the complete collection of a single user's tasks in one browser on one device.
It is persisted as one versioned record and loaded when the application opens.

| Field | Description | Validation |
|---|---|---|
| `version` | Persisted-record format version. | Required positive integer; current value is `1`. |
| `todos` | Ordered collection of tasks. | Required array; each entry must satisfy the Task validation rules. |

## State Transitions

| Operation | Preconditions | Result | Persistence expectation |
|---|---|---|---|
| Add | Trimmed task text is non-empty. | Create an incomplete task and append it to the list. | Save the updated list; report a recoverable failure if it cannot be saved. |
| Complete | Target task exists and is incomplete. | Set `completed` to `true`. | Save the updated list; report a recoverable failure if it cannot be saved. |
| Restore | Target task exists and is complete. | Set `completed` to `false`. | Save the updated list; report a recoverable failure if it cannot be saved. |
| Delete | Target task exists. | Remove it immediately, without confirmation. | Save the updated list; report a recoverable failure if it cannot be saved. |
| Load | Browser storage is available and record is valid. | Restore the saved task list. | No write is required. |
| Invalid load | Record is absent, invalid, or unsupported. | Start with an empty list and notify the user when data could not be read. | Do not overwrite invalid data merely by loading it. |

## Persistence Failure Semantics

When a write fails, the in-memory task list remains changed so the visible result matches the
user's action for the current session. The application shows that the change may not persist and
does not represent it as saved. Clearing browser-local data resets the next session to an empty
task list.
