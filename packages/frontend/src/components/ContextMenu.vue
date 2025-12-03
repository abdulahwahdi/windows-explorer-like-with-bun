<template>
  <div
    v-if="isVisible"
    ref="menuRef"
    class="context-menu"
    :style="menuStyle"
  >
    <button class="menu-item" @click="handleEdit">
      <span class="menu-icon">✏️</span>
      <span>Rename</span>
    </button>
    <button class="menu-item danger" @click="handleDelete">
      <span class="menu-icon">🗑️</span>
      <span>Delete</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  x: number;
  y: number;
}>();

const emit = defineEmits<{
  close: [];
  edit: [];
  delete: [];
}>();

const menuRef = ref<HTMLElement | null>(null);

const menuStyle = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
}));

function handleEdit() {
  emit('edit');
  emit('close');
}

function handleDelete() {
  emit('delete');
  emit('close');
}

function handleClickOutside(event: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    emit('close');
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  z-index: 1001;
  padding: 4px 0;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  transition: background-color 0.15s;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item.danger:hover {
  background: #ffebee;
  color: #d32f2f;
}

.menu-icon {
  font-size: 16px;
}
</style>