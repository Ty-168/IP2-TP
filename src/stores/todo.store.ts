import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apolloClient } from '@/apollo/client'
import { GET_TODOS, ADD_TODO, TOGGLE_TODO, DELETE_TODO, TODOS_SUB } from '../graphql/todo'

export type Todo = {
  id: number
  title: string
  is_done: boolean
  created_at: string
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTodos() {
    loading.value = true
    error.value = null
    try {
      const { data } = await apolloClient.query<{ todos: Todo[] }>({
        query: GET_TODOS,
        fetchPolicy: 'network-only', // keep it simple for students
      })
      todos.value = data.todos
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load todos'
    } finally {
      loading.value = false
    }
  }

  async function addTodo(title: string) {
    const clean = title.trim()
    if (!clean) return
    error.value = null

    const tempId = -Date.now()
    const optimisticTodo: Todo = {
      id: tempId,
      title: clean,
      is_done: false,
      created_at: new Date().toISOString(),
    }

    todos.value = [optimisticTodo, ...todos.value]

    try {
      const { data } = await apolloClient.mutate<{ insert_todos_one: Todo }>({
        mutation: ADD_TODO,
        variables: { title: clean },
        update: (cache, result) => {
          const newTodo = result.data?.insert_todos_one
          if (!newTodo) return
          try {
            const existing = cache.readQuery<{ todos: Todo[] }>({ query: GET_TODOS })
            const next = existing?.todos ? [newTodo, ...existing.todos] : [newTodo]
            cache.writeQuery({ query: GET_TODOS, data: { todos: next } })
          } catch {
            cache.writeQuery({ query: GET_TODOS, data: { todos: [newTodo] } })
          }
        },
      })

      const created = data?.insert_todos_one
      if (created) {
        todos.value = [created, ...todos.value.filter((t) => t.id !== tempId)]
      }
    } catch (e: any) {
      todos.value = todos.value.filter((t) => t.id !== tempId)
      error.value = e.message ?? 'Failed to add todo'
    }
  }

  async function toggleTodo(todo: Todo) {
    const prev = todo.is_done
    const idx = todos.value.findIndex((t) => t.id === todo.id)
    if (idx !== -1) {
      const current = todos.value[idx]!
      todos.value[idx] = { ...current, is_done: !prev }
    }

    try {
      await apolloClient.mutate<{ update_todos_by_pk: Pick<Todo, 'id' | 'is_done'> }>({
        mutation: TOGGLE_TODO,
        variables: { id: todo.id, done: !prev },
        update: (cache, result) => {
          const updated = result.data?.update_todos_by_pk
          if (!updated) return
          try {
            const existing = cache.readQuery<{ todos: Todo[] }>({ query: GET_TODOS })
            if (!existing?.todos) return
            const next = existing.todos.map((t) =>
              t.id === updated.id ? { ...t, is_done: updated.is_done } : t,
            )
            cache.writeQuery({ query: GET_TODOS, data: { todos: next } })
          } catch {
            // ignore cache update when query is not in cache yet
          }
        },
      })
    } catch (e: any) {
      if (idx !== -1) {
        const current = todos.value[idx]!
        todos.value[idx] = { ...current, is_done: prev }
      }
      error.value = e.message ?? 'Failed to toggle todo'
    }
  }

  async function deleteTodo(id: number) {
    const prev = todos.value
    todos.value = todos.value.filter((t) => t.id !== id)

    try {
      await apolloClient.mutate<{ delete_todos_by_pk: Pick<Todo, 'id'> }>({
        mutation: DELETE_TODO,
        variables: { id },
        update: (cache, result) => {
          const deleted = result.data?.delete_todos_by_pk
          if (!deleted) return
          try {
            const existing = cache.readQuery<{ todos: Todo[] }>({ query: GET_TODOS })
            if (!existing?.todos) return
            const next = existing.todos.filter((t) => t.id !== deleted.id)
            cache.writeQuery({ query: GET_TODOS, data: { todos: next } })
          } catch {
            // ignore cache update when query is not in cache yet
          }
        },
      })
    } catch (e: any) {
      todos.value = prev
      error.value = e.message ?? 'Failed to delete todo'
    }
  }

  // Optional: realtime updates (subscription)
  function startRealtime() {
    const obs = apolloClient.subscribe<{ todos: Todo[] }>({
      query: TODOS_SUB,
    })

    const sub = obs.subscribe({
      next: ({ data }) => {
        if (data?.todos) todos.value = data.todos
      },
      error: (e) => {
        // keep app running even if WS fails
        console.error('Subscription error', e)
      },
    })

    return () => sub.unsubscribe()
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    startRealtime,
  }
})
