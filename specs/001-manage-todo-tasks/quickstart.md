# Quickstart: Validate Manage TODO Tasks

## Prerequisites

- A current Node.js LTS installation for the browser-test runner.
- A modern browser with JavaScript and browser-local storage enabled.

## Setup

After implementation, install the development dependencies from the repository root:

```sh
npm install
```

## Run the application

Start the static application server provided by the project:

```sh
npm run start
```

Open the displayed local URL in a supported browser.

## Validate the core workflow

1. Add a task with a non-empty description and verify it appears as incomplete.
2. Reload the page and verify the task remains.
3. Toggle the task complete, reload, and verify its completion state remains.
4. Delete the task and verify it disappears immediately, without confirmation; reload and verify
   it does not return.
5. Submit an empty or whitespace-only description and verify no task is created and feedback is
   visible.
6. Use only the keyboard to add, toggle, and delete a task. Verify the status message updates and
   focus lands on a useful control after deletion.
7. Simulate unavailable or failing browser-local storage through the browser tests and verify the
   changed in-memory list remains visible with a persistence warning.

See [data-model.md](./data-model.md) for state rules and
[TODO UI Contract](./contracts/todo-ui-contract.md) for the UI and accessibility contract.

## Run automated validation

```sh
npm run test:e2e
```

The test suite must cover the scenarios above, including reload persistence, invalid input,
immediate deletion, keyboard access, focus behavior, and recoverable storage failures.
