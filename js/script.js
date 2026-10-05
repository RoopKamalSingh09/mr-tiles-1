document.addEventListener('DOMContentLoaded', () => {

    // 1. Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Add 'loaded' class to body for initial hero animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // 3. Navbar scroll effect
    const navbar = document.getElementById('mainNav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // 4. Scroll Reveal with IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Reveal only once
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 5. Interactive Material Wall Parallax (Desktop Only)
    const wallContainer = document.getElementById('materialWall');
    const panels = document.querySelectorAll('.material-panel');

    // Check if it's a touch device / small screen
    const isTouchDevice = window.matchMedia("(max-width: 991px)").matches;

    if (!isTouchDevice && wallContainer) {
        wallContainer.addEventListener('mousemove', (e) => {
            const containerRect = wallContainer.getBoundingClientRect();
            
            // Calculate mouse position relative to center of container (-1 to 1)
            const mouseX = ((e.clientX - containerRect.left) / containerRect.width) * 2 - 1;
            const mouseY = ((e.clientY - containerRect.top) / containerRect.height) * 2 - 1;

            panels.forEach(panel => {
                const speed = panel.getAttribute('data-speed') || 1;
                const xOffset = mouseX * speed * 15; // Max movement in px
                const yOffset = mouseY * speed * 15;

                // Apply transform without overriding the CSS class transforms (left/top)
                // We target the visual child for the movement to keep the panel's absolute positioning intact
                const visual = panel.querySelector('.panel-visual');
                if(visual) {
                     visual.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
                }
            });
        });

        // Reset on mouse leave
        wallContainer.addEventListener('mouseleave', () => {
            panels.forEach(panel => {
                const visual = panel.querySelector('.panel-visual');
                if(visual) {
                     visual.style.transform = `translate(0px, 0px)`;
                }
            });
        });
    }

    // 6. Smooth scroll for anchor links (fallback for CSS scroll-behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }

                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
