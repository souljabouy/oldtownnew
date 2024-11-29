// Slideshow functionality
const images = [
    '../images/home_slides/asset1.png',
    '../images/home_slides/asset2.png',
    '../images/home_slides/asset3.jpg',
    '../images/home_slides/asset4.png',
    '../images/home_slides/asset5.jpg'
];

let currentImageIndex = 0;

function initializeSlideshow() {
    const slideshow = document.querySelector('.slideshow');
    if (slideshow) {
        function changeBackground() {
            slideshow.style.backgroundImage = `url(${images[currentImageIndex]})`;
            slideshow.style.backgroundSize = 'cover'; // Fill the whole container
            slideshow.style.backgroundRepeat = 'no-repeat'; // Prevent image repetition
            slideshow.style.backgroundPosition = 'center'; // Center the image
            currentImageIndex = (currentImageIndex + 1) % images.length;
        }
        changeBackground();
        setInterval(changeBackground, 5000);
    }
}

// Load all sections
async function loadSections() {
    const sections = ['home', 'about', 'activities', 'reviews', 'contact'];
    const contentDiv = document.getElementById('content');
    
    for (const section of sections) {
        const response = await fetch(`sections/${section}.html`);
        const html = await response.text();
        contentDiv.innerHTML += html;
    }

    // Initialize slideshow after home section is loaded
    initializeSlideshow();
    // Initialize observers after content is loaded
    initializeObservers();
}

// Intersection Observer for section highlighting
function initializeObservers() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Calculate navbar height for offset
    const navHeight = document.querySelector('.navbar').offsetHeight;

    const options = {
        root: null,
        rootMargin: `-${navHeight}px 0px 0px 0px`, // Adjust for navbar height
        threshold: [0.2, 0.8] // Multiple thresholds for better accuracy
    };

    let currentSection = '';

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Get the section id
            const id = entry.target.getAttribute('id');
            
            // Calculate how much of the section is visible
            const visibleRatio = entry.intersectionRatio;
            
            // If section is more than 20% visible
            if (entry.isIntersecting && visibleRatio > 0.2) {
                currentSection = id;
                
                // Update navigation highlighting
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, options);

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Update active state on scroll
    window.addEventListener('scroll', () => {
        // Find the section that's most in view
        let maxVisibleSection = '';
        let maxVisibleAmount = 0;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - 
                                Math.max(rect.top, 0);
            
            if (visibleHeight > maxVisibleAmount) {
                maxVisibleAmount = visibleHeight;
                maxVisibleSection = section.id;
            }
        });

        // Update navigation if we have a new most-visible section
        if (maxVisibleSection && maxVisibleSection !== currentSection) {
            currentSection = maxVisibleSection;
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${maxVisibleSection}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });

    // Update active state on click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Smooth scroll to section
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const targetPosition = targetSection.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Contact form handling
function handleContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
            alert('Message sent successfully!');
            form.reset();
        });
    }
}

// Gallery functionality
class Gallery {
    constructor() {
        this.images = [
            'images/gallery1.jpg',
            'images/gallery2.jpg',
            'images/gallery3.jpg',
            'images/gallery4.jpg',
            'images/gallery5.jpg',
            'images/gallery6.jpg',
            'images/gallery7.jpg',
            'images/gallery8.jpg'
        ];
        this.currentIndex = 0;
        this.modal = document.querySelector('.gallery-modal');
        this.mainImage = document.querySelector('.gallery-image');
        this.counter = document.querySelector('.image-counter');
        this.thumbnailsContainer = document.querySelector('.gallery-thumbnails');
        
        this.initializeGallery();
    }

    initializeGallery() {
        // Add gallery icon click handler
        document.querySelector('.gallery-icon').addEventListener('click', () => this.openGallery());
        
        // Add close button handler
        document.querySelector('.close-gallery').addEventListener('click', () => this.closeGallery());
        
        // Add navigation handlers
        document.querySelector('.prev-img').addEventListener('click', () => this.prevImage());
        document.querySelector('.next-img').addEventListener('click', () => this.nextImage());
        
        // Create thumbnails
        this.createThumbnails();
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('active')) {
                if (e.key === 'Escape') this.closeGallery();
                if (e.key === 'ArrowLeft') this.prevImage();
                if (e.key === 'ArrowRight') this.nextImage();
            }
        });
    }

    createThumbnails() {
        this.images.forEach((src, index) => {
            const thumb = document.createElement('img');
            thumb.src = src;
            thumb.className = `gallery-thumbnail ${index === 0 ? 'active' : ''}`;
            thumb.addEventListener('click', () => this.showImage(index));
            this.thumbnailsContainer.appendChild(thumb);
        });
    }

    showImage(index) {
        this.currentIndex = index;
        this.mainImage.src = this.images[index];
        this.counter.textContent = `${index + 1} / ${this.images.length}`;
        
        // Update thumbnails
        document.querySelectorAll('.gallery-thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    openGallery() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.showImage(0);
    }

    closeGallery() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    prevImage() {
        const newIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showImage(newIndex);
    }

    nextImage() {
        const newIndex = (this.currentIndex + 1) % this.images.length;
        this.showImage(newIndex);
    }
}

class Slideshow {
    constructor() {
        this.images = [
            'images/hotel1.jpg',
            'images/hotel2.jpg',
            'images/hotel3.jpg',
            'images/hotel4.jpg',
            'images/hotel5.jpg'
        ];
        this.currentIndex = 0;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.slideTrack = document.querySelector('.slide-track');
        this.indicatorsContainer = document.querySelector('.slide-indicators');
        
        this.init();
    }

    init() {
        // Create slides
        this.createSlides();
        
        // Create indicators
        this.createIndicators();
        
        // Add event listeners
        this.addEventListeners();
        
        // Start autoplay
        this.startAutoplay();
        
        // Initial position
        this.updateSlidePosition();
    }

    createSlides() {
        // Create a copy of first and last slides for infinite effect
        const allSlides = [
            this.images[this.images.length - 1],
            ...this.images,
            this.images[0]
        ];

        allSlides.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Slide ${index}`;
            img.style.objectFit = 'contain'; // Ensure the full image is seen
            img.style.width = '100%'; // Adjust width to fit container
            img.style.height = '100%'; // Adjust height to fit container
            
            slide.appendChild(img);
            this.slideTrack.appendChild(slide);
        });
    }

    createIndicators() {
        this.images.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicatorsContainer.appendChild(indicator);
        });
    }

    addEventListeners() {
        // Navigation buttons
        document.querySelector('.nav-btn.prev').addEventListener('click', () => this.prevSlide());
        document.querySelector('.nav-btn.next').addEventListener('click', () => this.nextSlide());

        // Touch events
        this.slideTrack.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.stopAutoplay();
        });

        this.slideTrack.addEventListener('touchmove', (e) => {
            if (this.isAnimating) return;
            
            const touchCurrentX = e.touches[0].clientX;
            const diff = this.touchStartX - touchCurrentX;
            const offset = -((this.currentIndex + 1) * 100 + (diff / this.slideTrack.clientWidth) * 100);
            
            this.slideTrack.style.transform = `translateX(${offset}%)`;
        });

        this.slideTrack.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = this.touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) this.nextSlide();
                else this.prevSlide();
            } else {
                this.updateSlidePosition();
            }

            this.startAutoplay();
        });

        // Pause autoplay on hover
        this.slideTrack.addEventListener('mouseenter', () => this.stopAutoplay());
        this.slideTrack.addEventListener('mouseleave', () => this.startAutoplay());
    }

    updateSlidePosition(animate = true) {
        if (animate) {
            this.slideTrack.style.transition = 'transform 0.5s ease-out';
        } else {
            this.slideTrack.style.transition = 'none';
        }

        const offset = -((this.currentIndex + 1) * 100);
        this.slideTrack.style.transform = `translateX(${offset}%)`;

        // Update indicators
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    nextSlide() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.currentIndex++;

        if (this.currentIndex >= this.images.length) {
            this.handleInfiniteScroll('next');
        } else {
            this.updateSlidePosition();
        }
    }

    prevSlide() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.currentIndex--;

        if (this.currentIndex < 0) {
            this.handleInfiniteScroll('prev');
        } else {
            this.updateSlidePosition();
        }
    }

    handleInfiniteScroll(direction) {
        this.updateSlidePosition();

        this.slideTrack.addEventListener('transitionend', () => {
            this.slideTrack.style.transition = 'none';
            
            if (direction === 'next') {
                this.currentIndex = 0;
            } else {
                this.currentIndex = this.images.length - 1;
            }
            
            this.updateSlidePosition(false);
            
            setTimeout(() => {
                this.slideTrack.style.transition = 'transform 0.5s ease-out';
                this.isAnimating = false;
            }, 10);
        }, { once: true });
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        this.currentIndex = index;
        this.updateSlidePosition();
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoplay() {
        clearInterval(this.autoplayInterval);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadSections().then(() => {
        // Initialize smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                const navHeight = document.querySelector('.navbar').offsetHeight;
                
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });

        // Initialize contact form
        handleContactForm();
        new Gallery();
        new Slideshow();
    });
});