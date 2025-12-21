const Home = {
    async render() {
        return `
        <!-- Hero Section -->
        <section class="hero">
            <img data-src="img/unsplash_kcRFW-Hje8Y.png" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Crect fill='%231A2B4A'/%3E%3C/svg%3E" alt="Healthy food for blood sugar control" class="hero-img lazyload">
            <div class="hero-content">
                <h1>Take Control of Your <span>Blood Sugar</span></h1>
                <p>Discover personalized meal recommendations tailored to your blood glucose levels. Start your journey to better health today.</p>
                <a href="#/diabetesdish" class="hero-cta">
                    Check Your Level <i class="bi bi-arrow-right"></i>
                </a>
                <div class="hero-stats">
                    <div class="hero-stat">
                        <div class="hero-stat-value">500+</div>
                        <div class="hero-stat-label">Healthy Recipes</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-value">100%</div>
                        <div class="hero-stat-label">Free to Use</div>
                    </div>
                    <div class="hero-stat">
                        <div class="hero-stat-value">24/7</div>
                        <div class="hero-stat-label">Available</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Explanation Section -->
        <section class="explain">
            <div class="explain-container">
                <div class="explanation-card">
                    <h2>What is SugarControl?</h2>
                    <p>We provide the latest health guidance with intelligent dietary solutions, offering menu adjustments and smart meal plans to help you effectively manage diabetes according to your specific health needs.</p>
                </div>
                <div class="explanation-card">
                    <h2>Our Smart Solution</h2>
                    <p>Embark on a smart health journey with our Smart Blood Sugar Calculator. Just enter your blood sugar levels, and watch as our interactive tool provides personalized food recommendations tailored to your unique blood sugar condition.</p>
                </div>
            </div>
        </section>

        <!-- Why Section -->
        <section class="why">
            <h2><b>Why Sugar</b>Control</h2>
            <div class="why-cards">
                <div class="why-card">
                    <img data-src="img/unsplash_WhQAZy14xZU.png" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect fill='%23E8F8F5'/%3E%3C/svg%3E" class="lazyload" alt="Personalized nutrition recommendations">
                    <div class="why-card-body">
                        <h5>Smart Eating Plan</h5>
                        <p>Unlock nutritional wisdom with our Interactive Blood Sugar Calculator, monitoring and offering recommendations tailored to your blood sugar levels.</p>
                    </div>
                </div>
                <div class="why-card">
                    <img data-src="img/unsplash_jkDLNDGougw.png" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect fill='%23E8F8F5'/%3E%3C/svg%3E" class="lazyload" alt="Personalized meal plans">
                    <div class="why-card-body">
                        <h5>Custom Meal Planner</h5>
                        <p>Design healthy meal plans based on your blood sugar conditions with our Custom Meal Planner, complete with practical guidance.</p>
                    </div>
                </div>
                <div class="why-card">
                    <img data-src="img/unsplash_J2e34-1CVVs.png" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect fill='%23E8F8F5'/%3E%3C/svg%3E" class="lazyload" alt="Latest nutrition insights">
                    <div class="why-card-body">
                        <h5>Nutrition Insights</h5>
                        <p>Access the latest nutritional information and health tips through our expert articles, a resource ensuring you receive support.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section class="faq">
            <h2>Frequently Asked Questions</h2>
            <div class="accordion accordion-flush" id="accordionFAQ">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-1" aria-expanded="false" aria-controls="faq-1">
                            What sets SugarControl apart from other health sources?
                        </button>
                    </h2>
                    <div id="faq-1" class="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                        <div class="accordion-body">SugarControl not only provides information about diabetes but also offers interactive tools to assist users in managing their dietary patterns based on their blood sugar levels. This provides a more personalized and reliable solution.</div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-2" aria-expanded="false" aria-controls="faq-2">
                            How does the DiabetesDish Matcher work?
                        </button>
                    </h2>
                    <div id="faq-2" class="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                        <div class="accordion-body">Simply go to the DiabetesDish Matcher page, input your blood sugar level in the provided input column, and we will provide personalized recommendations for foods you should consume.</div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-3" aria-expanded="false" aria-controls="faq-3">
                            Does SugarControl offer up-to-date information?
                        </button>
                    </h2>
                    <div id="faq-3" class="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                        <div class="accordion-body">Yes, we always provide up-to-date information about diabetes and nutrition. Through this website, we hope to assist you in staying healthy and maintaining a balanced diet.</div>
                    </div>
                </div>
            </div>
        </section>
      `;
    },

    async afterRender() {
        // Add scroll effect for navbar
        window.addEventListener('scroll', () => {
            const appBar = document.querySelector('.app-bar');
            if (window.scrollY > 50) {
                appBar.classList.add('scrolled');
            } else {
                appBar.classList.remove('scrolled');
            }
        });
    },
};

export default Home;