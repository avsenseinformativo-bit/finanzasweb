/**
 * HOMEPAGE INTERACTIVE FEATURES
 * Animaciones y efectos interactivos para Sabersobredinero
 */

// ===== SCROLL REVEAL ANIMATION =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
}

// ===== PARALLAX EFFECT FOR HERO =====
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== ANIMATED COUNTER FOR STATS =====
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.dataset.count);
                animateValue(entry.target, 0, target, 2000);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ===== CARD TILT EFFECT (OPTIMIZADO) =====
function initCardTilt() {
    const cards = document.querySelectorAll('.card, .popular-card');

    cards.forEach(card => {
        let ticking = false;
        let mouseX = 0;
        let mouseY = 0;

        card.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = mouseX - rect.left;
                    const y = mouseY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = (y - centerY) / 30; // Reducido para menos movimiento
                    const rotateY = (centerX - x) / 30;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
                    ticking = false;
                });
                ticking = true;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ===== FLOATING ANIMATION FOR CTA BUTTONS =====
function initFloatingButtons() {
    const buttons = document.querySelectorAll('.cta-button, .hero-btn');

    buttons.forEach(button => {
        let floatDirection = 1;
        setInterval(() => {
            const currentTransform = button.style.transform || '';
            const translateY = floatDirection * 3;
            button.style.transform = currentTransform + ` translateY(${translateY}px)`;
            floatDirection *= -1;
        }, 2000);
    });
}

// ===== TYPING EFFECT FOR HERO TITLE =====
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-content h2');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';

    let index = 0;
    const typeSpeed = 50;

    function type() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(type, typeSpeed);
        }
    }

    // Start typing after a short delay
    setTimeout(type, 500);
}

// ===== CATEGORY BOXES STAGGER ANIMATION =====
function initCategoryAnimation() {
    const categories = document.querySelectorAll('.cat-box');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    categories.forEach(category => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = 'all 0.6s ease';
        observer.observe(category);
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
            header.style.padding = '15px 20px';
        } else {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
            header.style.padding = '25px 20px';
        }

        // Hide header on scroll down, show on scroll up
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// ===== CURSOR TRAIL EFFECT =====
function initCursorTrail() {
    const coords = { x: 0, y: 0 };
    const circles = [];
    const colors = ['#00c853', '#00e676', '#69f0ae', '#b9f6ca'];

    // Create circles
    for (let i = 0; i < 20; i++) {
        const circle = document.createElement('div');
        circle.style.position = 'fixed';
        circle.style.width = '10px';
        circle.style.height = '10px';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = colors[i % colors.length];
        circle.style.pointerEvents = 'none';
        circle.style.zIndex = '9999';
        circle.style.opacity = '0';
        circle.style.transition = 'opacity 0.3s';
        document.body.appendChild(circle);
        circles.push(circle);
    }

    // Update cursor position
    window.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    // Animate circles
    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach((circle, index) => {
            circle.style.left = x - 5 + 'px';
            circle.style.top = y - 5 + 'px';
            circle.style.opacity = (20 - index) / 20;
            circle.style.transform = `scale(${(20 - index) / 20})`;

            const nextCircle = circles[index + 1] || circles[0];
            x += (parseInt(nextCircle.style.left) || coords.x) / 10;
            y += (parseInt(nextCircle.style.top) || coords.y) / 10;
        });

        requestAnimationFrame(animateCircles);
    }

    animateCircles();
}

// ===== NEWSLETTER FORM VALIDATION =====
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const email = input.value;

        if (email && email.includes('@')) {
            // Show success message
            const button = form.querySelector('button');
            const originalText = button.textContent;
            button.textContent = '✓ ¡Suscrito!';
            button.style.background = '#4caf50';

            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                input.value = '';
            }, 3000);
        } else {
            // Show error
            input.style.borderColor = '#e53935';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        }
    });
}

// ===== IMAGE LAZY LOADING WITH FADE IN =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.6s ease';

                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });

                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== INITIALIZE ALL FEATURES =====
function initHomepage() {
    // Core features
    initScrollReveal();
    initSmoothScroll();
    initHeaderScroll();

    // Animations
    initCounters();
    initCategoryAnimation();
    // initLazyLoading(); // DESACTIVADO - causaba que las imágenes desaparecieran

    // Interactive effects
    // initCardTilt(); // DESACTIVADO - puede causar lag en algunos ordenadores
    initNewsletterForm();

    // Optional: Uncomment if you want these effects
    // initParallax(); // Can affect performance on mobile
    // initTypingEffect(); // Might be distracting
    // initCursorTrail(); // Desktop only, can be distracting

    console.log('✨ Homepage interactive features initialized');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomepage);
} else {
    initHomepage();
}
