<template>
  <div class="file-list">
    <div v-if="!selectedFolder" class="empty-state">
      <p>Select a folder to view its contents</p>
    </div>

    <div v-else>
      <div class="header">
        <div class="header-content">
          <FolderIcon :is-open="true" size="20" />
          <h3>{{ selectedFolder.name }}</h3>
        </div>
        <div class="header-actions">
          <button
            class="action-btn action-btn-new"
            title="New Item"
            @click="$emit('create-in-folder', selectedFolder)"
          >
            <span class="btn-icon">➕</span>
            <span>New</span>
          </button>
          <button
            class="action-btn action-btn-rename"
            title="Rename Folder"
            @click="handleRenameFolder"
          >
            <span class="btn-icon">✏️</span>
            <span>Rename</span>
          </button>
          <button
            class="action-btn action-btn-delete"
            title="Delete Folder"
            @click="handleDeleteFolder"
          >
            <span class="btn-icon">🗑️</span>
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div class="subheader">
        <span class="count">{{ children.length }} item(s)</span>
      </div>

      <div v-if="children.length === 0" class="empty-state">
        <p>This folder is empty</p>
      </div>

      <div v-else class="items-grid">
        <FileItem
          v-for="item in children"
          :key="item.id"
          :node="item"
          @click="handleItemClick(item)"
          @context-menu="$emit('context-menu', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FileSystemNode, FileSystemNodeTree } from '@/types';
import { NodeType } from '@/types';
import FileItem from './FileItem.vue';
import FolderIcon from './icons/FolderIcon.vue';

const props = defineProps<{
  selectedFolder: FileSystemNodeTree | null;
  children: FileSystemNode[];
}>();

const emit = defineEmits<{
  selectFolder: [node: FileSystemNode];
  contextMenu: [event: { node: FileSystemNode; x: number; y: number }];
  createInFolder: [folder: FileSystemNodeTree];
  renameFolder: [folder: FileSystemNodeTree];
  deleteFolder: [folder: FileSystemNodeTree];
}>();

function handleItemClick(item: FileSystemNode) {
  if (item.type === NodeType.FOLDER) {
    emit('selectFolder', item);
  }
}

function handleRenameFolder() {
  if (props.selectedFolder) {
    emit('renameFolder', props.selectedFolder);
  }
}

function handleDeleteFolder() {
  if (props.selectedFolder) {
    emit('deleteFolder', props.selectedFolder);
  }
}
</script>

<style scoped>
.file-list {
  padding: 16px;
  background-color: #f5f5f5;
  height: 100%;
  overflow-y: auto;
}

.header {
  margin-bottom: 8px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.header-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn-new {
  color: #2196f3;
  border-color: #2196f3;
}

.action-btn-new:hover {
  background: #e3f2fd;
}

.action-btn-rename {
  color: #ff9800;
  border-color: #ff9800;
}

.action-btn-rename:hover {
  background: #fff3e0;
}

.action-btn-delete {
  color: #f44336;
  border-color: #f44336;
}

.action-btn-delete:hover {
  background: #ffebee;
}

.btn-icon {
  font-size: 14px;
}

.subheader {
  margin-bottom: 12px;
  padding: 0 4px;
}

.count {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 16px;
  color: #999;
  font-size: 14px;
}

.items-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

/* Responsive design */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-wrap: wrap;
  }

  .action-btn span:not(.btn-icon) {
    display: none;
  }
}
</style>