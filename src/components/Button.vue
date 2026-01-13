<template>
    <button
        :class="['btn', `btn-${variant}`, { 'btn-small': size === 'small', 'btn-icon': icon }]"
        :disabled="disabled || loading"
        :type="type"
        @click="$emit('click', $event)"
    >
        <span v-if="loading" class="btn-spinner">⏳</span>
        <span v-else-if="icon">{{ icon }}</span>
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'info';
  size?: 'normal' | 'small';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'normal',
  disabled: false,
  loading: false,
  type: 'button',
  icon: ''
});

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<style scoped>

</style>