// ===== PARTICLE ANIMATION SYSTEM =====
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        this.container.appendChild(this.canvas);
        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createParticles() {
        const particleCount = Math.min(100, Math.floor((this.width * this.height) / 15000));
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                hue: Math.random() * 60 + 280 // Purple to pink range
            });
        }
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(247, 37, 133, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw connections
        this.drawConnections();

        // Update and draw particles
        for (const particle of this.particles) {
            // Mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
                const force = (200 - distance) / 200;
                particle.vx -= (dx / distance) * force * 0.02;
                particle.vy -= (dy / distance) * force * 0.02;
            }

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Add some random movement
            particle.vx += (Math.random() - 0.5) * 0.05;
            particle.vy += (Math.random() - 0.5) * 0.05;

            // Boundary wrapping
            if (particle.x < 0) particle.x = this.width;
            if (particle.x > this.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.height;
            if (particle.y > this.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius
            );
            gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`);
            gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 60%, 0)`);
            this.ctx.fillStyle = gradient;
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!menuBtn || !mobileMenu) {
        return;
    }

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.about-card, .step-content, .vision-card, .diff-column, .collab-feature, .contact-method, .pathway-card, .info-card, .quote-block, .cta-content, .key-point, .visual-panel'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Add CSS for animated elements
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== PARALLAX EFFECT =====
function initParallax() {
    const heroImage = document.querySelector('.hero-image');
    const visionBg = document.querySelector('.vision-bg-image');
    const applyBg = document.querySelector('.apply-bg-image');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        if (heroImage) {
            heroImage.style.transform = `translateY(${scrollY * 0.3}px)`;
        }

        if (visionBg) {
            visionBg.style.transform = `translateY(${scrollY * 0.1}px)`;
        }

        if (applyBg) {
            applyBg.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
    });
}

// ===== FORM HANDLING =====
function initFormHandling() {
    const form = document.getElementById('apply-form');

    if (!form) {
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Show success message
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;

        button.innerHTML = `
            <span>Application Submitted!</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
        `;
        button.style.background = 'linear-gradient(135deg, #6BFF6B 0%, #00CC00 100%)';
        button.disabled = true;

        // Show notification
        showNotification('Thank you for your application! We\'ll be in touch soon.', 'success');

        // Reset after 3 seconds
        setTimeout(() => {
            form.reset();
            button.innerHTML = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 3000);
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'linear-gradient(135deg, rgba(107, 255, 107, 0.2) 0%, rgba(0, 204, 0, 0.2) 100%)' : 'rgba(255, 255, 255, 0.1)'};
        border: 1px solid ${type === 'success' ? 'rgba(107, 255, 107, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
        border-radius: 12px;
        backdrop-filter: blur(20px);
        color: white;
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    // Add animation keyframes
    const animStyle = document.createElement('style');
    animStyle.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(animStyle);

    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
    `;
    closeBtn.addEventListener('click', () => removeNotification(notification));
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');

    // Auto remove after 5 seconds
    setTimeout(() => removeNotification(notification), 5000);
}

function removeNotification(notification) {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
}

// ===== TYPING EFFECT FOR HERO =====
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    // Already using standard text, but we can add a cursor effect
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.style.cssText = `
        display: inline-block;
        width: 2px;
        height: 1.2em;
        background: linear-gradient(135deg, #FF6B35 0%, #F72585 100%);
        margin-left: 4px;
        animation: blink 1s infinite;
        vertical-align: text-bottom;
    `;

    const blinkStyle = document.createElement('style');
    blinkStyle.textContent = `
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    document.head.appendChild(blinkStyle);
}

// ===== GLOWING HOVER EFFECT FOR CARDS =====
function initCardGlow() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Add glow effect CSS
    const glowStyle = document.createElement('style');
    glowStyle.textContent = `
        .glass-card {
            position: relative;
            overflow: hidden;
        }
        .glass-card::before {
            content: '';
            position: absolute;
            top: var(--mouse-y, 50%);
            left: var(--mouse-x, 50%);
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(247, 37, 133, 0.15) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .glass-card:hover::before {
            opacity: 1;
        }
    `;
    document.head.appendChild(glowStyle);
}

// ===== COUNTER ANIMATION =====
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        element.textContent = Math.floor(easeProgress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ===== MAGNETIC BUTTON EFFECT =====
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .nav-cta');

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const particlesContainer = document.getElementById('particles-container');
    if (particlesContainer) {
        new ParticleSystem(particlesContainer);
    }

    // Initialize all features
    initSmoothScroll();
    initNavbarScroll();
    initMobileMenu();
    initScrollAnimations();
    initParallax();
    initFormHandling();
    initTypingEffect();
    initCardGlow();
    initMagneticButtons();

    console.log('✦ The B⌬X website initialized successfully ✦');
});

// ===== PRELOADER (Optional) =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
