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
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({ message: 'Title or Description are required' })
        )
      }

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end('There is no task with this id')
      }

      database.update('tasks', id, {
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date()
      })

      return res.writeHead(204).end('Task updated successfully!')
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
    
      if (!id) {
        return res.writeHead(404).end('ID is required');
      }

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end('There is no task with this given ID')
      } else {
        database.delete('tasks', id)
        
        return res.writeHead(204).end('Task deleted successfully!')
      }
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      
      const [task] = database.select('tasks', { id })

      if (!task) {
          return res.writeHead(404).end(JSON.stringify({ message: 'There is no task with this given ID' }))
      } else {
          database.update('tasks', id, { completed_at: new Date().toISOString() })

          return res.writeHead(204).end('Task status updated successfully!')
      }
    }
  }
]