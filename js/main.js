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
    const slideTrack = document.querySelector('.slide-track');
    const images = [
        '../images/home_slides/asset1.png',
        '../images/home_slides/asset2.png',
        '../images/home_slides/asset3.jpg',
        '../images/home_slides/asset4.png',
        '../images/home_slides/asset5.jpg'
    ];

    // Clear any existing content
    slideTrack.innerHTML = '';

    // Create slides
    images.forEach((imagePath, index) => {
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'Hotel Image';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        slide.appendChild(img);
        slideTrack.appendChild(slide);
    });

    let currentSlide = 0;
    const slides = slideTrack.querySelectorAll('.slide');
    const totalSlides = slides.length;

    // Function to show next slide
    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add('active');
    }

    // Start the slideshow
    setInterval(showNextSlide, 3000); // Change slide every 3 seconds
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
            'images/home_slides/asset1.png',
            'images/home_slides/asset2.png',
            'images/home_slides/asset3.jpg',
            'images/home_slides/asset4.png'
        ];
        this.currentIndex = 0;
        this.isAnimating = false;
        this.slideTrack = document.querySelector('.slide-track');
        this.indicatorsContainer = document.querySelector('.slide-indicators');
        this.autoplayInterval = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
        
        this.init();
    }

    init() {
        this.createSlides();
        this.createIndicators();
        this.setupEventListeners();
        this.startAutoplay();
    }

    smoothSlide(from, to, duration = 600) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const startTime = performance.now();
        const slideTrack = this.slideTrack;

        // Modern easing function for smooth motion
        const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            let progress = Math.min(elapsed / duration, 1);

            // Apply easing
            const easedProgress = easeOutExpo(progress);
            
            // Calculate current position
            const currentPosition = from + (to - from) * easedProgress;
            
            // Apply transform with hardware acceleration
            slideTrack.style.transform = `translate3d(${currentPosition}%, 0, 0)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                this.handleSlideComplete();
            }
        };

        requestAnimationFrame(animate);
    }

    handleSlideComplete() {
        // Handle infinite scroll wrap-around
        if (this.currentIndex >= this.images.length) {
            this.currentIndex = 0;
            this.slideTrack.style.transform = `translate3d(0%, 0, 0)`;
        } else if (this.currentIndex < 0) {
            this.currentIndex = this.images.length - 1;
            const finalPosition = -(this.currentIndex * 100);
            this.slideTrack.style.transform = `translate3d(${finalPosition}%, 0, 0)`;
        }
        
        this.updateIndicators();
    }

    nextSlide() {
        if (this.isAnimating) return;
        
        const fromPosition = -(this.currentIndex * 100);
        this.currentIndex++;
        const toPosition = -(this.currentIndex * 100);
        
        this.smoothSlide(fromPosition, toPosition);
    }

    prevSlide() {
        if (this.isAnimating) return;
        
        const fromPosition = -(this.currentIndex * 100);
        this.currentIndex--;
        const toPosition = -(this.currentIndex * 100);
        
        this.smoothSlide(fromPosition, toPosition);
    }

    setupEventListeners() {
        // Touch handling with improved sensitivity
        this.slideTrack.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.stopAutoplay();
            
            // Prepare for potential drag
            this.slideTrack.style.transition = 'none';
        }, { passive: true });

        this.slideTrack.addEventListener('touchmove', (e) => {
            if (this.isAnimating) return;

            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            
            // Calculate deltas
            const deltaX = this.touchStartX - touchX;
            const deltaY = this.touchStartY - touchY;

            // Check if scrolling is more horizontal than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault();
                
                const currentOffset = -(this.currentIndex * 100);
                const moveOffset = (deltaX / window.innerWidth) * 100;
                const newPosition = currentOffset - moveOffset;
                
                this.slideTrack.style.transform = `translate3d(${newPosition}%, 0, 0)`;
            }
        });

        this.slideTrack.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const deltaX = this.touchStartX - touchEndX;
            const threshold = window.innerWidth * 0.2; // 20% of screen width

            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            } else {
                // Snap back to current slide
                const currentPosition = -(this.currentIndex * 100);
                this.smoothSlide(currentPosition, currentPosition);
            }

            this.startAutoplay();
        });

        // Navigation buttons
        document.querySelector('.prev').addEventListener('click', () => {
            this.stopAutoplay();
            this.prevSlide();
            this.startAutoplay();
        });

        document.querySelector('.next').addEventListener('click', () => {
            this.stopAutoplay();
            this.nextSlide();
            this.startAutoplay();
        });
    }

    startAutoplay() {
        if (this.autoplayInterval) clearInterval(this.autoplayInterval);
        this.autoplayInterval = setInterval(() => this.nextSlide(), 3000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    updateIndicators() {
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
}

function initializeActivitiesScroll() {
    const container = document.querySelector('.overflow-x-auto');
    const scrollLeftBtn = document.querySelector('[aria-label="Scroll left"]');
    const scrollRightBtn = document.querySelector('[aria-label="Scroll right"]');
    
    if (!container || !scrollLeftBtn || !scrollRightBtn) return;

    const scrollAmount = 320; // Width of one card

    scrollLeftBtn.addEventListener('click', () => {
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    scrollRightBtn.addEventListener('click', () => {
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Optional: Hide/show scroll buttons based on scroll position
    container.addEventListener('scroll', () => {
        scrollLeftBtn.classList.toggle('hidden', container.scrollLeft === 0);
        scrollRightBtn.classList.toggle('hidden', 
            container.scrollLeft >= container.scrollWidth - container.clientWidth);
    });
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
        initializeActivitiesScroll();
    });
});