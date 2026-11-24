import { DISEASES } from '@/lib/diseases.js'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const isDemoMode = !API_URL

/**
 * পাতার ছবি পাঠিয়ে রোগ শনাক্ত করে।
 *
 * Real mode (VITE_API_URL সেট থাকলে):
 *   POST {API_URL}/predict   (multipart/form-data: image, plant)
 *   Response JSON: { "label": "Late Blight", "confidence": 93.4 }
 *
 * Demo mode: কোনো প্রশিক্ষিত মডেল সংযুক্ত নেই। ফলাফল ছবি থেকে নির্ধারিত একটি
 * নকল (simulated) ফলাফল — এটি আসল রোগ নির্ণয় নয়।
 */
export async function predictDisease(file, plant) {
  if (API_URL) {
    const body = new FormData()
    body.append('image', file)
    body.append('plant', plant)
    const res = await fetch(`${API_URL}/predict`, { method: 'POST', body })
    if (!res.ok) throw new Error(`AI service error (${res.status})`)
    const data = await res.json()
    return { label: data.label, confidence: Number(data.confidence), demo: false }
  }
  return demoPredict(file, plant)
}

async function demoPredict(file, plant) {
  await new Promise((r) => setTimeout(r, 2600)) // বিশ্লেষণের অ্যানিমেশন দেখানোর জন্য
  const bytes = new Uint8Array(await file.slice(0, 4096).arrayBuffer())
  let seed = file.size
  for (const b of bytes) seed = (seed * 31 + b) % 1000003
  const classes = DISEASES[plant]
  const label = classes[seed % classes.length].name
  const confidence = 52 + (seed % 4600) / 100 // 52.00 – 97.99
  return { label, confidence: Math.round(confidence * 10) / 10, demo: true }
}
