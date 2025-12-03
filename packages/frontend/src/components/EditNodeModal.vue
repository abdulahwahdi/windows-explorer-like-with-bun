<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2>Edit {{ node?.type === 'FOLDER' ? 'Folder' : 'File' }}</h2>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="edit-name">Name *</label>
          <input
            id="edit-name"
            v-model="formData.name"
            type="text"
            class="form-control"
            placeholder="Enter name..."
            @keyup.enter="handleSubmit"
          />
        </div>

        <div v-if="node?.type === 'FILE'" class="form-group">
          <label for="edit-mime-type">MIME Type</label>
          <input
            id="edit-mime-type"
            v-model="formData.mimeType"
            type="text"
            class="form-control"
            placeholder="e.g., text/plain, image/png"
          />
        </div>

        <div v-if="node?.type === 'FILE'" class="form-group">
          <label for="edit-size">Size (bytes)</label>
          <input
            id="edit-size"
            v-model.number="formData.size"
            type="number"
            class="form-control"
            placeholder="Enter file size..."
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">Cancel</button>
        <button 
          class="btn btn-primary" 
          @click="handleSubmit"
          :disabled="!formData.name || loading"
        >
          <span v-if="loading">Saving...</span>
          <span v-else>Save</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { FileSystemNode } from '@/types';

interface EditFormData {
  name: string;
  mimeType: string | null;
  size: number | null;
}

const props = defineProps<{
  isOpen: boolean;
  node: FileSystemNode | null;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: EditFormData];
}>();

const formData = ref<EditFormData>({
  name: '',
  mimeType: null,
  size: null,
});

const loading = ref(false);
const error = ref<string | null>(null);

watch(() => props.node, (newNode) => {
  if (newNode) {
    formData.value = {
      name: newNode.name,
      mimeType: newNode.mimeType || null,
      size: newNode.size ? Number(newNode.size) : null,
    };
  }
}, { immediate: true });

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

function handleSubmit() {
  if (!formData.value.name.trim()) {
    error.value = 'Name is required';
    return;
  }

  error.value = null;
  emit('submit', formData.value);
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
  max-width: 500px;
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
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.error-message {
  padding: 12px;
  background: #ffebee;
  border: 1px solid #ef5350;
  border-radius: 6px;
  color: #c62828;
  font-size: 14px;
  margin-top: 16px;
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

.btn-primary {
  background: #2196f3;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1976d2;
}
</style>