import foodsResource from "../../data/api-source";
import foodItem from "../templates/food-item";

const DIABETESDISH = {
  async render() {
    return `
        <div class="diabetes-dish">
          <!-- Header -->
          <div class="diabetes-dish-header">
            <h1>Diabetes<span>Dish</span> Matcher</h1>
            <p>Enter your blood sugar levels to receive a personalized meal plan tailored to your specific blood glucose needs</p>
          </div>

          <!-- Input Container -->
          <div class="blood-sugar-input-container">
            <div class="input-header">
              <div class="input-icon">
                <i class="bi bi-droplet-fill"></i>
              </div>
              <div class="input-header-text">
                <h3>Enter Your Blood Sugar</h3>
                <p>Input your current blood glucose level (mg/dL)</p>
              </div>
            </div>
            
            <div class="blood-sugar-input-group">
              <input
                type="number"
                placeholder="e.g., 100"
                aria-label="Input blood sugar level in mg/dL"
                id="bloodSugarInput"
                min="1"
                max="600"
              />
              <button type="button" id="searchButton" aria-label="Search food recommendations">
                <i class="bi bi-search" aria-hidden="true"></i>
                Find Food
              </button>
            </div>
            <div id="validationMessage" role="alert" aria-live="polite"></div>

            <!-- Visual Gauge -->
            <div class="blood-sugar-gauge" id="gaugeContainer" style="display: none;">
              <div class="gauge-bar">
                <div class="gauge-marker" id="gaugeMarker" style="left: 50%;"></div>
              </div>
              <div class="gauge-labels">
                <span>Low (&lt;70)</span>
                <span>Normal (70-120)</span>
                <span>High (&gt;120)</span>
              </div>
            </div>
          </div>

          <!-- Steps Guide -->
          <div class="steps-guide">
            <div class="step-item">
              <div class="step-number">1</div>
              <h4>Check Your Level</h4>
              <p>Enter your blood sugar reading from your glucometer</p>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <h4>Get Recommendations</h4>
              <p>We'll analyze and suggest suitable foods</p>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <h4>Eat Healthy</h4>
              <p>Follow our meal suggestions for better health</p>
            </div>
          </div>

          <!-- Results Container -->
          <div id="foodContainer" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-4">
          </div>

          <!-- Info Box -->
          <div class="info-box">
            <h4><i class="bi bi-info-circle-fill"></i> Important Note</h4>
            <p>Before you use this feature, please consult a doctor or lab to check your blood sugar levels accurately. This tool provides general food recommendations and should not replace professional medical advice.</p>
          </div>
        </div>
      `;
  },

  async afterRender() {
    const searchButton = document.getElementById('searchButton');
    const bloodSugarInput = document.getElementById('bloodSugarInput');
    
    searchButton.addEventListener('click', this.handleSearch.bind(this));
    
    // Allow Enter key to trigger search
    bloodSugarInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.handleSearch();
      }
    });

    // Update gauge on input change
    bloodSugarInput.addEventListener('input', () => {
      this.updateGauge(bloodSugarInput.value);
    });
  },

  updateGauge(value) {
    const gaugeContainer = document.getElementById('gaugeContainer');
    const gaugeMarker = document.getElementById('gaugeMarker');
    
    if (!value || value <= 0) {
      gaugeContainer.style.display = 'none';
      return;
    }

    gaugeContainer.style.display = 'block';
    const numValue = parseFloat(value);
    
    // Calculate position (0-600 range mapped to 0-100%)
    let position = Math.min(Math.max((numValue / 600) * 100, 2), 98);
    gaugeMarker.style.left = `${position}%`;

    // Update marker color based on level
    if (numValue < 70) {
      gaugeMarker.style.borderColor = '#E74C3C';
    } else if (numValue <= 120) {
      gaugeMarker.style.borderColor = '#2ECC71';
    } else {
      gaugeMarker.style.borderColor = '#E74C3C';
    }
  },

  validateInput(value) {
    const validationMessage = document.getElementById('validationMessage');
    
    // Check for empty input
    if (value === '' || value === null) {
      validationMessage.textContent = 'Silakan masukkan kadar gula darah Anda.';
      return false;
    }
    
    const numValue = parseFloat(value);
    
    // Check for non-numeric input
    if (isNaN(numValue)) {
      validationMessage.textContent = 'Masukkan angka yang valid.';
      return false;
    }
    
    // Check for negative numbers
    if (numValue < 0) {
      validationMessage.textContent = 'Kadar gula darah tidak boleh negatif.';
      return false;
    }
    
    // Check for zero
    if (numValue === 0) {
      validationMessage.textContent = 'Kadar gula darah harus lebih dari 0.';
      return false;
    }
    
    // Check for maximum limit (600 mg/dL is extreme HHS level)
    if (numValue > 600) {
      validationMessage.textContent = 'Kadar gula darah melebihi batas maksimum (600 mg/dL). Jika nilai ini benar, segera hubungi dokter.';
      return false;
    }
    
    // Clear validation message if valid
    validationMessage.textContent = '';
    return true;
  },

  async _fetchAllFoods() {
    try {
      const [lowSugar, normalSugar, highSugar] = await Promise.all([
        foodsResource.getLowSugarList(),
        foodsResource.getNormalSugarList(),
        foodsResource.getHighSugarList(),
      ]);

      const allFoods = [
        ...(Array.isArray(lowSugar) ? lowSugar : []),
        ...(Array.isArray(normalSugar) ? normalSugar : []),
        ...(Array.isArray(highSugar) ? highSugar : []),
      ];

      // Remove duplicates based on ID if any
      const uniqueFoods = Array.from(new Map(allFoods.map((item) => [item.id, item])).values());

      return uniqueFoods;
    } catch (error) {
      console.error("Error aggregating foods:", error);
      return [];
    }
  },

  _calculateNSS(food, userBSL) {
    // 1. Definisikan bobot (Dynamic Weighting)
    /*
      NSS Algorithm Formula:
      Score = (w_protein * protein) + (w_cals * calories) + (w_carbs * carbs) + (w_sugar * sugar)
    */

    let w_protein = 0;
    let w_cals = 0;
    let w_carbs = 0;
    let w_sugar = 0;

    // Pastikan userBSL valid
    const bsl = parseFloat(userBSL);

    // Dynamic Weighting Logic
    if (bsl > 120) {
      // KONDISI: HYPERGLYCEMIA (Gula Darah Tinggi)
      // Goal: Turunkan gula darah drastis via diet ketat
      w_sugar = -15;    // Hukuman berat untuk gula
      w_carbs = -5;     // Hukuman untuk karbohidrat
      w_protein = 8;    // Bonus besar untuk protein (satiety tanpa spike gula)
      w_cals = -0.5;    // Penalti ringan kalori
    } else if (bsl < 70) {
      // KONDISI: HYPOGLYCEMIA (Gula Darah Rendah)
      // Goal: Naikkan gula darah cepat
      w_sugar = 5;      // Bonus untuk gula (perlu cepat)
      w_carbs = 3;      // Bonus karbohidrat
      w_protein = 1;    // Protein tetap positif tapi prioritas rendah
      w_cals = 0;       // Kalori kurang relevan di fase akut
    } else {
      // KONDISI: NORMAL (70 - 120)
      // Goal: Maintain kesehatan & prevent spike
      w_sugar = -5;     // Hindari gula berlebih
      w_carbs = -2;     // Batasi karbo moderat
      w_protein = 5;    // Protein bagus untuk maintenance
      w_cals = -1;      // Jaga kalori ideal
    }

    // 2. Normalisasi Data Nutrisi (Handle null/undefined)
    const valSugar = parseFloat(food.sugar) || 0;
    const valCarbs = parseFloat(food.carbs) || 0;
    const valProtein = parseFloat(food.protein) || 0;
    const valCals = parseFloat(food.calories) || 0;

    // 3. Hitung Raw Score
    // Kita gunakan normalisasi sederhana agar nilai nutrisi tidak terlalu mendominasi karena satuan yang berbeda (gram vs kcal)
    // Asumsi: kita pakai raw value saja dulu karena rentang datanya wajar, tapi dikalikan bobot.
    // Opsi: valCals dibagi 100 supaya skalanya mirip dengan gram makro.
    
    let rawScore = (w_protein * valProtein) + 
                   (w_cals * (valCals / 100)) + 
                   (w_carbs * valCarbs) + 
                   (w_sugar * valSugar);


    // 4. Hitung Match Percentage (0 - 100%)
    // Kita perlu mapping dari Raw Score ke Persentase.
    // Karena rawScore bisa negatif atau positif besar, kita pakai fungsi sigmoid atau min-max scaling sederhana.
    // Disini kita pakai pendekatan Min-Max Scaling relatif terhadap "Food Ideal" di kondisi tersebut.
    
    // Kita set batas heuristik berdasarkan bobot maksimal:
    // Misal max possible score per serving = (8 * 30g protein) + ... = ~200 an point (positif)
    // Min possible score = (-15 * 50g sugar) = -750 point (negatif)
    
    // Agar simpel dan mudah dipahami user, kita pakai Sigmoid Function yang di-shift.
    // Atau mapping linear: -500 (low) s/d +100 (high) -> 0% s/d 100%
    
    const MAX_SCORE = 150;
    const MIN_SCORE = -300;

    let matchPercentage = ((rawScore - MIN_SCORE) / (MAX_SCORE - MIN_SCORE)) * 100;

    // Clamp value 0-100
    matchPercentage = Math.max(0, Math.min(100, matchPercentage));

    // Refinement: Kalau BSL Tinggi (>120) DAN Sugar > 10g, paksa match percentage rendah (Hard Rule)
    if (bsl > 120 && valSugar > 10) {
        matchPercentage = Math.min(matchPercentage, 40); // Max 40% (Zona Merah/Kuning)
    }

    // 5. Tentukan Kategori Match (Match Level)
    let matchLevel = 'low'; // default
    if (matchPercentage >= 80) matchLevel = 'high';
    else if (matchPercentage >= 50) matchLevel = 'medium';

    return {
        score: rawScore,
        matchPercentage: Math.round(matchPercentage),
        matchLevel: matchLevel
    };
  },

  async handleSearch() {
    const bloodSugarInput = document.getElementById('bloodSugarInput').value;
    const listKatalog = document.getElementById('foodContainer');
    
    // Validate input
    if (!this.validateInput(bloodSugarInput)) {
      return;
    }

    // Clear previous alert
    const previousAlert = document.querySelector('.blood-sugar-alert');
    if (previousAlert) {
      previousAlert.remove();
    }

    // Show loading state
    listKatalog.innerHTML = `
      <div class="col-12">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Analyzing ${bloodSugarInput} mg/dL & ranking foods based on NSS...</p>
        </div>
      </div>
    `;

    const userBSL = parseFloat(bloodSugarInput);

    // Determine Status Alert Message
    let alertMessage, alertClass, alertIcon;
    if (userBSL < 70) {
      alertClass = 'alert-danger';
      alertIcon = 'bi-exclamation-triangle-fill';
      alertMessage = `<strong>Gula Darah Rendah (${userBSL} mg/dL)</strong><br>Sistem memprioritaskan makanan dengan gula cepat serap untuk pemulihan.`;
    } else if (userBSL <= 120) {
      alertClass = 'alert-success';
      alertIcon = 'bi-check-circle-fill';
      alertMessage = `<strong>Gula Darah Normal (${userBSL} mg/dL)</strong><br>Menampilkan makanan seimbang untuk menjaga kesehatan.`;
    } else {
      alertClass = 'alert-danger';
      alertIcon = 'bi-exclamation-triangle-fill';
      alertMessage = `<strong>Gula Darah Tinggi (${userBSL} mg/dL)</strong><br>Sistem memfilter ketat gula & karbohidrat. Protein tinggi diprioritaskan.`;
    }

    // --- NEW LOGIC: Fetch All & Rank ---
    const allFoods = await this._fetchAllFoods();

    if (allFoods.length === 0) {
         listKatalog.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning blood-sugar-alert" role="alert">
            <i class="bi bi-wifi-off" style="font-size: 1.5rem;"></i>
            <div>Gagal memuat data makanan. Periksa koneksi internet Anda.</div>
          </div>
        </div>
      `;
      return;
    }

    // Calculate NSS for each food
    const rankedFoods = allFoods.map(food => {
        const nssResult = this._calculateNSS(food, userBSL);
        return { ...food, ...nssResult };
    });

    // Sort by NSS Score (Highest first)
    rankedFoods.sort((a, b) => b.score - a.score);

    // Limit output? (Optional, maybe top 20 for performance if list is huge)
    // For now we render all.

    // --- Render Alert ---
    const alertContainer = document.createElement('div');
    alertContainer.innerHTML = `
      <div class="alert ${alertClass} blood-sugar-alert" role="alert">
        <i class="bi ${alertIcon}" style="font-size: 1.5rem;"></i>
        <div>${alertMessage}</div>
      </div>
    `;
    // Insert alert before food container
    listKatalog.parentElement.insertBefore(alertContainer.firstElementChild, listKatalog);


    // --- Render Foods ---
    listKatalog.innerHTML = '';
    
    if (rankedFoods.length === 0) {
         listKatalog.innerHTML = '<p class="text-center w-100">No matching foods found.</p>';
         return;
    }

    rankedFoods.forEach((food) => {
      // Pass the extra NSS info to the template
      listKatalog.innerHTML += foodItem(food);
    });
  },
};

export default DIABETESDISH;



