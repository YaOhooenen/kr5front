<template>
  <div class="checker">
    <h3>Проверка контрастности</h3>
    
    <div class="table">
      <div class="table-row header">
        <div class="cell">Цвет</div>
        <div v-for="(color, index) in colors" :key="index" class="cell">
          {{ index + 1 }}
        </div>
      </div>
      
      <div v-for="(color1, i) in colors" :key="i" class="table-row">
        <div class="cell left" :style="{ backgroundColor: color1 }">
          <span class="hex">{{ color1 }}</span>
        </div>
        
        <div 
          v-for="(color2, j) in colors" 
          :key="j" 
          class="cell"
          :style="{ backgroundColor: color1, color: color2 }"
        >
          <div v-if="i !== j" class="value">
            {{ contrastMatrix[i][j].toFixed(1) }}
            <div :class="['level', getContrastClass(contrastMatrix[i][j])]">
              {{ getContrastLevel(contrastMatrix[i][j]) }}
            </div>
          </div>
          <div v-else class="value">-</div>
        </div>
      </div>
    </div>
    
    <div class="legend">
      <h4>Уровни контрастности:</h4>
      <div class="legend-row">
        <div class="legend-item">
          <div class="dot aaa"></div>
          <span>AAA (≥ 7)</span>
        </div>
        <div class="legend-item">
          <div class="dot aa"></div>
          <span>AA (≥ 4.5)</span>
        </div>
        <div class="legend-item">
          <div class="dot aal"></div>
          <span>AA Large (≥ 3)</span>
        </div>
        <div class="legend-item">
          <div class="dot fail"></div>
          <span>Недостаточно</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { colorUtils } from '../utils/colorUtils'

const props = defineProps({
  colors: {
    type: Array,
    default: () => []
  }
})

const contrastMatrix = computed(() => {
  const matrix = []
  for (let i = 0; i < props.colors.length; i++) {
    matrix[i] = []
    for (let j = 0; j < props.colors.length; j++) {
      if (i === j) {
        matrix[i][j] = 1
      } else {
        matrix[i][j] = colorUtils.calculateContrast(props.colors[i], props.colors[j])
      }
    }
  }
  return matrix
})

const getContrastClass = (contrast) => {
  if (contrast >= 7) return 'aaa'
  if (contrast >= 4.5) return 'aa'
  if (contrast >= 3) return 'aal'
  return 'fail'
}

const getContrastLevel = (contrast) => {
  if (contrast >= 7) return 'AAA'
  if (contrast >= 4.5) return 'AA'
  if (contrast >= 3) return 'AA Large'
  return 'Недостаточно'
}
</script>

<style scoped>
.checker {
  margin: 20px 0;
  padding: 15px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.checker h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.table {
  border: 1px solid #ccc;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 15px;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #ccc;
}

.table-row:last-child {
  border-bottom: none;
}

.header {
  background: #f0f0f0;
  font-weight: bold;
}

.cell {
  flex: 1;
  padding: 8px;
  text-align: center;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #ccc;
}

.cell:last-child {
  border-right: none;
}

.cell.left {
  flex: 0 0 80px;
  font-size: 12px;
  color: white;
  text-shadow: 0 0 2px black;
}

.hex {
  font-family: monospace;
  font-weight: bold;
}

.value {
  background: rgba(255,255,255,0.8);
  padding: 4px;
  border-radius: 3px;
  font-size: 12px;
  min-width: 50px;
}

.level {
  font-size: 10px;
  font-weight: bold;
  margin-top: 2px;
  padding: 2px 4px;
  border-radius: 2px;
}

.aaa { background: #27ae60; color: white; }
.aa { background: #3498db; color: white; }
.aal { background: #f39c12; color: white; }
.fail { background: #e74c3c; color: white; }

.legend {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
}

.legend h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
}

.legend-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.aaa { background: #27ae60; }
.dot.aa { background: #3498db; }
.dot.aal { background: #f39c12; }
.dot.fail { background: #e74c3c; }

@media (max-width: 600px) {
  .cell {
    padding: 4px;
    font-size: 11px;
  }
  
  .cell.left {
    flex: 0 0 60px;
  }
  
  .legend-row {
    flex-direction: column;
    gap: 5px;
  }
}
</style>