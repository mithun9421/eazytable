export type User = {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  department: string
  joinedAt: string
}

export const USERS: User[] = [
  { id: 1,  name: 'Alice Johnson',  email: 'alice@example.com',  role: 'Admin',   status: 'active',   department: 'Engineering', joinedAt: '2022-01-15' },
  { id: 2,  name: 'Bob Smith',      email: 'bob@example.com',    role: 'Editor',  status: 'active',   department: 'Design',      joinedAt: '2022-03-22' },
  { id: 3,  name: 'Carol White',    email: 'carol@example.com',  role: 'Viewer',  status: 'inactive', department: 'Marketing',   joinedAt: '2022-06-01' },
  { id: 4,  name: 'David Lee',      email: 'david@example.com',  role: 'Editor',  status: 'active',   department: 'Engineering', joinedAt: '2022-08-10' },
  { id: 5,  name: 'Eva Martinez',   email: 'eva@example.com',    role: 'Admin',   status: 'active',   department: 'Product',     joinedAt: '2022-09-05' },
  { id: 6,  name: 'Frank Chen',     email: 'frank@example.com',  role: 'Viewer',  status: 'inactive', department: 'Sales',       joinedAt: '2023-01-20' },
  { id: 7,  name: 'Grace Kim',      email: 'grace@example.com',  role: 'Editor',  status: 'active',   department: 'Design',      joinedAt: '2023-02-14' },
  { id: 8,  name: 'Henry Brown',    email: 'henry@example.com',  role: 'Viewer',  status: 'active',   department: 'Marketing',   joinedAt: '2023-04-03' },
  { id: 9,  name: 'Iris Turner',    email: 'iris@example.com',   role: 'Editor',  status: 'active',   department: 'Engineering', joinedAt: '2023-05-18' },
  { id: 10, name: 'James Wilson',   email: 'james@example.com',  role: 'Viewer',  status: 'inactive', department: 'Sales',       joinedAt: '2023-07-07' },
]

export type Task = {
  id: number
  title: string
  status: 'Todo' | 'In Progress' | 'Review' | 'Done'
  assignee: string
  priority: 'Low' | 'Medium' | 'High'
}

export const TASKS: Task[] = [
  { id: 1, title: 'Design homepage hero',       status: 'Done',        assignee: 'Alice',  priority: 'High' },
  { id: 2, title: 'Implement auth flow',         status: 'In Progress', assignee: 'Bob',    priority: 'High' },
  { id: 3, title: 'Write API documentation',    status: 'Todo',        assignee: 'Carol',  priority: 'Medium' },
  { id: 4, title: 'Set up CI/CD pipeline',      status: 'Done',        assignee: 'David',  priority: 'High' },
  { id: 5, title: 'Add dark mode support',      status: 'In Progress', assignee: 'Eva',    priority: 'Medium' },
  { id: 6, title: 'Fix mobile nav bug',         status: 'Review',      assignee: 'Frank',  priority: 'Low' },
  { id: 7, title: 'Performance audit',          status: 'Todo',        assignee: 'Grace',  priority: 'Medium' },
  { id: 8, title: 'Update dependencies',        status: 'Review',      assignee: 'Henry',  priority: 'Low' },
]
