<template>
  <div class="loading-container">
    <div :class="['spinner', { 'spinner-small': size === 'small' }]"></div>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
    interface Props {
    message?: string;
    size?: 'normal' | 'small';
    }

    withDefaults(defineProps<Props>(), {
    message: 'Carregando...',
    size: 'normal'
    });
</script>