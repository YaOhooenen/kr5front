<template>
  <div id="app">
    <header class="app-header">
      <h1>🎨 Генератор цветовых палитр</h1>
      <p>Практическая работа по Vue.js</p>
    </header>

    <nav class="main-nav">
      <router-link to="/" class="nav-link">Главная</router-link>
      <router-link to="/library" class="nav-link">Библиотека</router-link>
      <router-link to="/export" class="nav-link">Экспорт</router-link>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="app-footer">
      <p>Студенческая работа • Vue 3 • 2024</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* ОЧЕНЬ ПРОСТОЙ CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  background-color: #f5f5f5;
  line-height: 1.5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #4CAF50;
  color: white;
  padding: 20px;
  text-align: center;
}

.app-header h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.app-header p {
  font-size: 16px;
  opacity: 0.9;
}

.main-nav {
  background-color: white;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  gap: 20px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.nav-link:hover {
  background-color: #f0f0f0;
}

.nav-link.router-link-active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 15px;
  margin-top: 20px;
}

/* Для мобильных */
@media (max-width: 600px) {
  .app-header h1 {
    font-size: 20px;
  }
  
  .main-nav {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .nav-link {
    width: 200px;
    text-align: center;
  }
}
</style>