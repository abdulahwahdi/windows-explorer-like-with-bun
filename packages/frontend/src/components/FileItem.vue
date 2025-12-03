<template>
  <div
    class="file-item"
    :class="{ clickable: isFolder }"
    @contextmenu.prevent="handleContextMenu"
  >
    <FolderIcon v-if="isFolder" :is-open="false" size="20" />
    <FileIcon v-else size="20" />
    
    <div class="item-info">
      <div class="item-name">{{ node.name }}</div>
      <div class="item-meta">
        {{ node.type === 'FOLDER' ? 'Folder' : 'File' }}
        <span v-if="node.size"> • {{ formatSize(node.size) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FileSystemNode } from '@/types';
import { NodeType } from '@/types';
import FolderIcon from './icons/FolderIcon.vue';
import FileIcon from './icons/FileIcon.vue';

const props = defineProps<{
  node: FileSystemNode;
}>();

const emit = defineEmits<{
  contextMenu: [event: { node: FileSystemNode; x: number; y: number }];
}>();

const isFolder = computed(() => props.node.type === NodeType.FOLDER);

function formatSize(size: bigint | null | undefined): string {
  if (!size) return '';
  const bytes = Number(size);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function handleContextMenu(event: MouseEvent) {
  emit('contextMenu', {
    node: props.node,
    x: event.clientX,
    y: event.clientY,
  });
}
</script>

<style scoped>
.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
}

.file-item.clickable {
  cursor: pointer;
}

.file-item.clickable:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}
</style>