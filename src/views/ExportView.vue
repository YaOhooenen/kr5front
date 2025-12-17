<template>
  <div class="export-view">
    <h2>📤 Экспорт палитр</h2>
    
    <div class="export-intro">
      <p>Скопируйте код для использования в ваших проектах:</p>
    </div>
    
    <div class="export-options">
      <div class="export-option">
        <h3>CSS</h3>
        <button @click="exportCSS" class="copy-btn">Копировать CSS</button>
        <pre v-if="exportedCSS">{{ exportedCSS }}</pre>
      </div>
      
      <div class="export-option">
        <h3>SCSS</h3>
        <button @click="exportSCSS" class="copy-btn">Копировать SCSS</button>
        <pre v-if="exportedSCSS">{{ exportedSCSS }}</pre>
      </div>
      
      <div class="export-option">
        <h3>Tailwind</h3>
        <button @click="exportTailwind" class="copy-btn">Копировать Tailwind</button>
        <pre v-if="exportedTailwind">{{ exportedTailwind }}</pre>
      </div>
    </div>
    
    <div class="current-palette">
      <h3>Текущая палитра:</h3>
      <div class="current-colors">
        <div 
          v-for="(color, index) in currentPalette" 
          :key="index" 
          class="current-color"
          :style="{ backgroundColor: color }"
        >
          {{ color }}
        </div>
      </div>
    </div>
    
    <div v-if="showNotification" class="notification">
      Код скопирован!
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const exportedCSS = ref('')
const exportedSCSS = ref('')
const exportedTailwind = ref('')
const currentPalette = ref([])
const showNotification = ref(false)

const loadCurrentPalette = () => {
  const saved = localStorage.getItem('currentPalette')
  const libSaved = localStorage.getItem('paletteLibrary')
  
  if (saved) {
    currentPalette.value = JSON.parse(saved)
  } else if (libSaved) {
    const palettes = JSON.parse(libSaved)
    if (palettes.length > 0) {
      currentPalette.value = palettes[palettes.length - 1].colors || []
    }
  }
  
  if (currentPalette.value.length === 0) {
    currentPalette.value = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6']
  }
}

const exportCSS = () => {
  const vars = currentPalette.value.map((color, index) => 
    `  --color-${index + 1}: ${color};`
  ).join('\n')
  exportedCSS.value = `:root {\n${vars}\n}`
  copyToClipboard(exportedCSS.value)
}

const exportSCSS = () => {
  exportedSCSS.value = currentPalette.value.map((color, index) => 
    `$color-${index + 1}: ${color};`
  ).join('\n')
  copyToClipboard(exportedSCSS.value)
}

const exportTailwind = () => {
  const colors = currentPalette.value.map((color, index) => 
    `    '${index + 1}': '${color}'`
  ).join(',\n')
  exportedTailwind.value = `module.exports = {
  theme: {
    extend: {
      colors: {
${colors}
      }
    }
  }
}`
  copyToClipboard(exportedTailwind.value)
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 2000)
  } catch (err) {
    alert('Ошибка копирования. Скопируйте вручную.')
  }
}

onMounted(() => {
  loadCurrentPalette()
})
</script>

<style scoped>
.export-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.export-view h2 {
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.export-intro {
  margin-bottom: 25px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 6px;
  text-align: center;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.export-option {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 20px;
}

.export-option h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.copy-btn {
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;
  width: 100%;
}

.copy-btn:hover {
  background-color: #0b7dda;
}

pre {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  overflow-x: auto;
  margin: 0;
  border: 1px solid #e0e0e0;
}

.current-palette {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 20px;
}

.current-palette h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.current-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.current-color {
  padding: 10px;
  border-radius: 4px;
  color: white;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  min-width: 120px;
  text-align: center;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  animation: fadeInOut 2s;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  10%, 90% { opacity: 1; }
}

@media (max-width: 600px) {
  .current-colors {
    flex-direction: column;
  }
  
  .current-color {
    width: 100%;
  }
}
</style>