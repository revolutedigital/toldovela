/* ========================================
   TOLDO VELA - MAIN JAVASCRIPT
   Versão: 1.0
   ======================================== */

'use strict';

// ========================================
// 1. MENU MOBILE TOGGLE
// ========================================

const menuToggle = document.querySelector('.header__menu-toggle');
const nav = document.querySelector('.header__nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Fechar menu ao clicar em link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// ========================================
// 2. HEADER SCROLL EFFECT
// ========================================

const header = document.querySelector('.header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Adiciona classe quando rolar
    if (scrollTop > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Esconde header ao rolar para baixo, mostra ao rolar para cima
    if (scrollTop > lastScrollTop && scrollTop > 500) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
});

// ========================================
// 3. SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Ignora # sozinho
        if (href === '#') return;

        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 4. FORM VALIDATION & SUBMISSION
// ========================================

const leadForm = document.getElementById('lead-form');

if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validação básica
        const formData = new FormData(leadForm);
        const data = Object.fromEntries(formData);

        // Validar campos obrigatórios
        const requiredFields = ['nome', 'email', 'telefone', 'tipo_projeto', 'cidade', 'estado'];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = leadForm.querySelector(`[name="${field}"]`);
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                showError(input, 'Este campo é obrigatório');
            } else {
                input.classList.remove('error');
                removeError(input);
            }
        });

        // Validar email
        const emailInput = leadForm.querySelector('[name="email"]');
        if (emailInput.value && !isValidEmail(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('error');
            showError(emailInput, 'E-mail inválido');
        }

        // Validar telefone
        const telefoneInput = leadForm.querySelector('[name="telefone"]');
        if (telefoneInput.value && !isValidPhone(telefoneInput.value)) {
            isValid = false;
            telefoneInput.classList.add('error');
            showError(telefoneInput, 'Telefone inválido');
        }

        if (!isValid) return;

        // Desabilita botão e mostra loading
        const submitButton = leadForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        try {
            // Enviar para o servidor
            const response = await fetch(leadForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Sucesso
                showSuccessMessage();
                leadForm.reset();

                // Google Analytics Event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'Lead',
                        'event_label': 'Análise Técnica Gratuita'
                    });
                }

                // Facebook Pixel Event
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead');
                }

                // Redirecionar para página de obrigado após 2 segundos
                setTimeout(() => {
                    window.location.href = '/obrigado';
                }, 2000);
            } else {
                throw new Error('Erro ao enviar formulário');
            }
        } catch (error) {
            console.error('Erro:', error);
            showErrorMessage('Ocorreu um erro ao enviar. Por favor, tente novamente.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// Funções auxiliares de validação
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
}

function showError(input, message) {
    removeError(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

function removeError(input) {
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = 'Formulário enviado com sucesso! Entraremos em contato em breve.';
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
    `;
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 5000);
}

// ========================================
// 5. MÁSCARAS DE INPUT
// ========================================

// Máscara de telefone
const telefoneInputs = document.querySelectorAll('input[type="tel"]');
telefoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length <= 10) {
            // (XX) XXXX-XXXX
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else {
            // (XX) XXXXX-XXXX
            value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
        }

        e.target.value = value;
    });
});

// ========================================
// 6. INTERSECTION OBSERVER (Animações)
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Counter animation para números
            if (entry.target.classList.contains('impact-number__value') ||
                entry.target.classList.contains('metric__value')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Observar elementos para animação
const animatedElements = document.querySelectorAll(
    '.differential, .solution-card, .material-card, .portfolio__item, ' +
    '.testimonial, .timeline__item, .impact-number, .metric'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Adicionar classe visible via CSS
const style = document.createElement('style');
style.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ========================================
// 7. COUNTER ANIMATION
// ========================================

function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const number = parseInt(text.replace(/\D/g, ''));

    if (isNaN(number)) return;

    const duration = 2000; // 2 segundos
    const steps = 60;
    const increment = number / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.textContent = number + (hasPlus ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
        }
    }, duration / steps);
}

// ========================================
// 8. LAZY LOADING DE IMAGENS
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// 9. WHATSAPP CLICK TRACKING
// ========================================

const whatsappButtons = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
whatsappButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Google Analytics Event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'WhatsApp',
                'event_label': 'WhatsApp Click'
            });
        }

        // Facebook Pixel Event
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact');
        }
    });
});

// ========================================
// 10. PHONE CLICK TRACKING
// ========================================

const phoneButtons = document.querySelectorAll('a[href^="tel:"]');
phoneButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Google Analytics Event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Phone',
                'event_label': 'Phone Click'
            });
        }
    });
});

// ========================================
// 11. VIDEO AUTOPLAY (Hero)
// ========================================

const heroVideo = document.querySelector('.hero__video video');
if (heroVideo) {
    // Tentar reproduzir automaticamente
    heroVideo.play().catch(error => {
        console.log('Autoplay bloqueado:', error);
        // Se autoplay falhar, mostrar imagem estática
        heroVideo.style.display = 'none';
    });

    // Pausar vídeo quando não estiver visível
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heroVideo.play();
            } else {
                heroVideo.pause();
            }
        });
    }, { threshold: 0.5 });

    videoObserver.observe(heroVideo);
}

// ========================================
// 12. SCROLL TO TOP
// ========================================

// Criar botão de voltar ao topo
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
`;
scrollToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
document.body.appendChild(scrollToTopBtn);

// Adicionar estilos do botão
const scrollToTopStyle = document.createElement('style');
scrollToTopStyle.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 998;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }

    .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
    }

    .scroll-to-top:hover {
        background-color: var(--color-secondary);
        transform: translateY(-5px);
    }
`;
document.head.appendChild(scrollToTopStyle);

// Mostrar/esconder botão baseado no scroll
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

// Ação do botão
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// 13. CONSOLE MESSAGE
// ========================================

console.log(
    '%c🏗️ Toldo Vela - Site Institucional',
    'font-size: 20px; font-weight: bold; color: #1A4D5C;'
);
console.log(
    '%cDesenvolvido seguindo padrões enterprise de marketing digital',
    'font-size: 12px; color: #666;'
);
console.log(
    '%c📧 contato@toldo-vela.com | 📱 (11) 4035-8878',
    'font-size: 12px; color: #FF6B35;'
);

// ========================================
// 14. PERFORMANCE MONITORING
// ========================================

if ('PerformanceObserver' in window) {
    // Monitorar Largest Contentful Paint (LCP)
    try {
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
        console.log('LCP monitoring not available');
    }

    // Monitorar First Input Delay (FID)
    try {
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
        console.log('FID monitoring not available');
    }
}

// ========================================
// 15. ERROR HANDLING GLOBAL
// ========================================

window.addEventListener('error', (e) => {
    console.error('Erro capturado:', e.message);
    // Enviar erro para serviço de monitoramento (ex: Sentry)
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejeitada:', e.reason);
    // Enviar erro para serviço de monitoramento
});
