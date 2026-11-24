// PlantVillage ডেটাসেটের ক্লাস অনুযায়ী (প্রস্তাবনা: Potato ও Tomato)
export const CONFIDENCE_THRESHOLD = 60 // FR-06: এর নিচে "low confidence" সতর্কতা
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // FR-04: সর্বোচ্চ 5 MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png'] // FR-04: শুধু JPG/PNG

export const PLANTS = ['Potato', 'Tomato']

export const DISEASES = {
  Potato: [
    { id: 'potato_early_blight', name: 'Early Blight', healthy: false, info: 'Dark concentric-ring spots usually appear first on older leaves.' },
    { id: 'potato_late_blight', name: 'Late Blight', healthy: false, info: 'Water-soaked dark patches that spread quickly in cool, humid weather.' },
    { id: 'potato_healthy', name: 'Healthy', healthy: true, info: 'No visible disease pattern detected on this leaf.' },
  ],
  Tomato: [
    { id: 'tomato_bacterial_spot', name: 'Bacterial Spot', healthy: false, info: 'Small dark, slightly raised spots on leaves, often with a yellow halo.' },
    { id: 'tomato_early_blight', name: 'Early Blight', healthy: false, info: 'Brown spots with concentric rings, starting on lower leaves.' },
    { id: 'tomato_late_blight', name: 'Late Blight', healthy: false, info: 'Large irregular greasy-looking patches that can spread across the plant fast.' },
    { id: 'tomato_leaf_mold', name: 'Leaf Mold', healthy: false, info: 'Pale yellow spots on the upper side with olive-green mold underneath.' },
    { id: 'tomato_septoria_leaf_spot', name: 'Septoria Leaf Spot', healthy: false, info: 'Many small round spots with grey centres and dark edges.' },
    { id: 'tomato_spider_mites', name: 'Spider Mites', healthy: false, info: 'Fine stippling and yellowing; webbing may be visible underneath.' },
    { id: 'tomato_target_spot', name: 'Target Spot', healthy: false, info: 'Brown lesions with ring patterns, sometimes with a yellow border.' },
    { id: 'tomato_yellow_leaf_curl_virus', name: 'Yellow Leaf Curl Virus', healthy: false, info: 'Leaves curl upward and turn yellow; plant growth is stunted.' },
    { id: 'tomato_mosaic_virus', name: 'Mosaic Virus', healthy: false, info: 'Mottled light and dark green patches with distorted leaves.' },
    { id: 'tomato_healthy', name: 'Healthy', healthy: true, info: 'No visible disease pattern detected on this leaf.' },
  ],
}

export function findDisease(plant, name) {
  return (DISEASES[plant] || []).find((d) => d.name === name)
}
