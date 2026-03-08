/**
 * @fileoverview Diabetes Condition Classifier
 * Mengklasifikasikan kondisi diabetes berdasarkan standar ADA (American Diabetes Association) dan WHO.
 * @module diabetesClassifier
 */

// ---------------------------------------------------------------------------
// Thresholds
// ---------------------------------------------------------------------------

const THRESHOLDS = {
    normal: {
        fasting: { max: 100 },       // < 100 mg/dL
        postMeal: { max: 140 },      // < 140 mg/dL
        hba1c: { max: 5.7 },         // < 5.7%
    },
    prediabetes: {
        fasting: { min: 100, max: 126 },    // 100–125 mg/dL
        postMeal: { min: 140, max: 200 },   // 140–199 mg/dL
        hba1c: { min: 5.7, max: 6.5 },     // 5.7%–6.4%
    },
    diabetes: {
        fasting: { min: 126 },       // ≥ 126 mg/dL
        postMeal: { min: 200 },      // ≥ 200 mg/dL
        hba1c: { min: 6.5 },         // ≥ 6.5%
    },
};

// ---------------------------------------------------------------------------
// Classification result templates
// ---------------------------------------------------------------------------

const CLASSIFICATION_TEMPLATES = {
    normal: {
        condition: 'normal',
        label: 'Normal',
        severity: 1,
        color: '#10b981',
        emoji: '✅',
        description:
            'Kadar gula darah kamu berada dalam batas normal. Pertahankan gaya hidup sehat dan terus pantau secara rutin.',
        recommendations: [
            'Pertahankan pola makan seimbang dengan banyak sayur dan buah',
            'Olahraga rutin minimal 150 menit per minggu',
            'Batasi konsumsi gula tambahan dan makanan olahan',
            'Pantau kadar gula darah secara berkala (1–2 kali setahun)',
            'Jaga berat badan ideal dengan BMI 18.5–24.9',
        ],
        dietType: 'balanced',
        maxDailyCarbs: 225,
        avoidFoods: ['sugary drinks', 'excessive alcohol', 'processed snacks'],
    },
    prediabetes: {
        condition: 'prediabetes',
        label: 'Pre-Diabetes',
        severity: 2,
        color: '#f59e0b',
        emoji: '⚠️',
        description:
            'Kadar gula darah kamu berada di zona waspada (pre-diabetes). Kondisi ini masih bisa dipulihkan dengan perubahan gaya hidup yang tepat sebelum berkembang menjadi diabetes.',
        recommendations: [
            'Kurangi karbohidrat sederhana seperti nasi putih, roti putih, dan gula',
            'Olahraga 30 menit per hari, minimal 5 hari seminggu',
            'Turunkan berat badan 5–7% jika kamu kelebihan berat badan',
            'Konsumsi makanan tinggi serat seperti sayuran hijau dan biji-bijian utuh',
            'Pantau kadar gula darah setiap 3–6 bulan',
            'Konsultasi dengan dokter atau ahli gizi',
        ],
        dietType: 'low-carb',
        maxDailyCarbs: 130,
        avoidFoods: ['white rice', 'sugar', 'white bread', 'sugary drinks', 'corn syrup', 'candy'],
    },
    diabetes: {
        condition: 'diabetes',
        label: 'Diabetes',
        severity: 3,
        color: '#ef4444',
        emoji: '🔴',
        description:
            'Kadar gula darah kamu menunjukkan indikasi diabetes. Segera konsultasikan dengan dokter untuk diagnosis resmi dan rencana penanganan yang tepat.',
        recommendations: [
            'Segera konsultasi dengan dokter spesialis endokrinologi atau penyakit dalam',
            'Ikuti diet diabetes ketat: batasi karbohidrat dan gula secara signifikan',
            'Pantau kadar gula darah secara rutin (minimal 2 kali sehari)',
            'Olahraga ringan-sedang secara konsisten seperti jalan kaki 30 menit/hari',
            'Hindari makanan dengan indeks glikemik tinggi',
            'Jangan lewatkan jadwal makan untuk mencegah hipoglikemia',
            'Edukasi keluarga tentang penanganan kondisi darurat gula darah',
        ],
        dietType: 'diabetic',
        maxDailyCarbs: 90,
        avoidFoods: [
            'white rice', 'sugar', 'honey', 'white bread', 'corn syrup',
            'refined flour', 'sugary drinks', 'candy', 'cakes', 'sweet fruits',
        ],
    },
    'high-risk': {
        condition: 'high-risk',
        label: 'Risiko Tinggi',
        severity: 4,
        color: '#7c3aed',
        emoji: '🚨',
        description:
            'Kombinasi parameter gula darah kamu menunjukkan risiko tinggi. Beberapa indikator berada di level kritis secara bersamaan. Konsultasi dokter segera sangat disarankan.',
        recommendations: [
            '⚡ Konsultasi dokter SEGERA — jangan tunda lebih lama',
            'Ikuti program diet diabetes sangat ketat di bawah pengawasan ahli gizi',
            'Batasi karbohidrat secara ekstrem (di bawah 75g per hari)',
            'Pantau gula darah minimal 3–4 kali sehari',
            'Persiapkan rencana darurat jika terjadi hipoglikemia atau hiperglikemia',
            'Hindari semua sumber gula tersembunyi (saus, bumbu instan, minuman kemasan)',
            'Prioritaskan protein dan lemak sehat sebagai sumber energi utama',
        ],
        dietType: 'diabetic',
        maxDailyCarbs: 75,
        avoidFoods: [
            'white rice', 'sugar', 'honey', 'white bread', 'corn syrup',
            'refined flour', 'potato', 'sugary drinks', 'candy', 'cakes',
            'sweet fruits', 'fruit juice', 'alcohol',
        ],
    },
};

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/**
 * Menentukan level kondisi dari satu nilai parameter.
 * @param {number|null} value - Nilai parameter
 * @param {{ max: number }|{ min: number, max: number }|{ min: number }} normalRange
 * @param {{ min: number, max: number }} prediabetesRange
 * @param {{ min: number }} diabetesRange
 * @returns {'normal'|'prediabetes'|'diabetes'|null}
 */
function classifyParam(value, normalRange, prediabetesRange, diabetesRange) {
    if (value === null || value === undefined || isNaN(value)) return null;

    if (value >= diabetesRange.min) return 'diabetes';
    if (value >= prediabetesRange.min && value < prediabetesRange.max) return 'prediabetes';
    if (value < normalRange.max) return 'normal';

    return null;
}

/**
 * Hitung level severity numerik dari kondisi.
 * @param {'normal'|'prediabetes'|'diabetes'|null} condition
 * @returns {number}
 */
function severityOf(condition) {
    switch (condition) {
        case 'diabetes': return 3;
        case 'prediabetes': return 2;
        case 'normal': return 1;
        default: return 0;
    }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Mengklasifikasikan kondisi diabetes berdasarkan parameter gula darah.
 * Minimal satu parameter harus diisi; fasting glucose diprioritaskan.
 * Jika dua atau lebih parameter berada di level borderline (pre-diabetes)
 * secara bersamaan, kondisi diklasifikasikan sebagai 'high-risk'.
 *
 * @param {Object} params
 * @param {number|null} params.fastingGlucose  - Gula darah puasa (mg/dL)
 * @param {number|null} params.postMealGlucose - Gula darah 2 jam setelah makan (mg/dL)
 * @param {number|null} params.hba1c           - HbA1c (%)
 * @returns {{
 *   condition: string,
 *   label: string,
 *   severity: number,
 *   color: string,
 *   emoji: string,
 *   description: string,
 *   recommendations: string[],
 *   dietType: string,
 *   maxDailyCarbs: number,
 *   avoidFoods: string[]
 * }}
 */
export function classifyDiabetes({ fastingGlucose = null, postMealGlucose = null, hba1c = null } = {}) {
    const fastingLevel = classifyParam(
        fastingGlucose,
        THRESHOLDS.normal.fasting,
        THRESHOLDS.prediabetes.fasting,
        THRESHOLDS.diabetes.fasting,
    );

    const postMealLevel = classifyParam(
        postMealGlucose,
        THRESHOLDS.normal.postMeal,
        THRESHOLDS.prediabetes.postMeal,
        THRESHOLDS.diabetes.postMeal,
    );

    const hba1cLevel = classifyParam(
        hba1c,
        THRESHOLDS.normal.hba1c,
        THRESHOLDS.prediabetes.hba1c,
        THRESHOLDS.diabetes.hba1c,
    );

    const levels = [fastingLevel, postMealLevel, hba1cLevel].filter(Boolean);

    if (levels.length === 0) {
        // Tidak ada data — kembalikan "normal" sebagai fallback aman
        return { ...CLASSIFICATION_TEMPLATES.normal };
    }

    // Cek apakah ada yang langsung diabetes
    if (levels.includes('diabetes')) {
        return { ...CLASSIFICATION_TEMPLATES.diabetes };
    }

    // Hitung jumlah parameter borderline (pre-diabetes)
    const prediabetesCount = levels.filter((l) => l === 'prediabetes').length;

    // HIGH RISK: 2 atau lebih parameter berada di zona pre-diabetes
    if (prediabetesCount >= 2) {
        return { ...CLASSIFICATION_TEMPLATES['high-risk'] };
    }

    // PRE-DIABETES: tepat satu parameter di zona pre-diabetes, atau prioritas fasting
    if (prediabetesCount === 1) {
        return { ...CLASSIFICATION_TEMPLATES.prediabetes };
    }

    // NORMAL: semua parameter dalam batas normal
    return { ...CLASSIFICATION_TEMPLATES.normal };
}

// ---------------------------------------------------------------------------

/**
 * Mengembalikan parameter query Spoonacular API yang sesuai dengan kondisi diabetes.
 *
 * @param {'normal'|'prediabetes'|'diabetes'|'high-risk'} condition - Kondisi hasil klasifikasi
 * @returns {{
 *   diet: string,
 *   maxCalories: number,
 *   minProtein: number,
 *   maxCarbs: number,
 *   tags: string,
 *   excludeIngredients?: string
 * }}
 */
export function getDietParameters(condition) {
    const DIET_PARAMS = {
        normal: {
            diet: 'balanced',
            maxCalories: 2000,
            minProtein: 50,
            maxCarbs: 225,
            tags: 'healthy',
        },
        prediabetes: {
            diet: 'low-carb',
            maxCalories: 1800,
            minProtein: 60,
            maxCarbs: 130,
            tags: 'low-glycemic,high-fiber',
            excludeIngredients: 'sugar,corn syrup',
        },
        diabetes: {
            diet: 'diabetic',
            maxCalories: 1600,
            minProtein: 70,
            maxCarbs: 90,
            tags: 'diabetic,low-sugar',
            excludeIngredients: 'sugar,honey,white rice,corn syrup,refined flour',
        },
        'high-risk': {
            diet: 'diabetic',
            maxCalories: 1500,
            minProtein: 75,
            maxCarbs: 75,
            tags: 'diabetic,low-sugar,low-carb',
            excludeIngredients: 'sugar,honey,white rice,white bread,corn syrup,refined flour,potato',
        },
    };

    return DIET_PARAMS[condition] ?? DIET_PARAMS.normal;
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'sugarcontrol_profile';

/**
 * Menyimpan profil kesehatan pengguna ke localStorage.
 *
 * @param {Object} profileData - Data profil yang akan disimpan
 * @returns {boolean} true jika berhasil disimpan, false jika terjadi error
 */
export function saveHealthProfile(profileData) {
    try {
        const payload = {
            ...profileData,
            savedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        return true;
    } catch (error) {
        console.error('[diabetesClassifier] Gagal menyimpan profil:', error);
        return false;
    }
}

/**
 * Memuat profil kesehatan pengguna dari localStorage.
 *
 * @returns {Object|null} Data profil atau null jika belum ada / terjadi error
 */
export function loadHealthProfile() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (error) {
        console.error('[diabetesClassifier] Gagal memuat profil:', error);
        return null;
    }
}

/**
 * Menghapus profil kesehatan pengguna dari localStorage.
 *
 * @returns {boolean} true jika berhasil dihapus, false jika terjadi error
 */
export function clearHealthProfile() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('[diabetesClassifier] Gagal menghapus profil:', error);
        return false;
    }
}
