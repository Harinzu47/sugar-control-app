import API_ENDPOINT from "../global/api-endpoint";

class foodsResource {
    static async getLowSugarList() {
        try {
            const response = await fetch(API_ENDPOINT.LOWSUGAR);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching low sugar foods:", error);
            return { error: true, message: "Gagal mengambil data makanan rendah gula. Silakan coba lagi nanti." };
        }
    }

    static async getNormalSugarList() {
        try {
            const response = await fetch(API_ENDPOINT.NORMALSUGAR);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching normal sugar foods:", error);
            return { error: true, message: "Gagal mengambil data makanan gula normal. Silakan coba lagi nanti." };
        }
    }

    static async getHighSugarList() {
        try {
            const response = await fetch(API_ENDPOINT.HIGHSUGAR);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching high sugar foods:", error);
            return { error: true, message: "Gagal mengambil data makanan tinggi gula. Silakan coba lagi nanti." };
        }
    }

    static async getFoodDetail(id) {
        try {
            const response = await fetch(API_ENDPOINT.DETAIL(id));
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching food detail:", error);
            return { error: true, message: "Gagal mengambil detail makanan. Silakan coba lagi nanti." };
        }
    }
}

export default foodsResource;