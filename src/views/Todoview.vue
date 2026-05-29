<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import TodoCard from '@/components/TodoCard.vue'
import { useTodoStore } from '@/stores/todo.store'

const todoStore = useTodoStore()
let stopRealtime: null | (() => void) = null

const newTodo = ref('')

const todos = computed(() => todoStore.todos)
const loading = computed(() => todoStore.loading)
const error = computed(() => todoStore.error)

const remainingCount = computed(() => todos.value.filter((todo) => !todo.is_done).length)
const activeTodos = computed(() => todos.value.filter((todo) => !todo.is_done))
const doneTodos = computed(() => todos.value.filter((todo) => todo.is_done))

type FilterTab = 'all' | 'active' | 'done'
const currentTab = ref<FilterTab>('all')

const visibleTodos = computed(() => {
  if (currentTab.value === 'active') return activeTodos.value
  if (currentTab.value === 'done') return doneTodos.value
  return todos.value
})

const addTodo = () => {
  const text = newTodo.value.trim()
  if (!text) return
  //   todos.value.push({ id: Date.now(), text, done: false })
  todoStore.addTodo(text)
  newTodo.value = ''
}

const toggleTodo = async (id: number) => {
  const todo = todos.value.find((item) => item.id === id)
  if (!todo) return
  await todoStore.toggleTodo(todo)
}

const removeTodo = async (id: number) => {
  await todoStore.deleteTodo(id)
}

onMounted(async () => {
  await todoStore.fetchTodos()
  stopRealtime = todoStore.startRealtime()
})

onBeforeUnmount(() => stopRealtime?.())
</script>

<template>
  <main class="min-h-screen bg-gray-50 px-4 py-12 text-gray-800">
    <section class="mx-auto w-full max-w-sm space-y-5">
      <header class="text-center">
        <h1 class="text-2xl font-semibold">Your To Do</h1>
      </header>

      <form class="flex items-center gap-2" @submit.prevent="addTodo">
        <input
          v-model="newTodo"
          type="text"
          placeholder="Add new task"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          @click="addTodo"
          class="grid h-9 w-9 place-items-center rounded-md bg-gray-700 text-white"
          aria-label="Add todo"
        >
          +
        </button>
      </form>

      <p v-if="loading" class="text-center text-base text-gray-500">Loading todos...</p>
      <p v-else-if="error" class="text-center text-base text-red-600">{{ error }}</p>

      <div v-else class="space-y-3">
        <nav class="flex items-center justify-center gap-2 text-base">
          <button
            type="button"
            class="rounded-full px-3 py-1"
            :class="currentTab === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'"
            @click="currentTab = 'all'"
          >
            All ({{ todos.length }})
          </button>
          <button
            type="button"
            class="rounded-full px-3 py-1"
            :class="currentTab === 'active' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'"
            @click="currentTab = 'active'"
          >
            Active ({{ activeTodos.length }})
          </button>
          <button
            type="button"
            class="rounded-full px-3 py-1"
            :class="currentTab === 'done' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'"
            @click="currentTab = 'done'"
          >
            Done ({{ doneTodos.length }})
          </button>
        </nav>

        <ul class="space-y-3">
          <TodoCard
            v-for="todo in visibleTodos"
            :key="todo.id"
            :todo="todo"
            @toggle="toggleTodo"
            @remove="removeTodo"
          />
        </ul>
      </div>

      <p class="text-center text-sm text-gray-600">Your remaining todos : {{ remainingCount }}</p>

      <p class="text-center text-sm italic text-gray-400">
        "Doing what you love is the cornerstone of having abundance in your life." – Wayne Dyer
      </p>
    </section>
  </main>
</template>
