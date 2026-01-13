<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1 class="logo">Backoffice</h1>
        <nav class="nav">
          <router-link to="/" class="nav-link">Empresas</router-link>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>© 2025 Sistema de Gerenciamento de Empresas</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>

<style>

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>