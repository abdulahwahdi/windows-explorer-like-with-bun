import { ref, computed } from 'vue';
import { apiService } from '@/services/api';
import type { FileSystemNode, FileSystemNodeTree } from '@/types';
import { NodeType } from '@/types';

export function useFileSystem() {
  const folderTree = ref<FileSystemNodeTree[]>([]);
  const selectedNode = ref<FileSystemNodeTree | null>(null);
  const children = ref<FileSystemNode[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const sortedChildren = computed(() => {
    return [...children.value].sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'FOLDER' ? -1 : 1;
    });
  });

  async function loadFolderTree() {
    loading.value = true;
    error.value = null;
    try {
      folderTree.value = await apiService.getFolderTree();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load folder tree';
      console.error('Error loading folder tree:', e);
    } finally {
      loading.value = false;
    }
  }

  async function selectNode(node: FileSystemNodeTree) {
    selectedNode.value = node;
    loading.value = true;
    error.value = null;
    try {
      const result = await apiService.getChildren(node.id);
      children.value = result.nodes;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load children';
      console.error('Error loading children:', e);
      children.value = [];
    } finally {
      loading.value = false;
    }
  }

  function toggleFolder(nodeId: string) {
    const toggleInTree = (nodes: FileSystemNodeTree[]): boolean => {
      for (const node of nodes) {
        if (node.id === nodeId) {
          node.isOpen = !node.isOpen;
          return true;
        }
        if (node.children && toggleInTree(node.children)) {
          return true;
        }
      }
      return false;
    };

    toggleInTree(folderTree.value);
  }

  async function createNode(data: {
    name: string;
    type: NodeType;
    parentId: string | null;
    mimeType?: string | null;
    size?: number | null;
  }) {
    loading.value = true;
    error.value = null;
    try {
      await apiService.createNode(data);
      // Reload tree and children
      await loadFolderTree();
      if (selectedNode.value) {
        await selectNode(selectedNode.value);
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create node';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateNode(id: string, data: {
    name?: string;
    mimeType?: string | null;
    size?: number | null;
  }) {
    loading.value = true;
    error.value = null;
    try {
      await apiService.updateNode(id, data);
      // Reload tree and children
      await loadFolderTree();
      if (selectedNode.value) {
        await selectNode(selectedNode.value);
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update node';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function deleteNode(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await apiService.deleteNode(id);
      // Reload tree and children
      await loadFolderTree();
      if (selectedNode.value) {
        await selectNode(selectedNode.value);
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete node';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    folderTree,
    selectedNode,
    children: sortedChildren,
    loading,
    error,
    loadFolderTree,
    selectNode,
    toggleFolder,
    createNode,
    updateNode,
    deleteNode,
  };
}
