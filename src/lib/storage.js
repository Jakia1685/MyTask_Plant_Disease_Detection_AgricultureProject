// FR-10: প্রতিটি ফলাফল সংরক্ষণ; ব্যবহারকারী নিজের ইতিহাস দেখতে ও মুছতে পারবে।
const KEY = 'pdd_history_v1'

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

function save(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // স্টোরেজ ভরে গেলে সবচেয়ে পুরনো অর্ধেক বাদ দিয়ে আবার চেষ্টা
    try { localStorage.setItem(KEY, JSON.stringify(items.slice(0, Math.ceil(items.length / 2)))) } catch { /* ignore */ }
  }
}

export function addHistory(entry) {
  const items = [entry, ...loadHistory()].slice(0, 50)
  save(items)
  return items
}

export function removeHistory(id) {
  const items = loadHistory().filter((i) => i.id !== id)
  save(items)
  return items
}

export function clearHistory() {
  save([])
  return []
}

// ছোট থাম্বনেইল (localStorage-এ বড় ছবি রাখা যায় না)
export function makeThumbnail(file, size = 220) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, size / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve('') }
    img.src = url
  })
}
