(() => {
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
        const viewport = carousel.querySelector('.portfolio-carousel-viewport');
        const track = carousel.querySelector('.portfolio-carousel-track');
        const cards = [...track.querySelectorAll('.portfolio-card')];
        const previousButton = carousel.querySelector('[data-carousel-prev]');
        const nextButton = carousel.querySelector('[data-carousel-next]');
        const counter = carousel.querySelector('.portfolio-carousel-count');
        let currentIndex = 0;
        let scrollFrame = 0;

        function visibleCount() {
            return Number.parseInt(getComputedStyle(track).getPropertyValue('--carousel-visible'), 10);
        }

        function maxIndex() {
            return Math.max(0, cards.length - visibleCount());
        }

        function updateControls() {
            const visible = visibleCount();
            const lastIndex = maxIndex();
            currentIndex = Math.min(currentIndex, lastIndex);
            previousButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === lastIndex;
            counter.textContent = `${String(currentIndex + 1).padStart(2, '0')}–${String(Math.min(currentIndex + visible, cards.length)).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
            carousel.hidden = lastIndex === 0;
        }

        function slideTo(index) {
            currentIndex = Math.max(0, Math.min(index, maxIndex()));
            const firstCard = cards[0];
            const step = firstCard.getBoundingClientRect().width + Number.parseFloat(getComputedStyle(track).columnGap);
            viewport.scrollTo({ left: currentIndex * step, behavior: 'smooth' });
            updateControls();
        }

        previousButton.addEventListener('click', () => slideTo(currentIndex - 1));
        nextButton.addEventListener('click', () => slideTo(currentIndex + 1));
        viewport.addEventListener('scroll', () => {
            cancelAnimationFrame(scrollFrame);
            scrollFrame = requestAnimationFrame(() => {
                const firstCard = cards[0];
                const step = firstCard.getBoundingClientRect().width + Number.parseFloat(getComputedStyle(track).columnGap);
                currentIndex = Math.min(maxIndex(), Math.round(viewport.scrollLeft / step));
                updateControls();
            });
        });
        viewport.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                slideTo(currentIndex - 1);
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                slideTo(currentIndex + 1);
            }
        });
        window.addEventListener('resize', () => slideTo(currentIndex));
        updateControls();
    });
})();
