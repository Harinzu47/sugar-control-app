import CONFIG from "./config";

const API_ENDPOINT = {
  LOWSUGAR: `${CONFIG.BASE_URL}recipes/findByNutrients?apiKey=${CONFIG.KEY}&maxCarbs=10&maxSugar=10`,
  NORMALSUGAR: `${CONFIG.BASE_URL}recipes/findByNutrients?apiKey=${CONFIG.KEY}&maxCarbs=50&minSugar=10&maxSugar=50`,
  HIGHSUGAR: `${CONFIG.BASE_URL}recipes/findByNutrients?apiKey=${CONFIG.KEY}&maxCarbs=100&minSugar=50&maxSugar=100`,
  DETAIL: (id) => `${CONFIG.BASE_URL}recipes/${id}/information/?apiKey=${CONFIG.KEY}`,
  BLOGS: `${CONFIG.BASE_URL2}search?q=diabetes&lang=en&apikey=${CONFIG.KEY2}`,

  /**
   * Endpoint pencarian resep berdasarkan parameter diet (untuk profil kesehatan).
   * @param {Object} params - Hasil dari getDietParameters()
   * @param {number} [number=9] - Jumlah hasil
   */
  COMPLEX_SEARCH: (params, number = 9) => {
    const base = `${CONFIG.BASE_URL}recipes/complexSearch?apiKey=${CONFIG.KEY}`;
    const qs = new URLSearchParams({
      number,
      ...(params.diet && { diet: params.diet }),
      ...(params.maxCalories && { maxCalories: params.maxCalories }),
      ...(params.minProtein && { minProtein: params.minProtein }),
      ...(params.maxCarbs && { maxCarbs: params.maxCarbs }),
      ...(params.tags && { tags: params.tags }),
      ...(params.excludeIngredients && { excludeIngredients: params.excludeIngredients }),
      addRecipeNutrition: true,
      fillIngredients: false,
    });
    return `${base}&${qs.toString()}`;
  },
};

export default API_ENDPOINT;