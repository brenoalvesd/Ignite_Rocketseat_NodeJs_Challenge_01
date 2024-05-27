import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes = [
  {
  method: 'POST',
  path: buildRoutePath('/tasks'),
  handler: (req, res) => {
    const { title, description } = req.body

    if (!title) {
      return res.writeHead(400).end(
        JSON.stringify({ message: 'Title is required' }),
      )
    }

    if (!description) {
      return res.writeHead(400).end(
        JSON.stringify({message: 'Description is required' })
      )
    }

    const task = {
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    database.insert('tasks', task)

    return res.writeHead(201).end('Task created successfully!')
  }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', {
        title: search,
        description: search
      })

      return res.end(JSON.stringify(tasks))
    }
  }
]