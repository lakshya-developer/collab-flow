export const users = [
  {
    id: 'u1',
    name: 'Alex',
    email: 'alex@example.com',
    password: 'password123',
    role: 'manager',
  },
  {
    id: 'u2',
    name: 'Nina',
    email: 'nina@example.com',
    password: 'password123',
    role: 'developer',
  },
]

export const projects = [
  {
    id: 'p1',
    name: 'Website Redesign',
    owner: 'Alex',
    status: 'In Progress',
    dueDate: '2026-08-01',
  },
  {
    id: 'p2',
    name: 'Marketing Launch',
    owner: 'Nina',
    status: 'Review',
    dueDate: '2026-08-09',
  },
]

export const tasks = [
  {
    id: 't1',
    title: 'Design landing page',
    projectId: 'p1',
    assignee: 'Alex',
    status: 'To Do',
    dueDate: '2026-07-20',
  },
  {
    id: 't2',
    title: 'Build dashboard UI',
    projectId: 'p1',
    assignee: 'Nina',
    status: 'In Progress',
    dueDate: '2026-07-22',
  },
  {
    id: 't3',
    title: 'Publish marketing copy',
    projectId: 'p2',
    assignee: 'Alex',
    status: 'Review',
    dueDate: '2026-07-25',
  },
]
