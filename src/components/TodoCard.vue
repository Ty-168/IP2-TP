<script setup lang="ts">
import type { Todo } from '@/stores/todo.store'

const props = defineProps<{ todo: Todo }>()
const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'remove', id: number): void
}>()

const onToggle = () => emit('toggle', props.todo.id)
const onRemove = () => emit('remove', props.todo.id)
</script>

<template>
  <li
    class="flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm"
  >
    <label class="flex items-center gap-2 text-base text-gray-700">
      <input
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-800"
        :checked="todo.is_done"
        @change="onToggle"
      />
      <span :class="todo.is_done ? 'text-gray-400 line-through' : ''">
        {{ todo.title }}
      </span>
    </label>
    <button
      type="button"
      class="grid h-6 w-6 place-items-center rounded-full text-gray-500 hover:bg-gray-100"
      aria-label="Remove todo"
      @click="onRemove"
    >
      ×
    </button>
  </li>
</template>
