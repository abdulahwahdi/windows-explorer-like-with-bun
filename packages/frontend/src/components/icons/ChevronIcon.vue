<template>
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="chevron-icon"
    :class="{ open: isOpen }"
  >
    <path
      d="M6 4L10 8L6 12"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
    defineProps<{
        isOpen?: boolean;
    }>();
</script>

<style scoped>
    .chevron-icon {
        transition: transform 0.2s;
        color: #666;
    }

    .chevron-icon.open {
        transform: rotate(90deg);
    }
</style>