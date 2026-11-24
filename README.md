# Plant Disease Detection (Potato & Tomato)

AI Smart Agriculture প্রজেক্টের **Disease Detection** অংশ — আলাদা, স্বয়ংসম্পূর্ণ React + Vite অ্যাপ।

## চালানোর নিয়ম (VS Code)

1. জিপ Extract করে ফোল্ডারটি VS Code-এ খুলুন (File → Open Folder)।
2. Terminal খুলুন (Ctrl + `)।
3. একবার ডিপেন্ডেন্সি ইনস্টল করুন (ইন্টারনেট লাগবে):

       npm install

4. অ্যাপ চালান:

       npm run dev

5. Terminal-এ `http://localhost:5173/` লেখা আসবে — Ctrl+Click করুন, অথবা Chrome-এ এই লিংক খুলুন।
   (Node.js 20.19+ বা 22+ লাগবে — `node -v` দিয়ে দেখুন।)

## ফিচার
- JPG/PNG আপলোড (সর্বোচ্চ 5 MB, ড্র্যাগ-ড্রপ + প্রিভিউ), Potato/Tomato নির্বাচন
- বিশ্লেষণের ধাপ-ভিত্তিক প্রোগ্রেস স্ক্রিন
- রোগের নাম + কনফিডেন্স স্কোর; 60%-এর নিচে "Low confidence" সতর্কতা
- History: সার্চ, ফিল্টার, একটি/সব ফলাফল মোছা (ব্রাউজারের localStorage-এ সংরক্ষিত)
- AI সার্ভিস না পেলে এরর মেসেজ, সংরক্ষিত ডেটা অপরিবর্তিত

## Demo Mode সম্পর্কে (গুরুত্বপূর্ণ)
প্রজেক্ট জিপে কোনো প্রশিক্ষিত মডেল বা ব্যাকএন্ড নেই। তাই এখন ফলাফল **নকল (simulated)** এবং রেজাল্ট পেজে "Demo mode" ব্যানার দেখায়।

আসল মডেল যুক্ত করতে:
1. `.env.example` কপি করে `.env.local` বানান, `VITE_API_URL=http://localhost:8000` দিন।
2. আপনার Python সার্ভিসে `POST /predict` রাখুন — `multipart/form-data` (`image`, `plant`) নিয়ে
   `{ "label": "Late Blight", "confidence": 93.4 }` রিটার্ন করবে। `label` অবশ্যই `src/lib/diseases.js`-এর নামের সাথে মিলতে হবে।
3. ডেভ সার্ভার রিস্টার্ট করুন — Demo ব্যানার আর দেখাবে না।
