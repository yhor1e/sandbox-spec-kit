# Research: Manage TODO Tasks

## Decision: Use native browser modules with no runtime framework

**Rationale**: The application has one view and four state-changing interactions. Native HTML,
CSS, and ECMAScript modules keep the learning focus on semantic controls, DOM events, state, and
browser persistence without adding a build step or runtime dependency.

**Alternatives considered**:

- A component framework and bundler: rejected because the feature does not need routing, shared
  application state, or multiple views.
- A smaller UI library: rejected because it still obscures DOM-update behavior without reducing a
  current requirement.
- TypeScript: deferred; it is useful if the domain grows but adds a compile step for this exercise.

## Decision: Persist one versioned task-list record in browser-local storage

**Rationale**: A single small record is simple to read and update after each mutation, and a
version permits a future migration. A stable, generated task identifier prevents identity from
changing when a task is deleted or reordered.

**Alternatives considered**:

- A storage record per task: rejected because it complicates consistency without a benefit for one
  small list.
- IndexedDB: rejected as unnecessary for the expected data volume.
- A remote service: rejected because accounts, synchronization, and servers are out of scope.

## Decision: Degrade gracefully when persistence fails

**Rationale**: Browser storage can be disabled, full, or contain invalid data. The application
will retain the current session's state in memory, show a non-blocking persistence notice, and
must not claim an unsaved change was saved. Invalid stored data is treated as an empty list without
preventing the application from starting.

**Alternatives considered**:

- Blocking task actions on a storage failure: rejected because the application remains useful in
  the current session.
- Silently discarding changes: rejected by the constitution and feature requirements.

## Decision: Prefer native accessible controls and targeted status announcements

**Rationale**: A labelled form, checkbox controls, and buttons provide keyboard operation and
semantics by default. A persistent polite status region announces task actions and recoverable
storage failures without moving focus. After deletion, focus moves to an adjacent task action or
the task input.

**Alternatives considered**:

- Clickable generic elements and custom ARIA roles: rejected because native elements are clearer
  and less error-prone.
- Announcing the entire task list: rejected because repeated full-list announcements are noisy.

## Decision: Test browser-visible behavior with Playwright

**Rationale**: The requirements cover real browser storage, keyboard behavior, focus, and status
announcements. Browser tests can verify those outcomes through role- and label-based locators
without coupling tests to implementation details.

**Alternatives considered**:

- DOM-only tests: insufficient for browser persistence and focus behavior.
- Manual testing only: rejected because it provides no regression protection.
