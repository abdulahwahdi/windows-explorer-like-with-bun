<template>
  <div class="app" @click="closeContextMenu">
    <header class="app-header">
      <h1>File Explorer</h1>
      <SearchBar
        v-model="searchQuery"
        :is-searching="isSearching"
        :results-count="searchResults.length"
      />
    </header>

    <div v-if="loading && !folderTree.length" class="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>

    <div v-else class="main-content">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>Folders</h2>
          <button
            class="btn-new"
            title="New Folder/File at Root"
            @click="openCreateModal"
          >
            + New
          </button>
        </div>
        <div class="sidebar-content">
          <FolderTree
            v-if="!searchQuery"
            :nodes="folderTree"
            :selected-id="selectedNode?.id || null"
            @select="handleSelectNode"
            @toggle="toggleFolder"
            @context-menu="handleContextMenu"
          />
          <SearchResults
            v-else
            :results="searchResults"
            @select="handleSelectNode"
          />
        </div>
      </aside>

      <main class="content">
        <FileList
          :selected-folder="selectedNode"
          :children="children"
          @select-folder="handleSelectNode"
          @context-menu="handleContextMenu"
          @create-in-folder="handleCreateInFolder"
          @rename-folder="handleRenameCurrentFolder"
          @delete-folder="handleDeleteCurrentFolder"
        />
      </main>
    </div>

    <!-- Create Modal -->
    <CreateNodeModal
      :is-open="isCreateModalOpen"
      :parent-id="createParentId"
      :title="createModalTitle"
      @close="closeCreateModal"
      @submit="handleCreate"
    />

    <!-- Edit Modal -->
    <EditNodeModal
      :is-open="isEditModalOpen"
      :node="nodeToEdit"
      @close="closeEditModal"
      @submit="handleEdit"
    />

    <!-- Delete Confirmation -->
    <DeleteConfirmModal
      :is-open="isDeleteModalOpen"
      :node="nodeToDelete"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />

    <!-- Context Menu -->
    <ContextMenu
      :is-visible="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      @close="closeContextMenu"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

    <!-- Success/Error Toast -->
    <Transition name="toast">
      <div v-if="toast.visible" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useFileSystem } from '@/composables/useFileSystem';
import { useSearch } from '@/composables/useSearch';
import type { FileSystemNode, FileSystemNodeTree } from '@/types';
import { NodeType } from '@/types';

import FolderTree from '@/components/FolderTree.vue';
import FileList from '@/components/FileList.vue';
import SearchBar from '@/components/SearchBar.vue';
import SearchResults from '@/components/SearchResults.vue';
import CreateNodeModal from '@/components/CreateNodeModal.vue';
import EditNodeModal from '@/components/EditNodeModal.vue';
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue';
import ContextMenu from '@/components/ContextMenu.vue';

const {
  folderTree,
  selectedNode,
  children,
  loading,
  loadFolderTree,
  selectNode,
  toggleFolder,
  createNode,
  updateNode,
  deleteNode,
} = useFileSystem();

const { searchQuery, searchResults, isSearching } = useSearch();

// Modals state
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const nodeToEdit = ref<FileSystemNode | null>(null);
const nodeToDelete = ref<FileSystemNode | null>(null);
const createParentId = ref<string | null>(null);

// Context menu state
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  node: null as FileSystemNode | null,
});

// Toast notification
const toast = ref({
  visible: false,
  message: '',
  type: 'success' as 'success' | 'error',
});

// Computed title for create modal
const createModalTitle = computed(() => {
  if (createParentId.value) {
    const parent = findNodeById(createParentId.value);
    return parent ? `New in ${parent.name}` : 'New Item';
  }
  return 'New Item at Root';
});

onMounted(() => {
  loadFolderTree();
});

function findNodeById(id: string): FileSystemNode | null {
  const search = (nodes: FileSystemNodeTree[]): FileSystemNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = search(node.children);
        if (found) return found;
      }
    }
    return null;
  };
  return search(folderTree.value);
}

function handleSelectNode(node: FileSystemNodeTree) {
  selectNode(node);
}

// Create operations
function openCreateModal() {
  createParentId.value = selectedNode.value?.id || null;
  isCreateModalOpen.value = true;
}

function handleCreateInFolder(folder: FileSystemNodeTree) {
  createParentId.value = folder.id;
  isCreateModalOpen.value = true;
}

function closeCreateModal() {
  isCreateModalOpen.value = false;
  createParentId.value = null;
}

async function handleCreate(data: {
  name: string;
  type: NodeType;
  mimeType: string;
  size: number | null;
}) {
  try {
    await createNode({
      name: data.name,
      type: data.type,
      parentId: createParentId.value,
      mimeType: data.mimeType || null,
      size: data.size,
    });
    closeCreateModal();
    showToast('Created successfully!', 'success');
  } catch (error) {
    showToast('Failed to create', 'error');
  }
}

// Edit operations
function openEditModal() {
  if (contextMenu.value.node) {
    nodeToEdit.value = contextMenu.value.node;
    isEditModalOpen.value = true;
  }
}

function handleRenameCurrentFolder(folder: FileSystemNodeTree) {
  nodeToEdit.value = folder;
  isEditModalOpen.value = true;
}

function closeEditModal() {
  isEditModalOpen.value = false;
  nodeToEdit.value = null;
}

async function handleEdit(data: {
  name: string;
  mimeType: string | null;
  size: number | null;
}) {
  if (!nodeToEdit.value) return;

  try {
    await updateNode(nodeToEdit.value.id, data);
    closeEditModal();
    showToast('Updated successfully!', 'success');
  } catch (error) {
    showToast('Failed to update', 'error');
  }
}

// Delete operations
function openDeleteModal() {
  if (contextMenu.value.node) {
    nodeToDelete.value = contextMenu.value.node;
    isDeleteModalOpen.value = true;
  }
}

function handleDeleteCurrentFolder(folder: FileSystemNodeTree) {
  nodeToDelete.value = folder;
  isDeleteModalOpen.value = true;
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false;
  nodeToDelete.value = null;
}

async function handleDelete() {
  if (!nodeToDelete.value) return;

  try {
    await deleteNode(nodeToDelete.value.id);
    closeDeleteModal();
    showToast('Deleted successfully!', 'success');
  } catch (error) {
    showToast('Failed to delete', 'error');
  }
}

// Context menu
function handleContextMenu(event: { node: FileSystemNode; x: number; y: number }) {
  contextMenu.value = {
    visible: true,
    x: event.x,
    y: event.y,
    node: event.node,
  };
}

function closeContextMenu() {
  contextMenu.value.visible = false;
}

// Toast notifications
function showToast(message: string, type: 'success' | 'error') {
  toast.value = { visible: true, message, type };
  setTimeout(() => {
    toast.value.visible = false;
  }, 3000);
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: white;
}

.app-header {
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  padding: 16px 24px;
}

.app-header h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 50%;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  background: white;
}

.sidebar-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin: 0;
}

.btn-new {
  padding: 6px 12px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-new:hover {
  background: #1976d2;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.content {
  flex: 1;
  overflow-y: auto;
}

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 2000;
}

.toast.success {
  background: #4caf50;
}

.toast.error {
  background: #f44336;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.toast-leave-to {
  opacity: 0;
}
</style>