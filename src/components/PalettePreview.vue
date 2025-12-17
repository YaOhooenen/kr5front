<template>
  <div class="palette-preview">
    <h3>Как палитра выглядит в интерфейсе:</h3>
    
    <div class="preview-controls">
      <label>
        Фон страницы:
        <select v-model="backgroundColor">
          <option value="#ffffff">Светлый</option>
          <option value="#1a1a1a">Тёмный</option>
        </select>
      </label>
    </div>
    
    <div class="preview-container" :style="{ backgroundColor }">
      <!-- Простой макет -->
      <div class="mockup-header" :style="{ backgroundColor: colors[0] || '#3498db' }">
        <h4>Заголовок сайта</h4>
      </div>
      
      <div class="mockup-content">
        <div class="mockup-card" :style="{ backgroundColor: colors[1] || '#2ecc71' }">
          <h5>Карточка товара</h5>
          <p>Описание товара или услуги</p>
        </div>
        
        <button class="mockup-btn" :style="{ backgroundColor: colors[2] || '#e74c3c' }">
          Купить сейчас
        </button>
        
        <div class="mockup-sidebar" :style="{ backgroundColor: colors[3] || '#9b59b6' }">
          <p>Меню навигации</p>
          <ul>
            <li>Главная</li>
            <li>О нас</li>
            <li>Контакты</li>
          </ul>
        </div>
      </div>
      
      <div class="mockup-footer" :style="{ backgroundColor: colors[4] || '#f39c12' }">
        <p>© 2024 Наш сайт</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
  colors: {
    type: Array,
    default: () => []
  }
})

const backgroundColor = ref('#ffffff')
</script>

<style scoped>
/* ПРОСТОЙ CSS */
.palette-preview {
  margin: 30px 0;
  padding: 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.palette-preview h3 {
  color: #333;
  margin-bottom: 15px;
}

.preview-controls {
  margin-bottom: 20px;
}

.preview-controls label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-controls select {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.preview-container {
  border: 2px solid #333;
  border-radius: 8px;
  overflow: hidden;
  min-height: 300px;
  position: relative;
}

.mockup-header {
  padding: 15px;
  color: white;
  text-align: center;
}

.mockup-header h4 {
  margin: 0;
}

.mockup-content {
  padding: 20px;
}

.mockup-card {
  padding: 15px;
  border-radius: 6px;
  color: white;
  margin-bottom: 15px;
  max-width: 250px;
}

.mockup-card h5 {
  margin: 0 0 10px 0;
}

.mockup-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  margin-bottom: 15px;
}

.mockup-sidebar {
  padding: 15px;
  border-radius: 6px;
  color: white;
  max-width: 200px;
  margin-bottom: 15px;
}

.mockup-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
}

.mockup-sidebar li {
  padding: 5px 0;
  border-bottom: 1px solid rgba(255,255,255,0.3);
}

.mockup-footer {
  padding: 10px;
  color: white;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>