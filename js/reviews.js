class GoogleReviews {
    constructor() {
        this.placeId = 'ChIJkbhytOT5PzsRaPa_AnDL3bA';
        this.reviewsContainer = document.getElementById('google-reviews');
        this.averageRating = document.getElementById('average-rating');
        this.averageStars = document.getElementById('average-stars');
        this.totalReviews = document.getElementById('total-reviews');
        this.service = null;
    }

    init() {
        // Create a dummy map element for PlacesService
        const mapDiv = document.createElement('div');
        this.service = new google.maps.places.PlacesService(mapDiv);
        this.fetchReviews();
    }

    fetchReviews() {
        fetch('/api/google-reviews')
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    console.log('Place Details:', data.result);
                    if (data.result.reviews) {
                        this.displayReviews(data.result.reviews);
                    }
                    if (data.result.rating) {
                        this.updateRatingSummary(data.result.rating, data.result.user_ratings_total);
                    }
                } else {
                    console.error('Error fetching reviews:', data.error);
                }
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
            });
    }

    displayReviews(reviews) {
        reviews.forEach(review => {
            const reviewCard = this.createReviewCard(review);
            this.reviewsContainer.appendChild(reviewCard);
        });
    }

    createReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'review-card';
        
        card.innerHTML = `
            <div class="review-header">
                <img src="${review.profile_photo_url}" alt="${review.author_name}" class="reviewer-image">
                <div class="reviewer-info">
                    <div class="reviewer-name">${review.author_name}</div>
                    <div class="review-date">${this.formatDate(review.time)}</div>
                </div>
            </div>
            <div class="review-stars">${this.getStars(review.rating)}</div>
            <div class="review-text">${review.text}</div>
        `;
        
        return card;
    }

    updateRatingSummary(rating, total) {
        this.averageRating.textContent = rating.toFixed(1);
        this.averageStars.innerHTML = this.getStars(rating);
        this.totalReviews.textContent = `(${total} reviews)`;
    }

    getStars(rating) {
        const fullStar = '★';
        const halfStar = '½';
        const emptyStar = '☆';
        
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        stars += fullStar.repeat(fullStars);
        if (hasHalfStar) stars += halfStar;
        stars += emptyStar.repeat(5 - Math.ceil(rating));
        
        return stars;
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
    const googleReviews = new GoogleReviews();
    googleReviews.init();
});

async function testGooglePlacesAPI() {
    const placeId = 'ChIJkbhytOT5PzsRaPa_AnDL3bA'; // Your Place ID
    const apiKey = 'AIzaSyA5-hxCYDXx9Lrx1ZIkBW5cBDdc0hi8-Lg'; // Your API Key

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('API Response:', data);

        if (data.error_message) {
            console.error('API Error:', data.error_message);
        } else if (data.result) {
            console.log('Success! Found business:', data.result.name);
        }
    } catch (error) {
        console.error('Error fetching API:', error);
    }
}

testGooglePlacesAPI();