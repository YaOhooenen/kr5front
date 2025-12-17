<template>
  <!-- Тот же самый template, без изменений -->
  <div class="color-palette">
    <div class="palette-header">
      <h2>Генератор цветовых палитр</h2>
      <button @click="generateRandomPalette" class="generate-btn">
        🎨 Случайная палитра
      </button>
    </div>

    <div class="palette-settings">
      <div class="setting-group">
        <label>Количество цветов:</label>
        <select v-model="colorCount" @change="regeneratePalette">
          <option value="3">3 цвета</option>
          <option value="5">5 цветов</option>
          <option value="7">7 цветов</option>
        </select>
      </div>

      <div class="setting-group">
        <label>Формат отображения:</label>
        <div class="format-toggle">
          <button @click="colorFormat = 'hex'" :class="{ active: colorFormat === 'hex' }">
            HEX
          </button>
          <button @click="colorFormat = 'rgb'" :class="{ active: colorFormat === 'rgb' }">
            RGB
          </button>
        </div>
      </div>

      <div class="setting-group">
        <label>Тип палитры:</label>
        <select v-model="paletteType" @change="regeneratePalette">
          <option value="analogous">Аналогичная</option>
          <option value="monochromatic">Монохромная</option>
          <option value="triadic">Триада</option>
          <option value="complementary">Комплементарная</option>
        </select>
      </div>
    </div>

    <div class="palette-display">
      <div 
        v-for="(color, index) in colors" 
        :key="index" 
        class="color-card"
        :style="{ backgroundColor: color }"
        @click="copyToClipboard(color)"
        @contextmenu.prevent="toggleLock(index)"
        :class="{ locked: lockedIndices.includes(index) }"
      >
        <div class="color-info">
          <span class="color-value">
            {{ colorFormat === 'hex' ? color : formatAsRgb(color) }}
          </span>
          <span class="copy-hint">Кликни чтобы скопировать</span>
          <span v-if="lockedIndices.includes(index)" class="lock-icon">🔒</span>
        </div>
      </div>
    </div>

    <div v-if="showNotification" class="notification">
      Скопировано: {{ copiedColor }}
    </div>

    <div class="save-status">
      <button @click="toggleSavePalette" class="save-btn">
        {{ isSaved ? '💾 Сохранено' : '💾 Сохранить палитру' }}
      </button>
      <span v-if="isSaved" class="save-message">(сохранено в браузере)</span>
    </div>

    <div class="quick-actions">
      <button @click="lockAllColors" class="action-btn">🔒 Заблокировать все</button>
      <button @click="unlockAllColors" class="action-btn">🔓 Разблокировать все</button>
      <button @click="regenerateUnlocked" class="action-btn">🔄 Обновить незаблокированные</button>
    </div>
  </div>
</template>

<script setup>
/* Тот же самый JavaScript код */
import { ref, computed, onMounted } from 'vue'
import { colorUtils } from '../utils/colorUtils'

const colors = ref([])
const colorCount = ref(5)
const colorFormat = ref('hex')
const paletteType = ref('analogous')
const lockedIndices = ref([])
const showNotification = ref(false)
const copiedColor = ref('')
const isSaved = ref(false)

const generateRandomPalette = () => {
  const newColors = colorUtils.generateHarmoniousPalette(null, parseInt(colorCount.value), paletteType.value)
  
  colors.value = colors.value.map((color, index) => 
    lockedIndices.value.includes(index) ? color : newColors[index] || color
  )
  
  while (colors.value.length < newColors.length) {
    colors.value.push(newColors[colors.value.length])
  }
  
  colors.value = colors.value.slice(0, newColors.length)
  isSaved.value = false
}

const regeneratePalette = () => {
  generateRandomPalette()
}

const regenerateUnlocked = () => {
  const baseColor = colors.value.find((_, index) => !lockedIndices.value.includes(index)) || '#3498db'
  const newColors = colorUtils.generateHarmoniousPalette(baseColor, parseInt(colorCount.value), paletteType.value)
  
  colors.value = colors.value.map((color, index) => 
    lockedIndices.value.includes(index) ? color : newColors[index] || color
  )
}

const copyToClipboard = async (color) => {
  try {
    const textToCopy = colorFormat.value === 'hex' ? color : formatAsRgb(color)
    await navigator.clipboard.writeText(textToCopy)
    copiedColor.value = textToCopy
    showNotification.value = true
    
    setTimeout(() => {
      showNotification.value = false
    }, 2000)
  } catch (err) {
    console.error('Ошибка копирования:', err)
  }
}

const formatAsRgb = (hex) => {
  const rgb = colorUtils.hexToRgb(hex)
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

const toggleLock = (index) => {
  if (lockedIndices.value.includes(index)) {
    lockedIndices.value = lockedIndices.value.filter(i => i !== index)
  } else {
    lockedIndices.value.push(index)
  }
}

const lockAllColors = () => {
  lockedIndices.value = Array.from({ length: colors.value.length }, (_, i) => i)
}

const unlockAllColors = () => {
  lockedIndices.value = []
}

const toggleSavePalette = () => {
  if (isSaved.value) {
    localStorage.removeItem('savedPalette')
    isSaved.value = false
  } else {
    const paletteData = {
      colors: colors.value,
      lockedIndices: lockedIndices.value,
      colorCount: colorCount.value,
      paletteType: paletteType.value,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('savedPalette', JSON.stringify(paletteData))
    isSaved.value = true
  }
}

const loadSavedPalette = () => {
  const saved = localStorage.getItem('savedPalette')
  if (saved) {
    try {
      const paletteData = JSON.parse(saved)
      colors.value = paletteData.colors || []
      lockedIndices.value = paletteData.lockedIndices || []
      colorCount.value = paletteData.colorCount || 5
      paletteType.value = paletteData.paletteType || 'analogous'
      isSaved.value = true
    } catch (e) {
      console.error('Ошибка загрузки:', e)
    }
  }
}

onMounted(() => {
  loadSavedPalette()
  if (colors.value.length === 0) {
    generateRandomPalette()
  }
})
</script>

<style scoped>
/* УПРОЩЁННЫЙ CSS - как у студента */
.color-palette {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.palette-header {
  margin-bottom: 30px;
  text-align: center;
}

.palette-header h2 {
  color: #333;
  margin-bottom: 15px;
}

.generate-btn {
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.generate-btn:hover {
  background-color: #45a049;
}

.palette-settings {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.setting-group {
  margin-bottom: 15px;
}

.setting-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.setting-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.format-toggle {
  display: flex;
  gap: 10px;
}

.format-toggle button {
  flex: 1;
  padding: 8px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.format-toggle button.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.palette-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.color-card {
  height: 150px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
}

.color-card:hover {
  border-color: #333;
}

.color-card.locked {
  border: 3px solid #FF9800;
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.color-value {
  display: block;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  margin-bottom: 3px;
}

.copy-hint {
  font-size: 10px;
  color: #ccc;
}

.lock-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 3px;
  border-radius: 50%;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  background-color: #2196F3;
  color: white;
  border-radius: 5px;
  animation: fadeInOut 2s ease;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  10%, 90% { opacity: 1; }
}

.save-status {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #e8f4fd;
  border-radius: 6px;
}

.save-btn {
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-message {
  color: #666;
  font-size: 14px;
}

.quick-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.action-btn:hover {
  background-color: #e0e0e0;
}

@media (max-width: 600px) {
  .palette-display {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  
  .quick-actions {
    flex-direction: column;
  }
}
</style>