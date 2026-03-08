/**
 * @fileoverview AI-powered dietary recommendation via Groq API (llama-3.3-70b-versatile).
 * Fallback ke tips hardcoded jika API tidak tersedia atau rate limit tercapai.
 * @module aiRecommender
 */

import CONFIG from '../scripts/global/config';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const MAX_TOKENS = 800;

const SYSTEM_PROMPT = `Kamu adalah ahli gizi dan diabetes educator yang ramah, berempati, dan selalu \
berbicara dalam Bahasa Indonesia. Berikan penjelasan yang mudah dipahami orang awam. \
Selalu akhiri dengan semangat dan motivasi positif. \
Jangan berikan saran medis spesifik tentang obat atau insulin — fokus pada diet dan gaya hidup.`;

const FALLBACK_MESSAGE =
    'Saat ini rekomendasi AI sedang tidak tersedia. Sebagai panduan umum, ' +
    'pilihlah makanan dengan indeks glikemik rendah, perbanyak sayuran hijau, ' +
    'dan batasi makanan manis serta karbohidrat olahan. Tetap semangat! 💪';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Membangun user prompt dari data kesehatan dan makanan yang direkomendasikan.
 * @param {Object} params
 * @returns {string}
 */
function buildUserPrompt({ healthProfile, classificationResult, recommendedFoods }) {
    const fasting = healthProfile.fastingGlucose ?? 'tidak diisi';
    const postMeal = healthProfile.postMealGlucose ?? 'tidak diisi';
    const hba1c = healthProfile.hba1c ?? 'tidak diisi';
    const foodList = recommendedFoods.length > 0
        ? recommendedFoods.slice(0, 9).map((f) => f.title).join(', ')
        : 'belum ada makanan yang dipilih';

    return `Data kesehatan pengguna:
- Gula darah puasa: ${fasting} mg/dL
- Gula darah 2 jam setelah makan: ${postMeal} mg/dL
- HbA1c: ${hba1c}%
- Kondisi terdeteksi: ${classificationResult.label}

Makanan yang direkomendasikan sistem hari ini:
${foodList}

Tolong berikan:
1. Penjelasan singkat kondisi mereka (2 kalimat, gunakan bahasa yang tidak menakutkan)
2. Mengapa makanan-makanan ini cocok untuk kondisi mereka (2-3 kalimat)
3. 3 tips diet praktis yang bisa langsung dilakukan hari ini
4. Kalimat motivasi penutup yang hangat

Format: gunakan paragraf biasa, JANGAN gunakan markdown, bullet points, atau simbol bintang (*).`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Memanggil Groq API untuk mendapatkan rekomendasi diet personal dalam Bahasa Indonesia.
 *
 * @param {Object} params
 * @param {Object} params.healthProfile        - Data profil dari loadHealthProfile()
 * @param {Object} params.classificationResult - Hasil dari classifyDiabetes()
 * @param {Array}  params.recommendedFoods     - Array objek makanan { title, ... }
 * @returns {Promise<string>} Teks rekomendasi dalam Bahasa Indonesia
 */
export async function getAIRecommendation({ healthProfile, classificationResult, recommendedFoods = [] }) {
    const apiKey = CONFIG.GROQ_API_KEY;

    if (!apiKey) {
        console.warn('[aiRecommender] GROQ_API_KEY tidak ditemukan. Menggunakan fallback.');
        return FALLBACK_MESSAGE;
    }

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                max_tokens: MAX_TOKENS,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: buildUserPrompt({ healthProfile, classificationResult, recommendedFoods }) },
                ],
            }),
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error('[aiRecommender] Groq API error:', response.status, errBody);
            return FALLBACK_MESSAGE;
        }

        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;

        if (!text) {
            console.error('[aiRecommender] Respons Groq tidak berisi teks:', data);
            return FALLBACK_MESSAGE;
        }

        return text;
    } catch (error) {
        console.error('[aiRecommender] Gagal menghubungi Groq API:', error);
        return FALLBACK_MESSAGE;
    }
}

// ---------------------------------------------------------------------------
// Quick tips (hardcoded, tanpa API call)
// ---------------------------------------------------------------------------

/**
 * Mengembalikan 5 tips diet cepat berdasarkan kondisi.
 * Berguna sebagai fallback atau saat API tidak tersedia.
 *
 * @param {'normal'|'prediabetes'|'diabetes'|'high-risk'|'general'} condition
 * @returns {string[]} Array 5 tips
 */
export function getQuickTip(condition) {
    const tips = {
        normal: [
            'Pertahankan pola makan seimbang dengan porsi yang terkontrol.',
            'Konsumsi buah dan sayur minimal 5 porsi per hari.',
            'Batasi makanan olahan dan minuman bersoda.',
            'Olahraga ringan minimal 30 menit sehari.',
            'Rutin cek gula darah setiap 3-6 bulan sekali.',
        ],
        prediabetes: [
            'Kurangi konsumsi karbohidrat sederhana seperti nasi putih dan roti putih.',
            'Pilih makanan tinggi serat seperti oatmeal, sayuran hijau, dan kacang-kacangan.',
            'Hindari minuman manis termasuk jus kemasan dan minuman bersoda.',
            'Olahraga minimal 30 menit sehari, 5 kali seminggu.',
            'Turunkan berat badan 5-7% jika kamu kelebihan berat badan.',
        ],
        diabetes: [
            'Hitung asupan karbohidrat harian, targetkan maksimal 90g per hari.',
            'Pilih karbohidrat kompleks: nasi merah, ubi, atau roti gandum utuh.',
            'Makan dalam porsi kecil tapi sering (5-6x sehari) untuk stabilkan gula darah.',
            'Hindari makanan dengan indeks glikemik tinggi seperti nasi putih, kentang goreng, dan permen.',
            'Selalu baca label nutrisi dan perhatikan kandungan gula tersembunyi.',
        ],
        'high-risk': [
            'Segera konsultasi dengan dokter atau ahli gizi untuk program diet yang tepat.',
            'Eliminasi semua makanan dan minuman manis dari diet harian.',
            'Prioritaskan protein tanpa lemak dan sayuran non-tepung di setiap makan.',
            'Pantau gula darah setiap hari dan catat hasilnya.',
            'Hindari alkohol dan rokok yang dapat memperburuk kondisi gula darah.',
        ],
        general: [
            'Pilih makanan dengan indeks glikemik rendah untuk menjaga gula darah stabil.',
            'Perbanyak konsumsi sayuran hijau dan protein tanpa lemak.',
            'Minum air putih minimal 8 gelas per hari.',
            'Hindari makanan olahan, gorengan, dan minuman manis.',
            'Isi profil kesehatan kamu untuk mendapat rekomendasi yang lebih personal!',
        ],
    };

    return tips[condition] ?? tips['general'];
}
