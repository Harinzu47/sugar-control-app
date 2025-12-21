import API_ENDPOINT from "../global/api-endpoint";

class blogsResource {
    static async getBlogsList() {
        try {
            const response = await fetch(API_ENDPOINT.BLOGS);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching blogs:", error);
            return { error: true, message: "Gagal mengambil data blog. Silakan coba lagi nanti." };
        }
    }
}

export default blogsResource;