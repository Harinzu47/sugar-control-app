
const foodItem = (food) => {
  // Determine badge color and text based on matchLevel
  let badgeClass = 'bg-secondary';
  let badgeIcon = 'bi-question-circle';
  
  if (food.matchLevel === 'high') {
    badgeClass = 'bg-success';
    badgeIcon = 'bi-stars';
  } else if (food.matchLevel === 'medium') {
    badgeClass = 'bg-warning text-dark';
    badgeIcon = 'bi-check-circle';
  } else if (food.matchLevel === 'low') {
    badgeClass = 'bg-danger';
    badgeIcon = 'bi-exclamation-circle';
  }

  // Fallback if matchPercentage is missing (e.g. initial load or error)
  const matchPercent = food.matchPercentage !== undefined ? `${food.matchPercentage}% Match` : '';

  return `
    <div class="col">
      <div class="card h-100 shadow-sm food-card-hover">
        <div class="position-relative">
          <img class="card-img-top lazyload" alt="${food.title || 'Recipe image'}" data-src="${food.image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect fill='%23E8F8F5'/%3E%3C/svg%3E" style="height: 200px; object-fit: cover;">
          
          ${matchPercent ? `
          <div class="position-absolute top-0 end-0 m-2">
            <span class="badge ${badgeClass} rounded-pill p-2 shadow-sm d-flex align-items-center gap-1">
              <i class="bi ${badgeIcon}"></i> ${matchPercent}
            </span>
          </div>
          ` : ''}
        </div>
        
        <div class="card-body">
          <a href="#/food/${food.id}" class="text-decoration-none text-dark">
            <h5 class="card-title fw-bold mb-3 text-truncate" title="${food.title}">${food.title}</h5>
          </a>
          
          <div class="food-nutrition small">
            <div class="d-flex justify-content-between mb-2 pb-2 border-bottom">
               <span class="text-muted"><i class="bi bi-fire text-danger"></i> Calories</span>
               <span class="fw-bold">${food.calories}</span>
            </div>
            <div class="d-flex justify-content-between mb-1">
               <span class="text-muted"><i class="bi bi-cup-fill text-primary"></i> Sugar</span>
               <span class="fw-bold ${food.sugar > 10 ? 'text-danger' : 'text-success'}">${food.sugar}g</span>
            </div>
            <div class="d-flex justify-content-between mb-1">
               <span class="text-muted"><i class="bi bi-box-fill text-warning"></i> Carbs</span>
               <span class="fw-bold">${food.carbs}g</span>
            </div>
            <div class="d-flex justify-content-between">
               <span class="text-muted"><i class="bi bi-egg-fill text-success"></i> Protein</span>
               <span class="fw-bold">${food.protein}g</span>
            </div>
          </div>
        </div>
        
        <div class="card-footer bg-white border-top-0 pt-0">
          <a href="#/food/${food.id}" class="btn btn-outline-primary w-100 rounded-pill btn-sm">View Details</a>
        </div>
      </div>
    </div>
  `;
};

export default foodItem;
