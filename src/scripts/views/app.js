import DrawerInitiator from '../utils/drawer-initiator';
import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';

class App {
    constructor({ button, drawer, content }) {
        this._button = button;
        this._drawer = drawer;
        this._content = content;

        this._initialAppShell();
    }

    _initialAppShell() {
        DrawerInitiator.init({
            button: this._button,
            drawer: this._drawer,
            content: this._content,
        });
    }

    _showLoading() {
        this._content.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading-text">Memuat konten...</p>
            </div>
        `;
    }

    _hideLoading() {
        const loadingContainer = this._content.querySelector('.loading-container');
        if (loadingContainer) {
            loadingContainer.remove();
        }
    }

    async renderPage() {
        this._showLoading();
        
        const url = UrlParser.parseActiveUrlWithCombiner();
        const page = routes[url];
        
        if (!page) {
            this._content.innerHTML = `
                <div class="error-container text-center p-5">
                    <h2>Halaman Tidak Ditemukan</h2>
                    <p>Maaf, halaman yang Anda cari tidak tersedia.</p>
                    <a href="#/home" class="btn btn-primary">Kembali ke Home</a>
                </div>
            `;
            return;
        }
        
        try {
            this._content.innerHTML = await page.render();
            await page.afterRender();
        } catch (error) {
            console.error("Error rendering page:", error);
            this._content.innerHTML = `
                <div class="error-container text-center p-5">
                    <h2>Terjadi Kesalahan</h2>
                    <p>Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.</p>
                    <a href="#/home" class="btn btn-primary">Kembali ke Home</a>
                </div>
            `;
        }
    }
}

export default App;