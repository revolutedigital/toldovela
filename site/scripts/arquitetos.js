/* ========================================
   PARA ARQUITETOS - JAVASCRIPT
   Versão: 1.0
   ======================================== */

'use strict';

// ========================================
// 1. DOWNLOAD RESOURCES WITH EMAIL CAPTURE
// ========================================

const downloadButtons = document.querySelectorAll('.recurso-card__download');

downloadButtons.forEach(button => {
    button.addEventListener('click', function() {
        const resourceType = this.getAttribute('data-resource');
        const resourceTitle = this.closest('.recurso-card').querySelector('.recurso-card__title').textContent;

        showDownloadModal(resourceType, resourceTitle);

        // Track download intent
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download_intent', {
                'event_category': 'Resources',
                'event_label': resourceType
            });
        }
    });
});

function showDownloadModal(resourceType, resourceTitle) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="download-modal__content">
            <button class="download-modal__close" aria-label="Fechar">&times;</button>
            <div class="download-modal__icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
            </div>
            <h3 class="download-modal__title">Download: ${resourceTitle}</h3>
            <p class="download-modal__text">
                Para baixar este recurso, informe seu e-mail profissional.
                Você receberá o link de download imediatamente.
            </p>
            <form class="download-modal__form" id="download-form">
                <input type="text" name="nome" placeholder="Nome completo" required>
                <input type="email" name="email" placeholder="E-mail profissional" required>
                <input type="tel" name="telefone" placeholder="Telefone (opcional)">
                <input type="hidden" name="recurso" value="${resourceType}">
                <button type="submit" class="btn btn--secondary btn--lg">
                    Enviar e Baixar
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);

    // Close modal
    const closeBtn = modal.querySelector('.download-modal__close');
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // ESC key to close
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });

    // Handle form submission
    const form = modal.querySelector('#download-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.origem = 'Para Arquitetos - Download';

        // Validate email
        if (!isValidEmail(data.email)) {
            showErrorMessage('Por favor, insira um e-mail válido.');
            return;
        }

        // Disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processando...';

        try {
            // Send to server
            const response = await fetch('/api/download-resource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();

                // Track download
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'download_complete', {
                        'event_category': 'Resources',
                        'event_label': resourceType
                    });
                }

                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: `Download: ${resourceTitle}`,
                        content_category: 'Resource'
                    });
                }

                // Simulate download (replace with actual file URL from server)
                showSuccessMessage('Download iniciado! Verifique também seu e-mail.');

                // Close modal after success
                setTimeout(() => {
                    closeModal();
                }, 2000);

                // In production, trigger actual download:
                // window.location.href = result.downloadUrl;
            } else {
                throw new Error('Erro ao processar download');
            }
        } catch (error) {
            console.error('Erro:', error);
            showErrorMessage('Ocorreu um erro. Por favor, tente novamente ou entre em contato.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ========================================
// 2. FORM SUBMISSION (PARCERIA)
// ========================================

const parceriaForm = document.getElementById('parceria-form');

if (parceriaForm) {
    parceriaForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(parceriaForm);
        const data = Object.fromEntries(formData);

        // Get selected resources
        const recursosSelecionados = [];
        parceriaForm.querySelectorAll('input[name="recursos[]"]:checked').forEach(checkbox => {
            recursosSelecionados.push(checkbox.value);
        });
        data.recursos = recursosSelecionados;

        // Add origin
        data.origem = 'Para Arquitetos - Parceria';

        // Validate required fields
        const requiredFields = ['nome', 'email', 'telefone', 'escritorio', 'especialidade', 'cidade', 'estado', 'interesse', 'aceite_contato'];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = parceriaForm.querySelector(`[name="${field}"]`);
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

        // Validate email
        const emailInput = parceriaForm.querySelector('[name="email"]');
        if (emailInput.value && !isValidEmail(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('error');
            showError(emailInput, 'E-mail inválido');
        }

        // Validate phone
        const telefoneInput = parceriaForm.querySelector('[name="telefone"]');
        if (telefoneInput.value && !isValidPhone(telefoneInput.value)) {
            isValid = false;
            telefoneInput.classList.add('error');
            showError(telefoneInput, 'Telefone inválido');
        }

        if (!isValid) return;

        // Disable button and show loading
        const submitButton = parceriaForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        try {
            // Send to server
            const response = await fetch(parceriaForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Success
                showSuccessMessage('Solicitação enviada! Nossa equipe entrará em contato em breve.');
                parceriaForm.reset();

                // Google Analytics Event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'Lead',
                        'event_label': 'Parceria Arquitetos'
                    });
                }

                // Facebook Pixel Event
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name': 'Parceria Profissional',
                        content_category: 'B2B'
                    });
                }

                // Redirect to thank you page
                setTimeout(() => {
                    window.location.href = '/obrigado?origem=parceria';
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
// 3. SMOOTH SCROLL TO SECTIONS
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

            // Track navigation
            if (typeof gtag !== 'undefined') {
                gtag('event', 'navigation', {
                    'event_category': 'Arquitetos',
                    'event_label': targetId
                });
            }
        }
    });
});

// ========================================
// 4. ANIMATE PROCESSO TIMELINE ON SCROLL
// ========================================

const processoSteps = document.querySelectorAll('.processo-step');

const processoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            processoObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3
});

processoSteps.forEach(step => {
    processoObserver.observe(step);
});

// ========================================
// 5. ANIMATE BENEFICIO CARDS
// ========================================

const beneficioCards = document.querySelectorAll('.beneficio-card');

const beneficiosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            beneficiosObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

beneficioCards.forEach(card => {
    beneficiosObserver.observe(card);
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
                body: JSON.stringify({ email, origem: 'Para Arquitetos' })
            });

            if (response.ok) {
                showSuccessMessage('Obrigado! Você foi inscrito na nossa newsletter.');
                newsletterForm.reset();

                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        'event_category': 'Newsletter',
                        'event_label': 'Para Arquitetos'
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
// 7. PHONE MASK
// ========================================

const phoneInputs = document.querySelectorAll('input[type="tel"]');

phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length <= 10) {
            // Formato: (11) 1234-5678
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else {
            // Formato: (11) 91234-5678
            value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
        }

        e.target.value = value;
    });
});

// ========================================
// 8. TRACK CTA BUTTON CLICKS
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
// 9. UTILITY FUNCTIONS
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
    errorDiv.style.cssText = `
        color: #f44336;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    `;
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
// 10. PAGE LOAD TRACKING
// ========================================

// Track page view
if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
        'page_title': 'Para Arquitetos',
        'page_location': window.location.href,
        'page_path': window.location.pathname
    });
}

if (typeof fbq !== 'undefined') {
    fbq('track', 'PageView');
    fbq('track', 'ViewContent', {
        content_name: 'Para Arquitetos - Parceria B2B',
        content_category: 'B2B'
    });
}

// Track time on page
let startTime = Date.now();

window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);

    if (typeof gtag !== 'undefined' && timeOnPage > 10) {
        gtag('event', 'time_on_page', {
            'event_category': 'Engagement',
            'event_label': 'Para Arquitetos',
            'value': timeOnPage
        });
    }
});

// ========================================
// 11. CONSOLE MESSAGE
// ========================================

console.log(
    '%c🏛️ Para Arquitetos - Parceria Profissional Toldo Vela',
    'font-size: 16px; font-weight: bold; color: #1A4D5C;'
);
console.log(
    '%cSuporte técnico especializado para seus projetos',
    'font-size: 12px; color: #FF6B35;'
);
