import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title = null, description = null } = req.body
      
      if (!title || !description){
        return res.writeHead(400).end();
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res.end(JSON.stringify(task))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { title = null, description = null } = req.body
      
      if (!title && !description){
        return res.writeHead(400).end();
      }

      const { id } = req.params;
      const selectedItem = database.findById('tasks', id);

      if (!selectedItem){
        return res.writeHead(402).end()
      }
      const updatedData = {
        ...selectedItem,
        title: title ? title : selectedItem.title,
        description: description ? description : selectedItem.description,
        updated_at: new Date()
      }

      database.update('tasks', id, updatedData);

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      const selectedItem = database.select('tasks', { id });

      if (selectedItem.length < 1){
        return res.end(402);
      }
      const updatedData = {
        ...selectedItem[0],
        completed_at: selectedItem[0].completed_at ? null : new Date(),
        updated_at: new Date(),
      }

      database.update('tasks', id, updatedData);

      return res.writeHead(204).end()
    }
  }
]
