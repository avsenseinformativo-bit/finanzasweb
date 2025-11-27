/**
 * ARTICLE INTERACTIVE LIBRARY
 * Handles all interactive elements for professional articles
 */

// ===== UTILITY: THROTTLE =====
function throttle(func, wait) {
    let timeout;
    let lastRan;
    return function executedFunction(...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                if ((Date.now() - lastRan) >= wait) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, wait - (Date.now() - lastRan));
        }
    };
}

// ===== READING PROGRESS BAR (OPTIMIZED) =====
function initReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;

    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    };

    // Throttle scroll event to 100ms for better performance
    window.addEventListener('scroll', throttle(updateProgress, 100), { passive: true });
}

// ===== SUMMARY TOGGLE =====
function initSummaryToggle() {
    const toggleBtn = document.getElementById('toggleResumen');
    const summaryContent = document.getElementById('summaryContent');

    if (!toggleBtn || !summaryContent) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = summaryContent.classList.toggle('open');
        toggleBtn.textContent = isOpen ? 'Ocultar resumen' : 'Ver resumen rápido';
    });
}

// ===== ANIMATED COUNTERS =====
function animateCounter(element, target, duration = 2000, suffix = '') {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString() + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString() + suffix;
        }
    }, 16);
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseFloat(entry.target.dataset.count);
                const suffix = entry.target.dataset.suffix || '';
                animateCounter(entry.target, target, 2000, suffix);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ===== SMOOTH SCROLL FOR TOC =====
function initSmoothScroll() {
    document.querySelectorAll('.article-toc a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== FADE IN ON SCROLL =====
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

// ===== PROGRESS BARS ANIMATION =====
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill[data-progress]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const progress = entry.target.dataset.progress;
                setTimeout(() => {
                    entry.target.style.width = progress + '%';
                }, 100);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => observer.observe(bar));
}

// ===== CHART.JS HELPER FUNCTIONS =====
function createLineChart(canvasId, labels, datasets, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: { ...defaultOptions, ...options }
    });
}

function createBarChart(canvasId, labels, datasets, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: { ...defaultOptions, ...options }
    });
}

function createDoughnutChart(canvasId, labels, data, backgroundColors, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            }
        }
    };

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: { ...defaultOptions, ...options }
    });
}

// ===== SENTIMENT METER =====
function createSentimentMeter(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let color, label;
    if (value < 25) {
        color = '#f44336';
        label = 'Miedo Extremo';
    } else if (value < 45) {
        color = '#ff9800';
        label = 'Miedo';
    } else if (value < 55) {
        color = '#ffc107';
        label = 'Neutral';
    } else if (value < 75) {
        color = '#8bc34a';
        label = 'Codicia';
    } else {
        color = '#4caf50';
        label = 'Codicia Extrema';
    }

    element.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; font-weight: 800; color: ${color}; margin-bottom: 10px;">
                ${value}
            </div>
            <div style="font-size: 18px; font-weight: 600; color: #666; margin-bottom: 15px;">
                ${label}
            </div>
            <div style="width: 100%; height: 12px; background: #e0e0e0; border-radius: 999px; overflow: hidden;">
                <div style="width: ${value}%; height: 100%; background: ${color}; border-radius: 999px; transition: width 1s ease;"></div>
            </div>
        </div>
    `;
}

// ===== INITIALIZE ALL =====
function initArticleInteractive() {
    // Core features
    initReadingProgress();
    initSummaryToggle();
    initSmoothScroll();

    // Animations
    initCounters();
    initScrollAnimations();
    initProgressBars();

    console.log('✅ Article interactive features initialized');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArticleInteractive);
} else {
    initArticleInteractive();
}
