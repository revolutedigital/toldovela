/* ========================================
   MÉTODO TOLDO VELA - JAVASCRIPT
   Versão: 1.0
   ======================================== */

'use strict';

// ========================================
// 1. FAQ ACCORDION
// ========================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');

    if (question) {
        question.addEventListener('click', () => {
            // Fechar outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle item atual
            item.classList.toggle('active');

            // Acessibilidade: atualizar aria-expanded
            const isExpanded = item.classList.contains('active');
            question.setAttribute('aria-expanded', isExpanded);
        });

        // Inicializar aria-expanded
        question.setAttribute('aria-expanded', 'false');
    }
});

// ========================================
// 2. VIDEO PLAY BUTTON
// ========================================

const videoPlayButton = document.querySelector('.video-play-button');
const videoContainer = document.querySelector('.video-container');

if (videoPlayButton && videoContainer) {
    videoPlayButton.addEventListener('click', () => {
        // Substituir por iframe do YouTube/Vimeo quando vídeo estiver pronto
        const videoId = 'SEU_VIDEO_ID'; // Substituir pelo ID real do vídeo
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', embedUrl);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        `;

        // Limpar container e adicionar iframe
        videoContainer.innerHTML = '';
        videoContainer.appendChild(iframe);

        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_play', {
                'event_category': 'Video',
                'event_label': 'Método Toldo Vela'
            });
        }

        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: 'Video Método',
                content_type: 'video'
            });
        }
    });
}

// ========================================
// 3. SMOOTH SCROLL TO PHASES
// ========================================

// Já implementado no main.js, mas adicionar tracking específico
document.querySelectorAll('a[href^="#fase-"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        const targetId = href.replace('#', '');

        // Track phase navigation
        if (typeof gtag !== 'undefined') {
            gtag('event', 'navigation', {
                'event_category': 'Método',
                'event_label': targetId
            });
        }
    });
});

// ========================================
// 4. COUNTER ANIMATION FOR STATS
// ========================================

const statValues = document.querySelectorAll('.metodo-stat__value');

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            animateStatCounter(entry.target);
            entry.target.dataset.animated = 'true';
        }
    });
}, observerOptions);

statValues.forEach(stat => {
    statsObserver.observe(stat);
});

function animateStatCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const number = parseInt(text.replace(/\D/g, ''));

    if (isNaN(number)) return;

    const duration = 2000; // 2 segundos
    const steps = 60;
    const increment = number / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            let finalText = number.toString();
            if (hasPlus) finalText += '+';
            if (hasPercent) finalText += '%';
            element.textContent = finalText;
            clearInterval(timer);
        } else {
            let displayText = Math.floor(current).toString();
            if (hasPlus) displayText += '+';
            if (hasPercent) displayText += '%';
            element.textContent = displayText;
        }
    }, duration / steps);
}

// ========================================
// 5. FORM SUBMISSION (MÉTODO PAGE)
// ========================================

const metodForm = document.getElementById('metodo-form');

if (metodForm) {
    metodForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validação básica
        const formData = new FormData(metodForm);
        const data = Object.fromEntries(formData);

        // Adicionar origem do form
        data.origem = 'Página Método';

        // Validar campos obrigatórios
        const requiredFields = ['nome', 'email', 'telefone', 'tipo_projeto', 'cidade', 'estado', 'aceite_contato'];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = metodForm.querySelector(`[name="${field}"]`);
            if (!input) return;

            if (input.type === 'checkbox') {
                if (!input.checked) {
                    isValid = false;
                    input.classList.add('error');
                    showError(input.parentElement, 'Este campo é obrigatório');
                } else {
                    input.classList.remove('error');
                    removeError(input.parentElement);
                }
            } else {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    showError(input, 'Este campo é obrigatório');
                } else {
                    input.classList.remove('error');
                    removeError(input);
                }
            }
        });

        // Validar email
        const emailInput = metodForm.querySelector('[name="email"]');
        if (emailInput.value && !isValidEmail(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('error');
            showError(emailInput, 'E-mail inválido');
        }

        // Validar telefone
        const telefoneInput = metodForm.querySelector('[name="telefone"]');
        if (telefoneInput.value && !isValidPhone(telefoneInput.value)) {
            isValid = false;
            telefoneInput.classList.add('error');
            showError(telefoneInput, 'Telefone inválido');
        }

        if (!isValid) return;

        // Desabilita botão e mostra loading
        const submitButton = metodForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        try {
            // Enviar para o servidor
            const response = await fetch(metodForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Sucesso
                showSuccessMessage('Formulário enviado com sucesso! Entraremos em contato em breve.');
                metodForm.reset();

                // Google Analytics Event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'Lead',
                        'event_label': 'Método - Proposta Personalizada'
                    });
                }

                // Facebook Pixel Event
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'Método Toldo Vela',
                        content_category: 'Proposta'
                    });
                }

                // Redirecionar para página de obrigado após 2 segundos
                setTimeout(() => {
                    window.location.href = '/obrigado?origem=metodo';
                }, 2000);
            } else {
                throw new Error('Erro ao enviar formulário');
            }
        } catch (error) {
            console.error('Erro:', error);
            showErrorMessage('Ocorreu um erro ao enviar. Por favor, tente novamente ou entre em contato por telefone.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// ========================================
// 6. PHASE SECTION PROGRESS INDICATOR
// ========================================

// Criar indicador de progresso para as fases
const fasesSections = document.querySelectorAll('.fase-detail');

if (fasesSections.length > 0) {
    // Criar progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'phases-progress';
    progressBar.innerHTML = `
        <div class="phases-progress__bar">
            <div class="phases-progress__fill"></div>
        </div>
        <div class="phases-progress__labels">
            <span data-fase="1">1</span>
            <span data-fase="2">2</span>
            <span data-fase="3">3</span>
            <span data-fase="4">4</span>
            <span data-fase="5">5</span>
        </div>
    `;

    // Adicionar estilos
    const progressStyle = document.createElement('style');
    progressStyle.textContent = `
        .phases-progress {
            position: fixed;
            top: 50%;
            right: 2rem;
            transform: translateY(-50%);
            z-index: 100;
            display: none;
        }

        @media (min-width: 1200px) {
            .phases-progress {
                display: block;
            }
        }

        .phases-progress__bar {
            width: 4px;
            height: 200px;
            background: rgba(26, 77, 92, 0.2);
            border-radius: 2px;
            position: relative;
            margin-bottom: 1rem;
        }

        .phases-progress__fill {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 0%;
            background: var(--color-secondary);
            border-radius: 2px;
            transition: height 0.3s ease-out;
        }

        .phases-progress__labels {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .phases-progress__labels span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: var(--color-white);
            border: 2px solid rgba(26, 77, 92, 0.2);
            border-radius: 50%;
            font-weight: 600;
            color: var(--color-text-light);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .phases-progress__labels span:hover {
            transform: scale(1.1);
            border-color: var(--color-secondary);
        }

        .phases-progress__labels span.active {
            background: var(--color-secondary);
            border-color: var(--color-secondary);
            color: var(--color-white);
        }
    `;
    document.head.appendChild(progressStyle);
    document.body.appendChild(progressBar);

    // Observar seções
    const progressFill = progressBar.querySelector('.phases-progress__fill');
    const progressLabels = progressBar.querySelectorAll('.phases-progress__labels span');

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const faseNumber = sectionId.replace('fase-', '');

                // Atualizar barra de progresso
                const progress = (faseNumber / 5) * 100;
                progressFill.style.height = `${progress}%`;

                // Atualizar labels
                progressLabels.forEach(label => {
                    const labelFase = label.dataset.fase;
                    if (parseInt(labelFase) <= parseInt(faseNumber)) {
                        label.classList.add('active');
                    } else {
                        label.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3
    });

    fasesSections.forEach(section => {
        progressObserver.observe(section);
    });

    // Click nos labels para navegar
    progressLabels.forEach(label => {
        label.addEventListener('click', () => {
            const faseNumber = label.dataset.fase;
            const targetSection = document.getElementById(`fase-${faseNumber}`);

            if (targetSection) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Track navigation
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        'event_category': 'Progress Indicator',
                        'event_label': `Fase ${faseNumber}`
                    });
                }
            }
        });
    });
}

// ========================================
// 7. NEWSLETTER FORM (FOOTER)
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
                body: JSON.stringify({ email, origem: 'Página Método' })
            });

            if (response.ok) {
                showSuccessMessage('Obrigado! Você foi inscrito na nossa newsletter.');
                newsletterForm.reset();

                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        'event_category': 'Newsletter',
                        'event_label': 'Página Método'
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
// 8. UTILITY FUNCTIONS
// ========================================

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
// 9. PAGE LOAD TRACKING
// ========================================

// Track page view
if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
        'page_title': 'Método Toldo Vela',
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
            'event_label': 'Método Toldo Vela',
            'value': timeOnPage
        });
    }
});

// ========================================
// 10. CONSOLE MESSAGE
// ========================================

console.log(
    '%c📋 Método Toldo Vela - 5 Fases de Excelência',
    'font-size: 16px; font-weight: bold; color: #1A4D5C;'
);
console.log(
    '%cScript carregado com sucesso',
    'font-size: 12px; color: #FF6B35;'
);
