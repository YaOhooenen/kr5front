<template>
  <div class="save-palette">
    <h4>💾 Сохранить палитру</h4>
    
    <div v-if="!isSaving" class="save-controls">
      <button @click="startSaving" class="save-btn">
        Сохранить в библиотеку
      </button>
      <span class="count">(сохранено: {{ savedCount }})</span>
    </div>
    
    <div v-else class="save-form">
      <label>
        Название палитры:
        <input 
          v-model="paletteName" 
          type="text" 
          placeholder="Моя палитра"
          class="name-input"
          ref="nameInput"
        />
      </label>
      
      <div class="form-actions">
        <button @click="savePalette" class="confirm-btn">✅ Сохранить</button>
        <button @click="cancel" class="cancel-btn">❌ Отмена</button>
      </div>
    </div>
    
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, defineEmits } from 'vue'
import { storage } from '../utils/storage'

const props = defineProps({
  colors: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['saved']) // Добавляем emit

const isSaving = ref(false)
const paletteName = ref('')
const savedCount = ref(0)
const message = ref('')
const messageType = ref('')
const nameInput = ref(null)

// Загружаем количество сохраненных палитр
const loadSavedCount = () => {
  const palettes = storage.getPalettes()
  savedCount.value = palettes.length
}

const startSaving = () => {
  if (!props.colors || props.colors.length === 0) {
    showMessage('Сначала создайте палитру!', 'error')
    return
  }
  
  isSaving.value = true
  paletteName.value = `Палитра от ${new Date().toLocaleDateString('ru-RU')}`
  
  // Фокус на поле ввода
  nextTick(() => {
    if (nameInput.value) {
      nameInput.value.focus()
      nameInput.value.select()
    }
  })
}

const savePalette = () => {
  if (!paletteName.value.trim()) {
    showMessage('Введите название палитры', 'error')
    return
  }
  
  if (!props.colors || props.colors.length === 0) {
    showMessage('Нет цветов для сохранения', 'error')
    return
  }
  
  console.log('Сохранение палитры:', paletteName.value, props.colors) // Для отладки
  
  const success = storage.savePalette({
    name: paletteName.value.trim(),
    colors: [...props.colors] // Делаем копию массива
  })
  
  if (success) {
    showMessage('Палитра сохранена!', 'success')
    loadSavedCount()
    emit('saved') // Отправляем событие о сохранении
    cancel()
  } else {
    showMessage('Ошибка сохранения', 'error')
  }
}

const cancel = () => {
  isSaving.value = false
  paletteName.value = ''
}

const showMessage = (text, type) => {
  message.value = text
  messageType.value = type
  
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 3000)
}

onMounted(() => {
  loadSavedCount()
})
</script>

<style scoped>
.save-palette {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.save-palette h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.save-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.save-btn {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn:hover {
  background: #45a049;
}

.count {
  font-size: 14px;
  color: #666;
}

.save-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.save-form label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-weight: bold;
  color: #333;
}

.name-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.confirm-btn {
  flex: 1;
  padding: 8px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  flex: 1;
  padding: 8px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.message {
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>