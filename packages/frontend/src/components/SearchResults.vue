<template>
  <div class="search-results">
    <div v-if="results.length === 0" class="empty-state">
      <p>No results found</p>
    </div>
    <div v-else class="results-list">
      <div
        v-for="result in folderResults"
        :key="result.id"
        class="result-item"
        @click="$emit('select', result)"
      >
        <FolderIcon :is-open="false" />
        <span class="result-name">{{ result.name }}</span>
        <span class="result-type">Folder</span>
      </div>
      <div
        v-for="result in fileResults"
        :key="result.id"
        class="result-item file"
      >
        <FileIcon />
        <span class="result-name">{{ result.name }}</span>
        <span class="result-type">File</span>
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
  results: FileSystemNode[];
}>();

defineEmits<{
  select: [node: FileSystemNode];
}>();

const folderResults = computed(() =>
  props.results.filter((r) => r.type === NodeType.FOLDER)
);

const fileResults = computed(() =>
  props.results.filter((r) => r.type === NodeType.FILE)
);
</script>

<style scoped>
.search-results {
  padding: 8px;
}

.empty-state {
  padding: 32px 16px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.result-item:hover {
  background-color: #e3f2fd;
}

.result-item.file {
  cursor: default;
  opacity: 0.7;
}

.result-item.file:hover {
  background-color: transparent;
}

.result-name {
  flex: 1;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-type {
  font-size: 12px;
  color: #666;
}
</style>