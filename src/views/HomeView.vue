<template>
  <div class="home-view">
    <!-- Основной генератор -->
    <ColorPalette ref="paletteGenerator" />
    
    <!-- Дополнительные инструменты -->
    <div class="advanced-tools">
      <h3>Дополнительные возможности</h3>
      
      <div class="tools-section">
        <h4>Превью палитры:</h4>
        <PalettePreview :colors="currentColors" />
      </div>
      
      <div class="tools-section">
        <h4>Проверка доступности:</h4>
        <AccessibilityChecker :colors="currentColors" />
      </div>
      
      <div class="tools-section">
        <h4>Быстрые действия:</h4>
        <div class="quick-buttons">
          <button @click="generateMoodPalette('calm')" class="mood-btn">😌 Спокойные цвета</button>
          <button @click="generateMoodPalette('energetic')" class="mood-btn">⚡ Яркие цвета</button>
          <button @click="generateMoodPalette('professional')" class="mood-btn">💼 Деловые цвета</button>
        </div>
      </div>
      
      <div class="tools-section">
        <h4>Экспорт:</h4>
        <div class="export-buttons">
          <button @click="exportAsCSS" class="export-btn">CSS</button>
          <button @click="exportAsSCSS" class="export-btn">SCSS</button>
          <button @click="exportAsTailwind" class="export-btn">Tailwind</button>
        </div>
        <textarea 
          v-if="exportCode" 
          v-model="exportCode" 
          class="export-output" 
          rows="4"
          readonly
          placeholder="Здесь появится код для экспорта..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ColorPalette from '../components/ColorPalette.vue'
import PalettePreview from '../components/PalettePreview.vue'
import AccessibilityChecker from '../components/AccessibilityChecker.vue'
import { colorUtils } from '../utils/colorUtils'

const paletteGenerator = ref(null)
const currentColors = ref([])
const exportCode = ref('')

const updateCurrentColors = () => {
  if (paletteGenerator.value) {
    currentColors.value = paletteGenerator.value.colors || []
  }
}

const generateMoodPalette = (mood) => {
  const newColors = colorUtils.generateMoodPalette(mood, 5)
  if (paletteGenerator.value) {
    paletteGenerator.value.colors = newColors
    updateCurrentColors()
  }
}

const exportAsCSS = () => {
  const cssVars = currentColors.value.map((color, index) => 
    `  --color-${index + 1}: ${color};`
  ).join('\n')
  exportCode.value = `:root {\n${cssVars}\n}`
}

const exportAsSCSS = () => {
  exportCode.value = currentColors.value.map((color, index) => 
    `$color-${index + 1}: ${color};`
  ).join('\n')
}

const exportAsTailwind = () => {
  const tailwindColors = currentColors.value.map((color, index) => 
    `    '${index + 1}': '${color}'`
  ).join(',\n')
  exportCode.value = `module.exports = {
  theme: {
    extend: {
      colors: {
${tailwindColors}
      }
    }
  }
}`
}

onMounted(() => {
  setInterval(updateCurrentColors, 1000)
})
</script>

<style scoped>
.home-view {
  max-width: 1000px;
  margin: 0 auto;
}

.advanced-tools {
  margin-top: 30px;
  padding: 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.advanced-tools h3 {
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 10px;
}

.tools-section {
  margin-bottom: 25px;
}

.tools-section h4 {
  color: #555;
  margin-bottom: 10px;
}

.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.mood-btn {
  padding: 10px 15px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.mood-btn:hover {
  background-color: #e0e0e0;
}

.export-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.export-btn {
  padding: 8px 16px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.export-btn:hover {
  background-color: #0b7dda;
}

.export-output {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  resize: vertical;
}

@media (max-width: 600px) {
  .quick-buttons,
  .export-buttons {
    flex-direction: column;
  }
  
  .mood-btn,
  .export-btn {
    width: 100%;
  }
}
</style>