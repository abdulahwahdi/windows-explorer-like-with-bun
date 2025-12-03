<template>
    <div class="folder-tree">
        <FolderTreeNode
            v-for="node in nodes"
            :key="node.id"
            :node="node"
            :selected-id="selectedId"
            :level="0"
            @select="$emit('select', $event)"
            @toggle="$emit('toggle', $event)"
        />
    </div>
</template>

<script setup lang="ts">
    import type { FileSystemNodeTree } from '@/types';
    import FolderTreeNode from './FolderTreeNode.vue';

    defineProps<{
        nodes: FileSystemNodeTree[];
        selectedId: string | null;
    }>();

    defineEmits<{
        select: [node: FileSystemNodeTree];
        toggle: [nodeId: string];
    }>();
</script>

<style scoped>
    .folder-tree {
        user-select: none;
    }
</style>