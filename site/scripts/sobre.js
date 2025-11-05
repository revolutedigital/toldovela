/* ========================================
   SOBRE - JAVASCRIPT
   Versão: 1.0
   ======================================== */

'use strict';

// ========================================
// 1. ANIMATED COUNTER FOR NUMBERS
// ========================================

const numeroCards = document.querySelectorAll('.numero-card');

const numerosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const valueElement = entry.target.querySelector('.numero-card__value');
            animateCounter(valueElement);
            entry.target.dataset.animated = 'true';
        }
    });
}, {
    threshold: 0.5
});

numeroCards.forEach(card => {
    numerosObserver.observe(card);
});

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
}

// ========================================
// 2. TIMELINE ITEMS SCROLL ANIMATION
// ========================================

const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            timelineObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3
});

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// ========================================
// 3. TEAM MEMBER CARDS ANIMATION
// ========================================

const membroCards = document.querySelectorAll('.membro-card');

const equipObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.2
});

membroCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
    equipObserver.observe(card);
});

// ========================================
// 4. CERTIFICATION CARDS HOVER EFFECT
// ========================================

const certCards = document.querySelectorAll('.cert-card');

certCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        // Track certification view
        const certTitle = this.querySelector('.cert-card__title').textContent;

        if (typeof gtag !== 'undefined') {
            gtag('event', 'certification_view', {
                'event_category': 'About',
                'event_label': certTitle
            });
        }
    });
});

// ========================================
// 5. MVV CARDS ANIMATION
// ========================================

const mvvCards = document.querySelectorAll('.mvv-card');

const mvvObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.2
});

mvvCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease-out ${index * 0.15}s`;
    mvvObserver.observe(card);
});

// ========================================
// 6. NEWSLETTER FORM (FOOTER)
// ========================================

const newsletterForm = document.querySelector('.footer__newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value;

        if (!isValidEmail(email)) {
            showErrorMessage('Por favor, insira um e-mail válido.');
            return;
        }

        const submitButton = newsletterForm.querySelector('button');
        submitButton.disabled = true;

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, origem: 'Sobre' })
            });

            if (response.ok) {
                showSuccessMessage('Obrigado! Você foi inscrito na nossa newsletter.');
                newsletterForm.reset();

                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        'event_category': 'Newsletter',
                        'event_label': 'Sobre'
                    });
                }
            } else {
                throw new Error('Erro ao assinar newsletter');
            }
        } catch (error) {
            console.error('Erro:', error);
            showErrorMessage('Erro ao assinar newsletter. Tente novamente mais tarde.');
        } finally {
            submitButton.disabled = false;
        }
    });
}

// ========================================
// 7. TRACK CTA BUTTON CLICKS
// ========================================

const ctaButtons = document.querySelectorAll('.btn');

ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        const buttonHref = this.getAttribute('href');

        if (typeof gtag !== 'undefined') {
            gtag('event', 'click_cta', {
                'event_category': 'CTA',
                'event_label': buttonText,
                'value': buttonHref
            });
        }
    });
});

// ========================================
// 8. TRACK SECTION VIEWS
// ========================================

const sections = document.querySelectorAll('section[class*="section"]');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.tracked) {
            const sectionClass = entry.target.className.split(' ')[0];

            if (typeof gtag !== 'undefined') {
                gtag('event', 'section_view', {
                    'event_category': 'About Page',
                    'event_label': sectionClass
                });
            }

            entry.target.dataset.tracked = 'true';
        }
    });
}, {
    threshold: 0.5
});

sections.forEach(section => {
    sectionObserver.observe(section);
});

// ========================================
// 9. SMOOTH SCROLL TO SECTIONS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href === '#' || href.length <= 1) return;

        e.preventDefault();

        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 10. HISTORY IMAGE PARALLAX EFFECT
// ========================================

const historiaImage = document.querySelector('.historia__image img');

if (historiaImage && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const imagePosition = historiaImage.getBoundingClientRect().top + scrolled;
        const windowHeight = window.innerHeight;

        if (scrolled + windowHeight > imagePosition && scrolled < imagePosition + historiaImage.offsetHeight) {
            const yPos = -(scrolled - imagePosition) * 0.15;
            historiaImage.style.transform = `translateY(${yPos}px)`;
        }
    });
}

// ========================================
// 11. UTILITY FUNCTIONS
// ========================================

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showSuccessMessage(text) {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
        max-width: 90%;
        text-align: center;
    `;
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 5000);
}

function showErrorMessage(text) {
    const message = document.createElement('div');
    message.className = 'error-message-global';
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #f44336;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
        max-width: 90%;
        text-align: center;
    `;
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 5000);
}

// ========================================
// 12. PAGE LOAD TRACKING
// ========================================

// Track page view
if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
        'page_title': 'Sobre',
        'page_location': window.location.href,
        'page_path': window.location.pathname
    });
}

if (typeof fbq !== 'undefined') {
    fbq('track', 'PageView');
}

// Track time on page
let startTime = Date.now();

window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);

    if (typeof gtag !== 'undefined' && timeOnPage > 10) {
        gtag('event', 'time_on_page', {
            'event_category': 'Engagement',
            'event_label': 'Sobre',
            'value': timeOnPage
        });
    }
});

// Track scroll depth
let maxScrollDepth = 0;

window.addEventListener('scroll', () => {
    const scrollPercentage = Math.round(
        (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = scrollPercentage;

        // Track milestones
        if ([25, 50, 75, 100].includes(scrollPercentage)) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll_depth', {
                    'event_category': 'Engagement',
                    'event_label': `${scrollPercentage}%`,
                    'value': scrollPercentage
                });
            }
        }
    }
});

// ========================================
// 13. CONSOLE MESSAGE
// ========================================

console.log(
    '%c🏢 Sobre a Toldo Vela',
    'font-size: 16px; font-weight: bold; color: #1A4D5C;'
);
console.log(
    '%c15 anos transformando ambientes',
    'font-size: 12px; color: #FF6B35;'
);
