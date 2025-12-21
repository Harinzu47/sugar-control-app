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

  async handleSearch() {
    const bloodSugarInput = document.getElementById('bloodSugarInput').value;
    const listKatalog = document.getElementById('foodContainer');
    
    // Validate input
    if (!this.validateInput(bloodSugarInput)) {
      return;
    }

    let katalog;
    let alertMessage;
    let alertIcon;
    let alertClass;

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
          <p class="loading-text">Mencari rekomendasi makanan...</p>
        </div>
      </div>
    `;

    const numValue = parseFloat(bloodSugarInput);

    if (numValue < 70) {
      katalog = await foodsResource.getHighSugarList();
      alertClass = 'alert-danger';
      alertIcon = 'bi-exclamation-triangle-fill';
      alertMessage = `<strong>Gula Darah Rendah (${numValue} mg/dL)</strong><br>Segera konsumsi makanan yang mengandung gula untuk menaikkan kadar gula darah Anda.`;
    } else if (numValue >= 70 && numValue <= 120) {
      katalog = await foodsResource.getNormalSugarList();
      alertClass = 'alert-success';
      alertIcon = 'bi-check-circle-fill';
      alertMessage = `<strong>Gula Darah Normal (${numValue} mg/dL)</strong><br>Kadar gula darah Anda dalam rentang normal. Pertahankan pola makan sehat!`;
    } else {
      katalog = await foodsResource.getLowSugarList();
      alertClass = 'alert-danger';
      alertIcon = 'bi-exclamation-triangle-fill';
      alertMessage = `<strong>Gula Darah Tinggi (${numValue} mg/dL)</strong><br>Perhatikan asupan makanan Anda. Pilih makanan dengan indeks glikemik rendah.`;
    }

    // Check for API errors
    if (katalog.error) {
      listKatalog.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger blood-sugar-alert" role="alert">
            <i class="bi bi-exclamation-triangle-fill" style="font-size: 1.5rem;"></i>
            <div>${katalog.message}</div>
          </div>
        </div>
      `;
      return;
    }

    // Check for empty results
    if (!Array.isArray(katalog) || katalog.length === 0) {
      listKatalog.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning blood-sugar-alert" role="alert">
            <i class="bi bi-info-circle-fill" style="font-size: 1.5rem;"></i>
            <div>Tidak ada rekomendasi makanan yang ditemukan. Silakan coba lagi nanti.</div>
          </div>
        </div>
      `;
      return;
    }

    const alertContainer = document.createElement('div');
    alertContainer.innerHTML = `
      <div class="alert ${alertClass} blood-sugar-alert" role="alert">
        <i class="bi ${alertIcon}" style="font-size: 1.5rem;"></i>
        <div>${alertMessage}</div>
      </div>
    `;

    // Insert the alert before the food container
    listKatalog.parentElement.insertBefore(alertContainer.firstElementChild, listKatalog);

    // Clear loading and render food items
    listKatalog.innerHTML = '';

    // Render food items
    katalog.forEach((food) => {
      listKatalog.innerHTML += foodItem(food);
    });
  },
};

export default DIABETESDISH;
