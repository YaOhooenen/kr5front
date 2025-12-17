// Утилиты для работы с цветами
export const colorUtils = {
  // Генерация случайного HEX-цвета
  generateRandomHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  },

  // Конвертация HEX в RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  },

  // Конвертация RGB в HEX
  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  },

  // Генерация гармоничной палитры
  generateHarmoniousPalette(baseColor = null, count = 5, type = 'analogous') {
    const colors = []
    let baseHex = baseColor || this.generateRandomHex()
    const baseRgb = this.hexToRgb(baseHex)
    
    const hueStep = 360 / count
    
    for (let i = 0; i < count; i++) {
      let hue = (this.rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b).h + hueStep * i) % 360
      
      switch(type) {
        case 'monochromatic':
          // Монохромная: одинаковый оттенок, разная насыщенность/яркость
          const saturation = Math.max(30, (70 + i * 10) % 100)
          const lightness = Math.max(20, (50 + i * 15) % 80)
          colors.push(this.hslToHex(hue, saturation, lightness))
          break
        case 'triadic':
          // Триада: цвета через 120 градусов
          hue = (this.rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b).h + 120 * i) % 360
          colors.push(this.hslToHex(hue, 70, 50))
          break
        case 'complementary':
          // Комплементарная: противоположные цвета
          hue = (this.rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b).h + 180 * i) % 360
          colors.push(this.hslToHex(hue, 70, 50))
          break
        default: // analogous
          // Аналогичная: соседние цвета
          hue = (this.rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b).h + 30 * i) % 360
          colors.push(this.hslToHex(hue, 70, 50))
      }
    }
    
    return colors
  },

  // Конвертация RGB в HSL
  rgbToHsl(r, g, b) {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch(max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  },

  // Конвертация HSL в HEX
  hslToHex(h, s, l) {
    h /= 360
    s /= 100
    l /= 100
    
    let r, g, b
    
    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  },

  // Расчет контрастности по WCAG
  calculateContrast(color1, color2) {
    const rgb1 = this.hexToRgb(color1)
    const rgb2 = this.hexToRgb(color2)
    
    const luminance1 = this.calculateLuminance(rgb1.r, rgb1.g, rgb1.b)
    const luminance2 = this.calculateLuminance(rgb2.r, rgb2.g, rgb2.b)
    
    const lighter = Math.max(luminance1, luminance2)
    const darker = Math.min(luminance1, luminance2)
    
    return (lighter + 0.05) / (darker + 0.05)
  },

  // Расчет яркости
  calculateLuminance(r, g, b) {
    const rs = r / 255
    const gs = g / 255
    const bs = b / 255
    
    const R = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4)
    const G = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4)
    const B = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4)
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B
  },

  // Проверка уровня доступности WCAG
  checkAccessibilityLevel(contrast) {
    if (contrast >= 7) return { level: 'AAA', passed: true }
    if (contrast >= 4.5) return { level: 'AA', passed: true }
    if (contrast >= 3) return { level: 'AA Large', passed: true }
    return { level: 'Недостаточно', passed: false }
  },

  // Генерация по настроению
  generateMoodPalette(mood = 'calm', count = 5) {
    const moodSettings = {
      calm: { h: 220, sRange: [30, 60], lRange: [40, 70] },
      energetic: { h: 0, sRange: [70, 90], lRange: [50, 70] },
      professional: { h: 200, sRange: [20, 40], lRange: [30, 60] },
      playful: { h: 300, sRange: [60, 80], lRange: [60, 80] },
      natural: { h: 120, sRange: [40, 70], lRange: [30, 60] }
    }
    
    const settings = moodSettings[mood] || moodSettings.calm
    const colors = []
    
    for (let i = 0; i < count; i++) {
      const h = (settings.h + i * 30) % 360
      const s = settings.sRange[0] + Math.random() * (settings.sRange[1] - settings.sRange[0])
      const l = settings.lRange[0] + Math.random() * (settings.lRange[1] - settings.lRange[0])
      colors.push(this.hslToHex(h, s, l))
    }
    
    return colors
  }
}