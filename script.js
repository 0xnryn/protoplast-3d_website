document.addEventListener('DOMContentLoaded', () => {
    // Popup functionality
    const serviceButtons = document.querySelectorAll('.service-btn, .service-btn-card'); // Select buttons from hero and cards
    const overlay = document.getElementById('service-overlay');
    const popupContent = document.querySelector('.popup-content');
    const closeButton = document.querySelector('.close-popup');
    const serviceDetailDivs = document.querySelectorAll('.service-details');
    const pricingDetailDivs = document.querySelectorAll('.pricing-details');

    const showPopup = (serviceId, event) => {
        // Hide all detail divs first
        serviceDetailDivs.forEach(div => div.style.display = 'none');
        pricingDetailDivs.forEach(div => div.style.display = 'none');

        // Check if it's a pricing button by checking if it's inside a pricing card
        const isPricingButton = event.target.closest('.pricing-card') !== null;
        
        if (isPricingButton && serviceId === 'cnc-cutting') {
            // For pricing buttons, show the pricing version of the details
            const targetDiv = document.getElementById(`${serviceId}-details-pricing`);
            if (targetDiv) {
                targetDiv.style.display = 'block';
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        } else if (isPricingButton && serviceId === 'cad-modeling') {
            const targetDiv = document.getElementById(`${serviceId}-details-pricing`);
            if (targetDiv) {
                targetDiv.style.display = 'block';
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        } else if (isPricingButton && serviceId === 'pcb-design') {
            const targetDiv = document.getElementById(`pcb-design-details-pricing`);
            if (targetDiv) {
                targetDiv.style.display = 'block';
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        } else if (isPricingButton && serviceId === '3d-printing') {
            // Check which pricing card was clicked
            const pricingCardTitle = event.target.closest('.pricing-card').querySelector('.pricing-title').textContent;
            if (pricingCardTitle.includes("FDM")) {
                const targetDiv = document.getElementById(`fdm-3d-printing-details`);
                if (targetDiv) {
                    targetDiv.style.display = 'block';
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            } else if (pricingCardTitle.includes("Resin")) {
                const targetDiv = document.getElementById(`resin-3d-printing-details`);
                if (targetDiv) {
                    targetDiv.style.display = 'block';
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            } else {
                // Fallback to general 3D printing details
                const targetDiv = document.getElementById(`${serviceId}-details`);
                if (targetDiv) {
                    targetDiv.style.display = 'block';
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        } else if (isPricingButton && event.target.closest('.pricing-card').querySelector('.pricing-title').textContent.includes("PCB Manufacturing")) {
            const targetDiv = document.getElementById(`pcb-manufacturing-details-pricing`);
            if (targetDiv) {
                targetDiv.style.display = 'block';
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        } else {
            // For regular service buttons, show regular details
            const targetDiv = document.getElementById(`${serviceId}-details`);
            if (targetDiv) {
                targetDiv.style.display = 'block';
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                console.error(`Service details not found for ID: ${serviceId}-details`);
            }
        }
    };

    const hidePopup = () => {
        overlay.classList.remove('active'); // Remove active class to hide
        document.body.style.overflow = ''; // Restore background scroll
        // Optional: small delay to allow animation before hiding content
        setTimeout(() => {
            serviceDetailDivs.forEach(div => div.style.display = 'none');
            pricingDetailDivs.forEach(div => div.style.display = 'none');
        }, 300); // Should match CSS transition duration
    };

    // Add event listeners to all service buttons
    serviceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior if it were an <a> tag
            const serviceId = button.dataset.service;
            if (serviceId) {
                showPopup(serviceId, e);
            }
        });
    });

    // Close button listener
    closeButton.addEventListener('click', hidePopup);

    // Overlay click listener (closes popup if clicked outside content)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) { // Check if the click is directly on the overlay
            hidePopup();
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            hidePopup();
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if it's just "#"
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animation for elements with specific classes
    // These will work with the CSS animations defined in the style
    const initializeSVGAnimations = () => {
        // Find all SVG elements with animation classes and ensure they're correctly setup
        const animatedElements = document.querySelectorAll(
            '.printer-filament, .printer-head, .component-pulse, .led-blink, ' +
            '.trace-animation, .circuit-pulse, .cutter-blade, .cutter-cut, ' +
            '.cad-circle, .cad-dimension, .cad-outline, .cad-top, .cad-right, .cad-diagonal'
        );
        
        // Initialize any special animation properties if needed
        animatedElements.forEach(el => {
            // For elements that need animation restart on scroll into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Restart animation by removing and adding the class
                        const animClass = Array.from(el.classList).find(c => 
                            c.includes('printer-') || c.includes('component-') || 
                            c.includes('led-') || c.includes('trace-') || 
                            c.includes('circuit-') || c.includes('cutter-') || 
                            c.includes('cad-')
                        );
                        
                        if (animClass) {
                            el.classList.remove(animClass);
                            // Force reflow
                            void el.offsetWidth;
                            el.classList.add(animClass);
                        }
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(el);
        });
    };

    // Initialize SVG animations
    initializeSVGAnimations();

    // Animate service cards on scroll
    const animateOnScroll = () => {
        const serviceCards = document.querySelectorAll('.service-card, .pricing-card');
        
        serviceCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (cardPosition < screenPosition) {
                card.classList.add('animate');
            }
        });
    };

    // Intersection Observer for fade-in elements
    const setupFadeInAnimations = () => {
        const fadeElements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add delay based on index for cascade effect
                    const delay = Array.from(fadeElements).indexOf(entry.target) * 150;
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    };

    // Initialize fade-in animations
    setupFadeInAnimations();

    // Initial check for elements in view
    window.addEventListener('load', () => {
        animateOnScroll();
        initializeSVGAnimations();
        setupFadeInAnimations();
    });
    
    // Check when scrolling
    window.addEventListener('scroll', animateOnScroll);
    
    // Handle mobile navigation
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

