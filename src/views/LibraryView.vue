<template>
  <div class="library-view">
    <h2>📚 Моя библиотека палитр</h2>
    
    <div class="library-controls">
      <input 
        v-model="searchQuery" 
        placeholder="Поиск по названию..." 
        class="search-input"
      />
      <button @click="clearLibrary" class="clear-btn">Очистить всё</button>
    </div>
    
    <div v-if="filteredPalettes.length === 0" class="empty-library">
      <p>Библиотека пуста</p>
      <p>Сохраните первую палитру на главной странице!</p>
    </div>
    
    <div v-else class="palettes-list">
      <div 
        v-for="palette in filteredPalettes" 
        :key="palette.id" 
        class="palette-item"
        @click="loadPalette(palette)"
      >
        <div class="palette-colors">
          <div 
            v-for="(color, index) in palette.colors" 
            :key="index" 
            class="palette-color"
            :style="{ backgroundColor: color }"
          ></div>
        </div>
        <div class="palette-info">
          <h4>{{ palette.name }}</h4>
          <p class="palette-date">{{ formatDate(palette.timestamp) }}</p>
          <div class="palette-actions">
            <button @click.stop="editPalette(palette)" class="edit-btn">✏️</button>
            <button @click.stop="deletePalette(palette.id)" class="delete-btn">🗑</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Простое модальное окно -->
    <div v-if="editingPalette" class="edit-modal">
      <div class="modal-content">
        <h3>Редактировать название</h3>
        <input 
          v-model="editingPalette.name" 
          class="name-input"
          placeholder="Название палитры"
        />
        <div class="modal-buttons">
          <button @click="saveEdit" class="save-btn">Сохранить</button>
          <button @click="closeModal" class="cancel-btn">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const palettes = ref([])
const searchQuery = ref('')
const editingPalette = ref(null)

const filteredPalettes = computed(() => {
  if (!searchQuery.value) return palettes.value
  return palettes.value.filter(palette =>
    palette.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const loadPalettes = () => {
  const saved = localStorage.getItem('paletteLibrary')
  palettes.value = saved ? JSON.parse(saved) : []
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const loadPalette = (palette) => {
  localStorage.setItem('currentPalette', JSON.stringify(palette.colors))
  router.push('/')
}

const editPalette = (palette) => {
  editingPalette.value = { ...palette }
}

const saveEdit = () => {
  const index = palettes.value.findIndex(p => p.id === editingPalette.value.id)
  if (index !== -1) {
    palettes.value[index] = editingPalette.value
    localStorage.setItem('paletteLibrary', JSON.stringify(palettes.value))
  }
  editingPalette.value = null
}

const deletePalette = (id) => {
  if (confirm('Удалить эту палитру?')) {
    palettes.value = palettes.value.filter(p => p.id !== id)
    localStorage.setItem('paletteLibrary', JSON.stringify(palettes.value))
  }
}

const clearLibrary = () => {
  if (confirm('Очистить всю библиотеку?')) {
    palettes.value = []
    localStorage.removeItem('paletteLibrary')
  }
}

const closeModal = () => {
  editingPalette.value = null
}

onMounted(() => {
  loadPalettes()
})
</script>

<style scoped>
.library-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.library-view h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.library-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.clear-btn {
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.empty-library {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.palettes-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.palette-item {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
}

.palette-item:hover {
  border-color: #4CAF50;
}

.palette-colors {
  display: flex;
  height: 60px;
}

.palette-color {
  flex: 1;
}

.palette-info {
  padding: 15px;
}

.palette-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.palette-date {
  font-size: 12px;
  color: #666;
  margin: 0 0 10px 0;
}

.palette-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn {
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #e0e0e0;
}

.delete-btn:hover {
  background-color: #ffebee;
}

.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.modal-content h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.name-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 15px;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.save-btn {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}
</style>