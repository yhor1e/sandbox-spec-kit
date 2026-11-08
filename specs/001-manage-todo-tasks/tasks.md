# Tasks: Manage TODO Tasks

**Input**: Design documents from `/specs/001-manage-todo-tasks/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/todo-ui-contract.md,
quickstart.md

**Tests**: Browser-level tests are required by the implementation plan and constitution. Write each
story's test before its implementation and confirm it fails first.

**Organization**: Tasks are grouped by user story so each increment has a stated independent test.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the dependency-free static application and browser-test tooling.

- [X] T001 [P] Create `package.json` with static-server and `test:e2e` scripts and the Playwright
  development dependency.
- [X] T002 [P] Create `.gitignore` for Node.js dependencies, Playwright output, and local test
  artifacts.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared task state, persistence, rendering, and styling before story work.

**⚠️ CRITICAL**: Complete this phase before starting a user-story phase.

- [X] T003 [P] Create the semantic application shell, labelled task form, empty-state container,
  task-list container, and persistent status region in `index.html`.
- [X] T004 [P] Define task creation and state-transition helpers in `src/todo.js`, enforcing
  `text` as "Required after trimming; cannot be empty or whitespace-only", `completed` as
  "Required boolean; defaults to `false`", and a unique generated `id`.
- [X] T005 [P] Implement versioned browser-local task-list loading and saving in `src/storage.js`,
  including unavailable storage, invalid data, and write-failure result states.
- [X] T006 [P] Create base responsive layout, visible keyboard focus, non-color completion
  indicators, status, validation, and persistence-warning styles in `src/styles.css`.
- [X] T007 Coordinate initial loading, empty-state rendering, status announcements, and
  recoverable storage-error display in `src/app.js` using `src/todo.js` and `src/storage.js`.

**Checkpoint**: A usable empty application shell and shared failure-handling behavior are ready.

---

## Phase 3: User Story 1 - Add a Task (Priority: P1) 🎯 MVP

**Goal**: Let a user add a non-empty task and retain it after a same-browser reload.

**Independent Test**: Add a valid task, observe it as incomplete, reload, and confirm it remains;
submit whitespace-only input and confirm feedback appears without adding a task.

- [X] T008 [US1] Write failing add-task, invalid-input, status-announcement, and reload-persistence
  scenarios in `tests/e2e/todo.spec.js`.
- [X] T009 [US1] Implement form submission, trimmed-text validation, incomplete task creation,
  visible feedback, status messaging, and persistence results in `src/app.js`.
- [X] T010 [US1] Refine add-form and validation-feedback presentation in `src/styles.css`.
- [X] T011 [US1] Make the User Story 1 scenarios pass in `tests/e2e/todo.spec.js`.

**Checkpoint**: A user can independently add and retain a task, with invalid input handled clearly.

---

## Phase 4: User Story 2 - Complete a Task (Priority: P2)

**Goal**: Let a user change a task between incomplete and complete, with the state retained.

**Independent Test**: Seed or add a task, use the task's keyboard-operable completion control,
observe the visible state change, reload, and confirm the changed state remains.

- [X] T012 [US2] Write failing completion, restoration, keyboard-operation, status-announcement,
  and reload-persistence scenarios in `tests/e2e/todo.spec.js`.
- [X] T013 [US2] Implement labelled native completion controls, complete/restore transitions,
  non-color state cues, status messages, and persistence results in `src/app.js`.
- [X] T014 [US2] Make the User Story 2 scenarios pass in `tests/e2e/todo.spec.js`.

**Checkpoint**: A user can independently distinguish, complete, restore, and retain task state.

---

## Phase 5: User Story 3 - Delete a Task (Priority: P3)

**Goal**: Let a user immediately delete an irrelevant task without a confirmation step.

**Independent Test**: Seed or add a task, delete it with its labelled control, confirm it vanishes
without a confirmation step, reload, and confirm it does not return.

- [X] T015 [US3] Write failing immediate-deletion, keyboard-focus, status-announcement, and
  reload-persistence scenarios in `tests/e2e/todo.spec.js`.
- [X] T016 [US3] Implement labelled immediate deletion, persistence results, deletion status
  messaging, and focus movement to the next control, previous control, or task input in
  `src/app.js`.
- [X] T017 [US3] Make the User Story 3 scenarios pass in `tests/e2e/todo.spec.js`.

**Checkpoint**: A user can independently remove a task immediately and continue keyboard operation
from a useful focus target.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate recovery behavior and full feature compliance without changing scope.

- [X] T018 Add corrupt-data, unavailable-storage, and failed-save in-memory-continuity scenarios
  to `tests/e2e/todo.spec.js`.
- [X] T019 Implement any recovery-path handling needed by the new scenarios in `src/storage.js`.
- [X] T020 Refine responsive narrow/wide layouts and persistence-warning visibility in
  `src/styles.css`.
- [X] T021 Run all end-to-end scenarios and resolve regressions in `tests/e2e/todo.spec.js`.
- [X] T022 Validate every quickstart workflow and record any documentation corrections in
  `specs/001-manage-todo-tasks/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; delivers the MVP.
- **User Story 2 (Phase 4)**: Depends on User Story 1's shared task-list UI.
- **User Story 3 (Phase 5)**: Depends on User Story 1's shared task-list UI and may follow User
  Story 2 sequentially because both modify the same application and browser-test files.
- **Polish (Phase 6)**: Depends on all selected user stories.

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational and is the MVP.
- **US2 (P2)**: Builds on the task-list UI introduced by US1; its test can seed its own task state.
- **US3 (P3)**: Builds on the task-list UI introduced by US1; its test can seed its own task state.

### Parallel Opportunities

- T001 and T002 use different files and can proceed in parallel.
- T003, T004, T005, and T006 use different files and can proceed in parallel after setup.
- No same-story tasks are marked parallel: each story updates `src/app.js` and
  `tests/e2e/todo.spec.js` in test-first order.

## Parallel Examples

### Setup and Foundational Work

```text
Task: "Create .gitignore for Node.js dependencies, Playwright output, and local test artifacts in .gitignore"
Task: "Create the semantic application shell in index.html"
Task: "Define task helpers in src/todo.js"
Task: "Implement browser-local persistence in src/storage.js"
Task: "Create base styles in src/styles.css"
```

### User Story 1

No same-story tasks can safely run in parallel: T008 must establish the failing browser scenarios
before T009 changes `src/app.js`, and T010 follows the resulting validation presentation.

### User Story 2

No same-story tasks can safely run in parallel: T012, T013, and T014 share
`tests/e2e/todo.spec.js` and `src/app.js` in test-first order.

### User Story 3

No same-story tasks can safely run in parallel: T015, T016, and T017 share
`tests/e2e/todo.spec.js` and `src/app.js` in test-first order.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational tasks.
2. Complete User Story 1.
3. Run its independent browser scenarios.
4. Demonstrate task creation, invalid-input feedback, and same-browser reload persistence.

### Incremental Delivery

1. Deliver US1 as the usable task-recording MVP.
2. Add US2 to track completion state without changing the add-task behavior.
3. Add US3 for immediate deletion and focus management.
4. Complete cross-cutting recovery and quickstart validation.
