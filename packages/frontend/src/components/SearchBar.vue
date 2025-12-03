<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <SearchIcon class="search-icon" />
      <input
        type="text"
        :value="modelValue"
        @input="handleInput"
        placeholder="Search files and folders..."
        class="search-input"
      />
      <button
        v-if="modelValue"
        @click="handleClear"
        class="clear-button"
      >
        ×
      </button>
    </div>
    <div v-if="modelValue" class="search-info">
      <span v-if="isSearching">Searching...</span>
      <span v-else>Found {{ resultsCount }} result(s)</span>
    </div>
  </div>
</template>

<script setup lang="ts">
    import SearchIcon from './icons/SearchIcon.vue';

    defineProps<{
        modelValue: string;
        isSearching: boolean;
        resultsCount: number;
    }>();

    const emit = defineEmits<{
        'update:modelValue': [value: string];
    }>();

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        emit('update:modelValue', target.value);
    }

    function handleClear() {
        emit('update:modelValue', '');
    }
</script>

<style scoped>
    .search-bar {
        max-width: 600px;
    }

    .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .search-icon {
        position: absolute;
        left: 12px;
        color: #999;
        pointer-events: none;
    }

    .search-input {
        width: 100%;
        padding: 10px 40px 10px 40px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s;
    }

    .search-input:focus {
        outline: none;
        border-color: #2196f3;
        box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }

    .clear-button {
        position: absolute;
        right: 8px;
        width: 24px;
        height: 24px;
        border: none;
        background: #e0e0e0;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }

    .clear-button:hover {
        background: #bdbdbd;
    }

    .search-info {
        margin-top: 8px;
        font-size: 12px;
        color: #666;
    }
</style>