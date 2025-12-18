<!-- src/components/PaletteLibrary.vue -->
<template>
  <div class="palette-library">
    <div class="library-header">
      <h3>📚 Библиотека палитр</h3>
      <div class="library-stats">
        <span>Всего: {{ palettes.length }}</span>
        <button 
          @click="clearAll" 
          class="clear-btn"
          :disabled="palettes.length === 0"
        >
          Очистить всё
        </button>
      </div>
    </div>
    
    <div v-if="palettes.length === 0" class="empty-library">
      <p>Библиотека пуста</p>
      <p>Сохраните первую палитру!</p>
    </div>
    
    <div v-else class="library-content">
      <!-- Поиск -->
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Поиск по названию..."
          class="search-input"
        />
        <span class="search-count">
          Найдено: {{ filteredPalettes.length }}
        </span>
      </div>
      
      <!-- Список палитр -->
      <div class="palettes-grid">
        <div 
          v-for="palette in filteredPalettes" 
          :key="palette.id" 
          class="palette-item"
        >
          <div class="palette-preview">
            <div 
              v-for="(color, idx) in palette.colors" 
              :key="idx" 
              class="color-swatch"
              :style="{ backgroundColor: color }"
              :title="color"
            ></div>
          </div>
          
          <div class="palette-info">
            <div class="palette-name">
              {{ palette.name }}
            </div>
            <div class="palette-date">
              {{ formatDate(palette.createdAt) }}
            </div>
            
            <div class="palette-actions">
              <button 
                @click="loadPalette(palette.colors)" 
                class="action-btn load-btn"
                title="Загрузить палитру"
              >
                📂
              </button>
              <button 
                @click="editPalette(palette)" 
                class="action-btn edit-btn"
                title="Редактировать"
              >
                ✏️
              </button>
              <button 
                @click="deletePalette(palette.id)" 
                class="action-btn delete-btn"
                title="Удалить"
              >
                🗑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно редактирования -->
    <div v-if="editingPalette" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h4>Редактировать палитру</h4>
        <input 
          v-model="editingPalette.name" 
          class="modal-input"
          @keyup.enter="saveEdit"
        />
        <div class="modal-actions">
          <button @click="saveEdit" class="modal-btn save">Сохранить</button>
          <button @click="closeModal" class="modal-btn cancel">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storage } from '../utils/storage'

const emit = defineEmits(['load'])

const palettes = ref([])
const searchQuery = ref('')
const editingPalette = ref(null)

// Загружаем палитры из localStorage
const loadPalettes = () => {
  palettes.value = storage.getPalettes()
}

// Фильтрация палитр
const filteredPalettes = computed(() => {
  if (!searchQuery.value.trim()) {
    return palettes.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return palettes.value.filter(palette => 
    palette.name.toLowerCase().includes(query)
  )
})

// Форматирование даты
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Загрузить палитру
const loadPalette = (colors) => {
  storage.saveCurrentPalette(colors)
  emit('load', colors)
}

// Редактировать палитру
const editPalette = (palette) => {
  editingPalette.value = { ...palette }
}

// Сохранить изменения
const saveEdit = () => {
  if (editingPalette.value && editingPalette.value.name.trim()) {
    storage.updatePalette(editingPalette.value.id, {
      name: editingPalette.value.name.trim()
    })
    loadPalettes()
    closeModal()
  }
}

// Удалить палитру
const deletePalette = (id) => {
  if (confirm('Удалить эту палитру?')) {
    storage.deletePalette(id)
    loadPalettes()
  }
}

// Очистить всю библиотеку
const clearAll = () => {
  if (confirm('Очистить всю библиотеку? Это действие нельзя отменить.')) {
    storage.clearLibrary()
    loadPalettes()
  }
}

// Закрыть модальное окно
const closeModal = () => {
  editingPalette.value = null
}

// Инициализация
onMounted(() => {
  loadPalettes()
})
</script>

<style scoped>
.palette-library {
  margin: 20px 0;
  padding: 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.library-header h3 {
  margin: 0;
  color: #333;
}

.library-stats {
  display: flex;
  align-items: center;
  gap: 15px;
}

.clear-btn {
  padding: 6px 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.clear-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.empty-library {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.search-box {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.search-count {
  font-size: 14px;
  color: #666;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.palette-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  background: #fafafa;
}

.palette-preview {
  display: flex;
  height: 40px;
}

.color-swatch {
  flex: 1;
}

.palette-info {
  padding: 12px;
}

.palette-name {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.palette-date {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.palette-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background: #f0f0f0;
}

.action-btn:hover {
  background: #e0e0e0;
}

.load-btn:hover { background: #d4edda; }
.edit-btn:hover { background: #fff3cd; }
.delete-btn:hover { background: #f8d7da; }

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 8px;
  min-width: 300px;
}

.modal h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.modal-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 15px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.modal-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.modal-btn.save {
  background: #4CAF50;
  color: white;
}

.modal-btn.cancel {
  background: #f0f0f0;
  border: 1px solid #ccc;
}

@media (max-width: 600px) {
  .palettes-grid {
    grid-template-columns: 1fr;
  }
  
  .library-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>