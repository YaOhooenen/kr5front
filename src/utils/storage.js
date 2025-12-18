// src/utils/storage.js
export const storage = {
  // Сохранить палитру
  savePalette(palette) {
    try {
      const palettes = this.getPalettes()
      palettes.push({
        id: Date.now(),
        name: palette.name || `Палитра ${new Date().toLocaleString()}`,
        colors: palette.colors,
        createdAt: new Date().toISOString(),
        type: palette.type || 'custom'
      })
      localStorage.setItem('paletteLibrary', JSON.stringify(palettes))
      return true
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      return false
    }
  },

  // Получить все палитры
  getPalettes() {
    try {
      const data = localStorage.getItem('paletteLibrary')
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Ошибка чтения:', error)
      return []
    }
  },

  // Удалить палитру по ID
  deletePalette(id) {
    try {
      const palettes = this.getPalettes()
      const filtered = palettes.filter(p => p.id !== id)
      localStorage.setItem('paletteLibrary', JSON.stringify(filtered))
      return true
    } catch (error) {
      console.error('Ошибка удаления:', error)
      return false
    }
  },

  // Очистить всю библиотеку
  clearLibrary() {
    try {
      localStorage.removeItem('paletteLibrary')
      return true
    } catch (error) {
      console.error('Ошибка очистки:', error)
      return false
    }
  },

  // Обновить палитру
  updatePalette(id, updates) {
    try {
      const palettes = this.getPalettes()
      const index = palettes.findIndex(p => p.id === id)
      if (index !== -1) {
        palettes[index] = { ...palettes[index], ...updates }
        localStorage.setItem('paletteLibrary', JSON.stringify(palettes))
        return true
      }
      return false
    } catch (error) {
      console.error('Ошибка обновления:', error)
      return false
    }
  },

  // Получить палитру по ID
  getPaletteById(id) {
    const palettes = this.getPalettes()
    return palettes.find(p => p.id === id)
  },

  // Сохранить текущую палитру (для быстрого доступа)
  saveCurrentPalette(colors) {
    try {
      localStorage.setItem('currentPalette', JSON.stringify(colors))
      return true
    } catch (error) {
      console.error('Ошибка сохранения текущей палитры:', error)
      return false
    }
  },

  // Получить текущую палитру
  getCurrentPalette() {
    try {
      const data = localStorage.getItem('currentPalette')
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Ошибка чтения текущей палитры:', error)
      return null
    }
  }
}