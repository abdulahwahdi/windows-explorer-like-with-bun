<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2>Confirm Delete</h2>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="modal-body">
        <div class="warning-icon">⚠️</div>
        <p class="warning-text">
          Are you sure you want to delete 
          <strong>{{ node?.name }}</strong>?
        </p>
        <p v-if="node?.type === 'FOLDER'" class="warning-subtext">
          This will also delete all files and folders inside it.
        </p>
        <p class="warning-subtext">
          This action cannot be undone.
        </p>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">Cancel</button>
        <button 
          class="btn btn-danger" 
          @click="handleConfirm"
          :disabled="loading"
        >
          <span v-if="loading">Deleting...</span>
          <span v-else>Delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { FileSystemNode } from '@/types';

const props = defineProps<{
  isOpen: boolean;
  node: FileSystemNode | null;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const loading = ref(false);
const error = ref<string | null>(null);

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    error.value = null;
  }
});

function close() {
  emit('close');
}

function handleOverlayClick() {
  close();
}

function handleConfirm() {
  error.value = null;
  emit('confirm');
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f0f0f0;
}

.modal-body {
  padding: 20px;
  text-align: center;
}

.warning-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.warning-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
}

.warning-subtext {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.error-message {
  padding: 12px;
  background: #ffebee;
  border: 1px solid #ef5350;
  border-radius: 6px;
  color: #c62828;
  font-size: 14px;
  margin-top: 16px;
  text-align: left;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-secondary:hover:not(:disabled) {
  background: #e0e0e0;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #d32f2f;
}
</style>
