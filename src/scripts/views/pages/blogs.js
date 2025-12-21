import blogsResource from "../../data/blog-source";
import blogItem from "../templates/blog-item"


const newsBlogs = {
    async render() {
        return `
            <div class="blog">
                <h1>Blogs</h1>
                <div id="content" class="all-wrapper"></div>
            </div>
        `;
    },

    async afterRender() {
        const blogsContent = document.querySelector('#content');
        
        // Show loading state
        blogsContent.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading-text">Memuat artikel...</p>
            </div>
        `;

        const blogs = await blogsResource.getBlogsList();

        // Check for API errors
        if (blogs.error) {
            blogsContent.innerHTML = `
                <div class="alert alert-danger text-center m-3" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
                    ${blogs.message}
                </div>
            `;
            return;
        }

        if (blogs && blogs.articles && Array.isArray(blogs.articles) && blogs.articles.length > 0) {
            blogsContent.innerHTML = '';
            blogs.articles.forEach((blog) => {
                blogsContent.innerHTML += blogItem(blog);
            });
        } else {
            blogsContent.innerHTML = `
                <div class="alert alert-warning text-center m-3" role="alert">
                    <i class="bi bi-info-circle-fill me-2" aria-hidden="true"></i>
                    Tidak ada artikel yang ditemukan saat ini. Silakan coba lagi nanti.
                </div>
            `;
        }
    },
};

export default newsBlogs;