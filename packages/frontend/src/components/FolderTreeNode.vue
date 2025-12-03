<template>
    <div>
        <div
        class="tree-node"
        :class="{ selected: selectedId === node.id }"
        :style="{ paddingLeft: `${level * 20 + 8}px` }"
        @click="$emit('select', node)"
        >
        <button
            v-if="node.children && node.children.length > 0"
            class="toggle-btn"
            @click.stop="$emit('toggle', node.id)"
        >
            <ChevronIcon :is-open="node.isOpen" />
        </button>
        <span v-else class="spacer" />
        
        <FolderIcon :is-open="node.isOpen && hasChildren" />
        <span class="node-name">{{ node.name }}</span>
        </div>

        <template v-if="node.isOpen && node.children">
        <FolderTreeNode
            v-for="child in node.children"
            :key="child.id"
            :node="child"
            :selected-id="selectedId"
            :level="level + 1"
            @select="$emit('select', $event)"
            @toggle="$emit('toggle', $event)"
        />
        </template>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { FileSystemNodeTree } from '@/types';
    import ChevronIcon from './icons/ChevronIcon.vue';
    import FolderIcon from './icons/FolderIcon.vue';

    const props = defineProps<{
        node: FileSystemNodeTree;
        selectedId: string | null;
        level: number;
    }>();

    defineEmits<{
        select: [node: FileSystemNodeTree];
        toggle: [nodeId: string];
    }>();

    const hasChildren = computed(() => {
        return props.node.children && props.node.children.length > 0;
    });
</script>

<style scoped>
    .tree-node {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        cursor: pointer;
        transition: background-color 0.15s;
    }

    .tree-node:hover {
        background-color: #e3f2fd;
    }

    .tree-node.selected {
        background-color: #bbdefb;
    }

    .toggle-btn {
        padding: 2px;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .toggle-btn:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .spacer {
        width: 20px;
    }

    .node-name {
        font-size: 14px;
        margin-left: 4px;
    }
</style>