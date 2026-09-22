import test from 'node:test';
import assert from 'node:assert/strict';
import { initialTasks } from './tasks.js';
import { getVisibleTasks } from './selectTasks.js';

test('lecturer sees only class tasks', () => {
  const result = getVisibleTasks(initialTasks, { id: 'lecturer-1', role: 'administrator' });
  assert.deepEqual(result.map((task) => task.id), ['task-1', 'task-2']);
});

test('student sees class tasks and only their own personal tasks, sorted by due date', () => {
  const result = getVisibleTasks(initialTasks, { id: 'student-1', role: 'client' });
  assert.deepEqual(result.map((task) => task.id), ['task-3', 'task-1', 'task-2']);
});

test('empty list stays empty', () => {
  assert.deepEqual(getVisibleTasks([], { id: 'student-1', role: 'client' }), []);
});
