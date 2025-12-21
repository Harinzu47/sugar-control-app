
const foodItem = (food) => `
<div class="col">
  <div class="card h-100">
    <img class="card-img lazyload" alt="${food.title || 'Recipe image'}" data-src="${food.image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%23E8F8F5'/%3E%3C/svg%3E">
    <div class="card-body">
      <a href="#/food/${food.id}" class="link-card"><h5 class="card-title food-title">${food.title}</h5></a>
      <div class="food-nutrition">
        <p class="card-text food-text"><i class="bi bi-fire text-danger"></i> <strong>Calories:</strong> ${food.calories}</p>
        <p class="card-text food-text"><i class="bi bi-box-fill text-warning"></i> <strong>Carbs:</strong> ${food.carbs}</p>
        <p class="card-text food-text"><i class="bi bi-droplet-fill text-info"></i> <strong>Fat:</strong> ${food.fat}</p>
        <p class="card-text food-text"><i class="bi bi-egg-fill text-success"></i> <strong>Protein:</strong> ${food.protein}</p>
        <p class="card-text food-text"><i class="bi bi-cup-fill text-primary"></i> <strong>Sugar:</strong> ${food.sugar}</p>
      </div>
    </div>
  </div>
</div>
`
export default foodItem;