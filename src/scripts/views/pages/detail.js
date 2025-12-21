import foodsResource from '../../data/api-source';
import UrlParser from '../../routes/url-parser';
import foodDetail from '../templates/food-detail';

const Detail = {
  async render() {
    return `
      <h2 class="detail-h2">Detail Food</h2>
      <div id="detail-food">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Memuat detail makanan...</p>
        </div>
      </div>
        `;
  },

  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const foodContainer = document.getElementById('detail-food');
    
    const katalog = await foodsResource.getFoodDetail(url.id);
    
    // Check for API errors
    if (katalog.error) {
      foodContainer.innerHTML = `
        <div class="alert alert-danger text-center m-3" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
          ${katalog.message}
        </div>
      `;
      return;
    }
    
    foodContainer.innerHTML = foodDetail(katalog);
  },
};

export default Detail;
