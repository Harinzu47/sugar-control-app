function formatISODateToCustomFormat(isoDate) {
  const date = new Date(isoDate);

  const formattedDate = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return formattedDate;
}

const blogItem = (blog) => `
  <div class="wrapper">
  <div class="image">
  <img class="img lazyload" data-src="${blog.image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 460 270'%3E%3Crect fill='%23cfe1b9'/%3E%3C/svg%3E" alt="${blog.title || 'Blog article image'}">
  </div>

  <div class="detail_blog">
  <p class="blog__date"> ${formatISODateToCustomFormat(blog.publishedAt)}</p>
  <h5 class="blog__title">${blog.title}</h5>
    <p class="blog__description">${blog.description}</p>
    <a href="${blog.url}" class="btn btn-dark" target="_blank" rel="noopener noreferrer">Read More</a>
  </div>
  </div>
`
export default blogItem;