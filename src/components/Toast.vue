<template>
    <div :class="['message', `${type}-message`]" v-if="show">
        <slot>{{ message }}</slot>
    </div>
</template>

<script setup lang="ts">
    interface Props {
    message?: string;
    type?: 'error' | 'success' | 'warning' | 'info';
    show?: boolean;
    }

    withDefaults(defineProps<Props>(), {
    message: '',
    type: 'info',
    show: true
    });
</script>