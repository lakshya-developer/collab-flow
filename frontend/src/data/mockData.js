export const mockProjects = [
  {
    id: 'p1',
    name: 'Website Redesign',
    owner: 'Alex',
    status: 'In Progress',
    due: 'Aug 1',
    progress: 72,
  },
  {
    id: 'p2',
    name: 'Marketing Launch',
    owner: 'Nina',
    status: 'Review',
    due: 'Aug 9',
    progress: 55,
  },
  {
    id: 'p3',
    name: 'Sprint Planning',
    owner: 'Jordan',
    status: 'To Do',
    due: 'Aug 15',
    progress: 22,
  },
]

export const mockTasks = [
  {
    id: 't1',
    title: 'Design header component',
    owner: 'Alex',
    status: 'To Do',
    due: 'Jul 20',
  },
  {
    id: 't2',
    title: 'Implement auth flow',
    owner: 'Nina',
    status: 'In Progress',
    due: 'Jul 22',
  },
  {
    id: 't3',
    title: 'Write project spec',
    owner: 'Jordan',
    status: 'Review',
    due: 'Jul 23',
  },
  {
    id: 't4',
    title: 'Publish demo UI',
    owner: 'Sam',
    status: 'Done',
    due: 'Jul 18',
  },
  {
    id: 't5',
    title: 'Save task to local state',
    owner: 'Mia',
    status: 'To Do',
    due: 'Jul 25',
  },
]

export const mockTeam = [
  { id: 'u1', name: 'Alex', role: 'Frontend' },
  { id: 'u2', name: 'Nina', role: 'Backend' },
  { id: 'u3', name: 'Jordan', role: 'Product' },
  { id: 'u4', name: 'Sam', role: 'QA' },
]

export const statuses = ['To Do', 'In Progress', 'Review', 'Done']
