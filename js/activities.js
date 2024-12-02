class ActivitySlider {
    constructor() {
        this.currentIndex = 0;
        this.track = document.querySelector('.activities-track');
        this.cards = Array.from(this.track.children);
        this.prevBtn = document.querySelector('.nav-btn.prev');
        this.nextBtn = document.querySelector('.nav-btn.next');
        this.progressBar = document.querySelector('.progress-bar');
        this.cardsPerView = this.getCardsPerView();
        this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
        
        this.init();
    }

    init() {
        if (!this.track || !this.prevBtn || !this.nextBtn) return;
        
        // Set initial state
        this.updateButtons();
        this.addEventListeners();
        this.updateProgress();
    }

    getCardsPerView() {
        if (window.innerWidth > 1200) return 3;
        if (window.innerWidth > 768) return 2;
        return 1;
    }

    slide(direction) {
        const cardWidth = 100 / this.cardsPerView;
        
        if (direction === 'next' && this.currentIndex < this.totalSlides - 1) {
            this.currentIndex++;
        } else if (direction === 'prev' && this.currentIndex > 0) {
            this.currentIndex--;
        }

        const translateX = -(this.currentIndex * cardWidth);
        this.track.style.transform = `translateX(${translateX}%)`;
        
        this.updateButtons();
        this.updateProgress();
    }

    updateButtons() {
        // Update prev button
        this.prevBtn.disabled = this.currentIndex === 0;
        this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        this.prevBtn.style.pointerEvents = this.currentIndex === 0 ? 'none' : 'auto';

        // Update next button
        const isLastSlide = this.currentIndex === this.totalSlides - 1;
        this.nextBtn.disabled = isLastSlide;
        this.nextBtn.style.opacity = isLastSlide ? '0.5' : '1';
        this.nextBtn.style.pointerEvents = isLastSlide ? 'none' : 'auto';
    }

    updateProgress() {
        if (!this.progressBar) return;
        const progress = ((this.currentIndex + 1) / this.totalSlides) * 100;
        this.progressBar.style.setProperty('--progress', `${progress}%`);
    }

    addEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.slide('prev'));
        this.nextBtn.addEventListener('click', () => this.slide('next'));

        // Window resize
        window.addEventListener('resize', () => {
            const newCardsPerView = this.getCardsPerView();
            if (newCardsPerView !== this.cardsPerView) {
                this.cardsPerView = newCardsPerView;
                this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
                this.currentIndex = Math.min(this.currentIndex, this.totalSlides - 1);
                this.slide('current');
            }
        });

        // Touch events
        let startX;
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.track.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.slide('next');
                } else {
                    this.slide('prev');
                }
            }
        });
    }
}

// Initialize the slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ActivitySlider();
});
