import { userStore } from '../storage/userStore';
import { sessionStore } from '../storage/sessionStore';
import { emailTaskStore, EmailTaskItem } from '../storage/emailTaskStore';
import { store } from '../storage/store';

console.log('👥 Starting OrkaAI Multi-User Isolation Tests...\n');

// 1. Create User A and User B
const userA = userStore.findOrCreateUser({
  email: 'usera@example.com',
  name: 'User A',
  googleId: 'g_user_a_123'
});

const userB = userStore.findOrCreateUser({
  email: 'userb@example.com',
  name: 'User B',
  googleId: 'g_user_b_456'
});

if (!userA.id || !userB.id || userA.id === userB.id) {
  console.error('✕ Test 1 Failed: User creation failed or IDs overlapped.');
  process.exit(1);
}
console.log(`✓ Test 1 Passed: Created isolated User A [${userA.id}] and User B [${userB.id}]`);

// 2. Create sessions for User A and User B
const sessionA = sessionStore.createSession({
  userId: userA.id,
  email: userA.email,
  name: userA.name
});

const sessionB = sessionStore.createSession({
  userId: userB.id,
  email: userB.email,
  name: userB.name
});

if (sessionA.userId !== userA.id || sessionB.userId !== userB.id) {
  console.error('✕ Test 2 Failed: Sessions did not bind to correct user IDs.');
  process.exit(1);
}
console.log('✓ Test 2 Passed: User session bindings verified.');

// 3. Add email task for User A and email task for User B
const taskA: EmailTaskItem = {
  id: 'task_user_a_1',
  userId: userA.id,
  emailId: 'msg_a_1',
  sender: 'client_a@external.com',
  subject: 'Task for User A',
  receivedAt: new Date().toISOString(),
  bodySnippet: 'Please complete task A',
  actionable: true,
  summary: 'Task A summary',
  requestedAction: 'Complete task A',
  priority: 'high',
  technicalTask: true,
  category: 'CODING',
  repositoryUrls: [],
  confidence: 0.95,
  status: 'NEW',
  proposedPlan: ['Step 1'],
  createdAt: new Date().toISOString()
};

const taskB: EmailTaskItem = {
  id: 'task_user_b_1',
  userId: userB.id,
  emailId: 'msg_b_1',
  sender: 'client_b@external.com',
  subject: 'Task for User B',
  receivedAt: new Date().toISOString(),
  bodySnippet: 'Please complete task B',
  actionable: true,
  summary: 'Task B summary',
  requestedAction: 'Complete task B',
  priority: 'medium',
  technicalTask: true,
  category: 'CODING',
  repositoryUrls: [],
  confidence: 0.9,
  status: 'NEW',
  proposedPlan: ['Step 1'],
  createdAt: new Date().toISOString()
};

emailTaskStore.addTask(taskA);
emailTaskStore.addTask(taskB);

const userATasks = emailTaskStore.getAllTasks(userA.id);
const userBTasks = emailTaskStore.getAllTasks(userB.id);

const userAHasB = userATasks.some(t => t.id === taskB.id);
const userBHasA = userBTasks.some(t => t.id === taskA.id);

if (userAHasB || userBHasA) {
  console.error('✕ Test 3 Failed: Cross-user data leakage detected in emailTaskStore!', { userATasks, userBTasks });
  process.exit(1);
}
console.log('✓ Test 3 Passed: Email task store multi-user isolation verified (Zero leakage).');

// 4. Test Activity store isolation
store.addActivity({
  id: 'act_a_1',
  userId: userA.id,
  timestamp: '10:00 AM',
  timeFormatted: 'Just now',
  dateGroup: 'Today',
  goal: 'User A Goal',
  actionsCount: 2,
  status: 'Completed'
});

store.addActivity({
  id: 'act_b_1',
  userId: userB.id,
  timestamp: '10:05 AM',
  timeFormatted: 'Just now',
  dateGroup: 'Today',
  goal: 'User B Goal',
  actionsCount: 3,
  status: 'Completed'
});

const userAActivities = store.getActivities(userA.id);
const userBActivities = store.getActivities(userB.id);

if (userAActivities.some(a => a.id === 'act_b_1') || userBActivities.some(a => a.id === 'act_a_1')) {
  console.error('✕ Test 4 Failed: Cross-user activity leakage detected!');
  process.exit(1);
}
console.log('✓ Test 4 Passed: Activity audit log multi-user isolation verified.');

console.log('\n🎉 ALL MULTI-USER ISOLATION TESTS PASSED CLEANLY!\n');
