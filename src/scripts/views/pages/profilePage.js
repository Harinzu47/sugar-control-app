/**
 * @fileoverview Halaman Profil Kesehatan — input parameter diabetes & hasil klasifikasi.
 * Route: #/profile
 * @module profilePage
 */

import { Tooltip } from 'bootstrap';
import { classifyDiabetes, saveHealthProfile, loadHealthProfile, clearHealthProfile } from '../../../modules/diabetesClassifier';

const ProfilePage = {
  async render() {
    return `
    <div class="container py-4 py-md-5" style="max-width: 720px;">

      <!-- Header -->
      <div class="text-center mb-4">
        <div class="mb-3">
          <span style="font-size: 3rem;">🩺</span>
        </div>
        <h1 class="fw-bold fs-2">Profil Kesehatan Saya</h1>
        <p class="text-muted">Masukkan data untuk rekomendasi yang lebih personal</p>
      </div>

      <!-- Form Card -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-4">
          <form id="profileForm" novalidate>

            <!-- Fasting Glucose -->
            <div class="mb-4">
              <label for="fastingGlucose" class="form-label fw-semibold">
                Gula Darah Puasa
                <span class="ms-1 text-muted fw-normal">(mg/dL)</span>
                <button type="button"
                  class="btn btn-sm p-0 ms-1 text-muted border-0 bg-transparent"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Diukur setelah puasa minimal 8 jam (biasanya pagi hari sebelum sarapan). Normal: &lt; 100 mg/dL.">
                  <i class="bi bi-info-circle"></i>
                </button>
              </label>
              <input
                type="number"
                class="form-control form-control-lg"
                id="fastingGlucose"
                name="fastingGlucose"
                placeholder="Contoh: 95"
                min="50"
                max="500"
                step="1"
                aria-describedby="fastingHelp"
              />
              <div id="fastingHelp" class="form-text">Opsional — diisi dari hasil lab atau glucometer puasa</div>
            </div>

            <!-- Post-Meal Glucose -->
            <div class="mb-4">
              <label for="postMealGlucose" class="form-label fw-semibold">
                Gula Darah 2 Jam Setelah Makan
                <span class="ms-1 text-muted fw-normal">(mg/dL)</span>
                <button type="button"
                  class="btn btn-sm p-0 ms-1 text-muted border-0 bg-transparent"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Diukur tepat 2 jam setelah makan pertama. Normal: &lt; 140 mg/dL.">
                  <i class="bi bi-info-circle"></i>
                </button>
              </label>
              <input
                type="number"
                class="form-control form-control-lg"
                id="postMealGlucose"
                name="postMealGlucose"
                placeholder="Contoh: 130"
                min="50"
                max="600"
                step="1"
                aria-describedby="postMealHelp"
              />
              <div id="postMealHelp" class="form-text">Opsional — diisi dari hasil pengukuran 2 jam post-prandial</div>
            </div>

            <!-- HbA1c -->
            <div class="mb-4">
              <label for="hba1c" class="form-label fw-semibold">
                HbA1c
                <span class="ms-1 text-muted fw-normal">(%)</span>
                <button type="button"
                  class="btn btn-sm p-0 ms-1 text-muted border-0 bg-transparent"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="HbA1c (Hemoglobin A1c) mencerminkan rata-rata kadar gula darah 2–3 bulan terakhir. Normal: &lt; 5.7%.">
                  <i class="bi bi-info-circle"></i>
                </button>
              </label>
              <input
                type="number"
                class="form-control form-control-lg"
                id="hba1c"
                name="hba1c"
                placeholder="Contoh: 5.4"
                min="3"
                max="15"
                step="0.1"
                aria-describedby="hba1cHelp"
              />
              <div id="hba1cHelp" class="form-text">Opsional — dari hasil lab HbA1c (darah vena)</div>
            </div>

            <!-- Validation Message -->
            <div id="profileValidation" class="alert alert-danger d-none" role="alert" aria-live="polite"></div>

            <!-- Submit -->
            <button type="submit" id="analyzeBtn" class="btn btn-primary btn-lg w-100">
              <i class="bi bi-activity me-2"></i>Analisis Kondisi Saya
            </button>
          </form>
        </div>
      </div>

      <!-- Result Card (hidden by default) -->
      <div id="resultCard" class="card border-0 shadow-sm mb-4 d-none">
        <div class="card-body p-4">

          <!-- Condition Badge -->
          <div class="text-center mb-4">
            <div id="resultEmoji" style="font-size: 3.5rem; line-height: 1;" class="mb-2"></div>
            <span id="resultBadge" class="badge rounded-pill px-4 py-2 fs-6 fw-semibold"></span>
          </div>

          <!-- Description -->
          <p id="resultDescription" class="text-center text-muted mb-4"></p>

          <!-- Reference Table -->
          <div id="referenceTable" class="table-responsive mb-4 d-none">
            <table class="table table-sm table-bordered text-center small">
              <thead class="table-light">
                <tr>
                  <th>Parameter</th>
                  <th>Nilai Kamu</th>
                  <th>Normal</th>
                  <th>Pre-Diabetes</th>
                  <th>Diabetes</th>
                </tr>
              </thead>
              <tbody id="referenceTableBody"></tbody>
            </table>
          </div>

          <!-- Recommendations -->
          <div class="mb-4">
            <h6 class="fw-bold mb-3"><i class="bi bi-lightbulb-fill text-warning me-2"></i>Rekomendasi untuk Kamu</h6>
            <ul id="resultRecommendations" class="list-group list-group-flush"></ul>
          </div>

          <!-- CTA to DiabetesDish -->
          <a href="#/diabetesdish" class="btn btn-outline-primary btn-lg w-100 mb-3">
            <i class="bi bi-bowl-hot me-2"></i>Lihat Rekomendasi Makanan →
          </a>

          <!-- Reset -->
          <button type="button" id="resetProfileBtn" class="btn btn-outline-danger w-100">
            <i class="bi bi-trash3 me-2"></i>Reset Data
          </button>
        </div>
      </div>

      <!-- Disclaimer -->
      <p class="text-center text-muted small">
        ⚕️ Hasil ini bukan diagnosis medis. Selalu konsultasikan dengan dokter Anda.
      </p>

    </div>
    `;
  },

  async afterRender() {
    // Inisialisasi Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((el) => {
      new Tooltip(el);
    });

    const form = document.getElementById('profileForm');
    const resetBtn = document.getElementById('resetProfileBtn');

    // Auto-populate dari localStorage jika ada
    const savedProfile = loadHealthProfile();
    if (savedProfile) {
      this._populateForm(savedProfile);
      this._showResult(savedProfile);
    }

    // Submit handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleSubmit();
    });

    // Reset handler
    resetBtn.addEventListener('click', () => {
      this._handleReset();
    });
  },

  // ---------------------------------------------------------------------------
  // Private methods
  // ---------------------------------------------------------------------------

  _getFormValues() {
    const parse = (id) => {
      const val = document.getElementById(id).value.trim();
      if (val === '') return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    };

    return {
      fastingGlucose: parse('fastingGlucose'),
      postMealGlucose: parse('postMealGlucose'),
      hba1c: parse('hba1c'),
    };
  },

  _validate({ fastingGlucose, postMealGlucose, hba1c }) {
    if (fastingGlucose === null && postMealGlucose === null && hba1c === null) {
      return 'Isi minimal satu parameter untuk melakukan analisis.';
    }
    if (fastingGlucose !== null && (fastingGlucose < 50 || fastingGlucose > 500)) {
      return 'Gula darah puasa harus antara 50–500 mg/dL.';
    }
    if (postMealGlucose !== null && (postMealGlucose < 50 || postMealGlucose > 600)) {
      return 'Gula darah post-meal harus antara 50–600 mg/dL.';
    }
    if (hba1c !== null && (hba1c < 3 || hba1c > 15)) {
      return 'HbA1c harus antara 3–15%.';
    }
    return null;
  },

  _handleSubmit() {
    const validationEl = document.getElementById('profileValidation');
    const values = this._getFormValues();
    const error = this._validate(values);

    if (error) {
      validationEl.textContent = error;
      validationEl.classList.remove('d-none');
      return;
    }
    validationEl.classList.add('d-none');

    const result = classifyDiabetes(values);
    const profileData = { ...values, classificationResult: result };

    saveHealthProfile(profileData);
    this._showResult(profileData);
    this._updateNavBadge();

    // Scroll ke result card
    document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  _handleReset() {
    clearHealthProfile();

    // Reset form
    document.getElementById('profileForm').reset();

    // Hide result
    document.getElementById('resultCard').classList.add('d-none');

    // Hide nav badge
    this._updateNavBadge();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  _populateForm(profile) {
    if (profile.fastingGlucose != null) {
      document.getElementById('fastingGlucose').value = profile.fastingGlucose;
    }
    if (profile.postMealGlucose != null) {
      document.getElementById('postMealGlucose').value = profile.postMealGlucose;
    }
    if (profile.hba1c != null) {
      document.getElementById('hba1c').value = profile.hba1c;
    }
  },

  _showResult(profile) {
    const result = profile.classificationResult ?? classifyDiabetes({
      fastingGlucose: profile.fastingGlucose,
      postMealGlucose: profile.postMealGlucose,
      hba1c: profile.hba1c,
    });

    const resultCard = document.getElementById('resultCard');
    const emojiEl = document.getElementById('resultEmoji');
    const badgeEl = document.getElementById('resultBadge');
    const descEl = document.getElementById('resultDescription');
    const recList = document.getElementById('resultRecommendations');

    emojiEl.textContent = result.emoji;
    badgeEl.textContent = result.label;
    badgeEl.style.backgroundColor = result.color;
    badgeEl.style.color = '#fff';
    descEl.textContent = result.description;

    // Recommendations list
    recList.innerHTML = result.recommendations
      .map((rec) => `<li class="list-group-item border-0 ps-0"><i class="bi bi-check2-circle text-success me-2"></i>${rec}</li>`)
      .join('');

    // Reference table
    this._buildReferenceTable(profile, result);

    resultCard.classList.remove('d-none');
  },

  _buildReferenceTable(profile, result) {
    const tableWrap = document.getElementById('referenceTable');
    const tbody = document.getElementById('referenceTableBody');
    const rows = [];

    const statusIcon = (val, normalMax, preDiabMin, preDiabMax, diabMin) => {
      if (val === null) return '—';
      if (val >= diabMin) return `<span class="text-danger fw-bold">${val} 🔴</span>`;
      if (val >= preDiabMin) return `<span class="text-warning fw-bold">${val} ⚠️</span>`;
      return `<span class="text-success fw-bold">${val} ✅</span>`;
    };

    if (profile.fastingGlucose != null) {
      rows.push(`
        <tr>
          <td>Puasa (mg/dL)</td>
          <td>${statusIcon(profile.fastingGlucose, 100, 100, 126, 126)}</td>
          <td>&lt; 100</td><td>100–125</td><td>≥ 126</td>
        </tr>`);
    }
    if (profile.postMealGlucose != null) {
      rows.push(`
        <tr>
          <td>Post-Meal (mg/dL)</td>
          <td>${statusIcon(profile.postMealGlucose, 140, 140, 200, 200)}</td>
          <td>&lt; 140</td><td>140–199</td><td>≥ 200</td>
        </tr>`);
    }
    if (profile.hba1c != null) {
      rows.push(`
        <tr>
          <td>HbA1c (%)</td>
          <td>${statusIcon(profile.hba1c, 5.7, 5.7, 6.5, 6.5)}</td>
          <td>&lt; 5.7</td><td>5.7–6.4</td><td>≥ 6.5</td>
        </tr>`);
    }

    if (rows.length > 0) {
      tbody.innerHTML = rows.join('');
      tableWrap.classList.remove('d-none');
    } else {
      tableWrap.classList.add('d-none');
    }
  },

  /** Update dot indicator badge on navbar link if it exists */
  _updateNavBadge() {
    const profile = loadHealthProfile();
    const dot = document.getElementById('profileNavDot');
    if (!dot) return;
    dot.style.display = profile ? 'inline-block' : 'none';
  },
};

export default ProfilePage;
