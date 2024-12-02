class GoogleReviews {
    constructor() {
        // Wait a moment for DOM to be ready
        setTimeout(() => {
            this.initializeElements();
        }, 100);
    }

    initializeElements() {
        this.placeId = 'ChIJkbhytOT5PzsRaPa_AnDL3bA';
        this.reviewsContainer = document.getElementById('google-reviews');
        this.averageRating = document.getElementById('average-rating');
        this.averageStars = document.getElementById('average-stars');
        this.totalReviews = document.getElementById('total-reviews');

        if (!this.reviewsContainer) {
            console.error('Reviews container not found! Looking for element with id "google-reviews"');
            return;
        }

        console.log('Reviews container found:', this.reviewsContainer);
        this.init();
    }

    init() {
        console.log('Initializing Google Reviews...');
        if (!window.google || !window.google.maps) {
            console.error('Google Maps API not loaded');
            return;
        }

        const mapDiv = document.createElement('div');
        document.body.appendChild(mapDiv);
        this.service = new google.maps.places.PlacesService(mapDiv);
        this.fetchReviews();
    }

    fetchReviews() {
        console.log('Fetching reviews...');
        const request = {
            placeId: this.placeId,
            fields: ['name', 'rating', 'reviews', 'user_ratings_total']
        };

        this.service.getDetails(request, (place, status) => {
            console.log('Place API Response:', place);
            console.log('Status:', status);

            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                if (place.reviews) {
                    console.log('Reviews found:', place.reviews.length);
                    this.displayReviews(place.reviews);
                } else {
                    console.log('No reviews found in place data');
                }
                
                if (place.rating) {
                    console.log('Rating found:', place.rating);
                    this.updateRatingSummary(place.rating, place.user_ratings_total);
                }
            } else {
                console.error('Error fetching place details:', status);
                this.displayError();
            }
        });
    }

    displayReviews(reviews) {
        console.log('Displaying reviews...');
        if (!this.reviewsContainer) {
            console.error('Reviews container not found!');
            return;
        }
        
        const reviewsHTML = reviews.map(review => {
            console.log('Processing review:', review);
            return `
                <div class="review-card">
                    <div class="review-header">
                        <img src="${review.profile_photo_url || 'images/default-avatar.png'}" 
                             alt="${review.author_name}" 
                             class="reviewer-image">
                        <div class="reviewer-info">
                            <div class="reviewer-name">${review.author_name}</div>
                            <div class="review-date">${this.formatDate(review.time)}</div>
                        </div>
                    </div>
                    <div class="review-stars">${this.getStars(review.rating)}</div>
                    <div class="review-text">${review.text}</div>
                </div>
            `;
        }).join('');
        
        console.log('Generated HTML:', reviewsHTML);
        this.reviewsContainer.innerHTML = reviewsHTML;
    }

    displayError() {
        if (this.reviewsContainer) {
            this.reviewsContainer.innerHTML = `
                <div class="review-error">
                    <p>Unable to load reviews at this time. Please try again later.</p>
                </div>
            `;
        }
    }

    updateRatingSummary(rating, total) {
        if (this.averageRating) {
            this.averageRating.textContent = rating.toFixed(1);
        }
        
        if (this.averageStars) {
            this.averageStars.innerHTML = this.getStars(rating);
        }
        
        if (this.totalReviews) {
            this.totalReviews.textContent = `(${total} reviews)`;
        }
    }

    getStars(rating) {
        const fullStar = '★';
        const halfStar = '½';
        const emptyStar = '☆';
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        return `
            ${fullStar.repeat(fullStars)}
            ${hasHalfStar ? halfStar : ''}
            ${emptyStar.repeat(5 - Math.ceil(rating))}
        `.trim();
    }

    formatDate(timestamp) {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing reviews...');
    new GoogleReviews();
});
// Also initialize when Google Maps API loads
window.initGoogleReviews = function() {
    console.log('Google Maps API loaded, initializing reviews...');
    if (!window.googleReviewsInstance) {
        window.googleReviewsInstance = new GoogleReviews();
    }
};
