document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the content to be fully loaded
    setTimeout(() => {
        const scrollContainer = document.querySelector('.activities-track');
        const prevButton = document.querySelector('.scroll-button.prev');
        const nextButton = document.querySelector('.scroll-button.next');

        if (!scrollContainer || !prevButton || !nextButton) {
            console.error('Required elements not found');
            return;
        }

        // Calculate the width to scroll (one card width + gap)
        const cardWidth = scrollContainer.querySelector('.activity-card').offsetWidth;
        const gap = 32; // 2rem gap
        const scrollDistance = cardWidth + gap;

        // Scroll to previous cards
        prevButton.addEventListener('click', () => {
            console.log('Prev button clicked');
            scrollContainer.scrollBy({
                left: -scrollDistance,
                behavior: 'smooth'
            });
        });

        // Scroll to next cards
        nextButton.addEventListener('click', () => {
            console.log('Next button clicked');
            scrollContainer.scrollBy({
                left: scrollDistance,
                behavior: 'smooth'
            });
        });

        // Add touch scrolling for mobile
        let isDown = false;
        let startX;
        let scrollLeft;

        scrollContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            scrollContainer.style.cursor = 'grabbing';
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });

        scrollContainer.addEventListener('mouseleave', () => {
            isDown = false;
            scrollContainer.style.cursor = 'grab';
        });

        scrollContainer.addEventListener('mouseup', () => {
            isDown = false;
            scrollContainer.style.cursor = 'grab';
        });

        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });

        // Update button visibility based on scroll position
        function updateScrollButtons() {
            const isAtStart = scrollContainer.scrollLeft <= 0;
            const isAtEnd = scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth;

            prevButton.style.opacity = isAtStart ? '0.3' : '1';
            nextButton.style.opacity = isAtEnd ? '0.3' : '1';
            
            prevButton.disabled = isAtStart;
            nextButton.disabled = isAtEnd;
        }

        // Add scroll event listener to update button visibility
        scrollContainer.addEventListener('scroll', updateScrollButtons);
        
        // Update buttons on window resize
        window.addEventListener('resize', updateScrollButtons);
        
        // Initial check for button visibility
        updateScrollButtons();

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevButton.click();
            } else if (e.key === 'ArrowRight') {
                nextButton.click();
            }
        });
    }, 100); // Small delay to ensure content is loaded
});
