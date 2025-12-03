import { ref, watch } from 'vue';
import { apiService } from '@/services/api';
import type { FileSystemNode } from '@/types';

export function useSearch() {
  const searchQuery = ref('');
  const searchResults = ref<FileSystemNode[]>([]);
  const isSearching = ref(false);
  const error = ref<string | null>(null);

  let searchTimeout: ReturnType<typeof setTimeout> | null = null;

  watch(searchQuery, (newQuery) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (!newQuery.trim()) {
      searchResults.value = [];
      return;
    }

    searchTimeout = setTimeout(async () => {
      isSearching.value = true;
      error.value = null;
      try {
        searchResults.value = await apiService.searchNodes(newQuery);
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Search failed';
        console.error('Search error:', e);
        searchResults.value = [];
      } finally {
        isSearching.value = false;
      }
    }, 300);
  });

  function clearSearch() {
    searchQuery.value = '';
    searchResults.value = [];
    error.value = null;
  }

  return {
    searchQuery,
    searchResults,
    isSearching,
    error,
    clearSearch,
  };
}