/* ========================================
   MATERIAIS & TECNOLOGIA - JAVASCRIPT
   Versão: 1.0
   ======================================== */

'use strict';

// ========================================
// 1. SMOOTH SCROLL TO MATERIALS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Ignorar links que não são âncoras internas
        if (href === '#' || href === '#form-material') {
            return;
        }

        // Verificar se é link para material específico
        if (href.startsWith('#gale-') || href.startsWith('#serge-') || href.startsWith('#gore-')) {
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
                    gtag('event', 'material_view', {
                        'event_category': 'Materials',
                        'event_label': targetId
                    });
                }
            }
        }
    });
});

// ========================================
// 2. MATERIAL COLOR SAMPLES INTERACTION
// ========================================

const colorSamples = document.querySelectorAll('.color-sample');

colorSamples.forEach(sample => {
    // Click to show larger preview
    sample.addEventListener('click', function() {
        const color = this.style.background;
        const colorName = this.getAttribute('title');

        // Create modal preview
        showColorPreview(color, colorName);

        // Track color selection
        if (typeof gtag !== 'undefined') {
            gtag('event', 'color_select', {
                'event_category': 'Materials',
                'event_label': colorName
            });
        }
    });

    // Keyboard accessibility
    sample.setAttribute('tabindex', '0');
    sample.setAttribute('role', 'button');
    sample.setAttribute('aria-label', `Ver cor ${sample.getAttribute('title')}`);

    sample.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

function showColorPreview(color, colorName) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'color-preview-modal';
    modal.innerHTML = `
        <div class="color-preview-content">
            <button class="color-preview-close" aria-label="Fechar">&times;</button>
            <div class="color-preview-swatch" style="background: ${color}"></div>
            <h3>${colorName}</h3>
            <p>Esta é uma representação aproximada. Solicite amostras físicas para ver a cor exata.</p>
            <a href="#form-material" class="btn btn--primary">Solicitar Amostra</a>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .color-preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        }

        .color-preview-content {
            background: var(--color-white);
            padding: 3rem;
            border-radius: var(--radius-lg);
            text-align: center;
            max-width: 400px;
            position: relative;
        }

        .color-preview-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: transparent;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--color-text-light);
            transition: color var(--transition-normal);
        }

        .color-preview-close:hover {
            color: var(--color-secondary);
        }

        .color-preview-swatch {
            width: 200px;
            height: 200px;
            margin: 0 auto 2rem;
            border-radius: var(--radius-lg);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        }

        .color-preview-content h3 {
            font-size: 1.5rem;
            color: var(--color-primary);
            margin-bottom: 1rem;
        }

        .color-preview-content p {
            color: var(--color-text-light);
            margin-bottom: 2rem;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Close modal
    const closeBtn = modal.querySelector('.color-preview-close');
    const closeModal = () => {
        modal.remove();
        style.remove();
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
}

// ========================================
// 3. MATERIAL COMPARISON TABLE - MOBILE OPTIMIZATION
// ========================================

const comparisonTable = document.querySelector('.comparison-table');

if (comparisonTable && window.innerWidth <= 768) {
    // Add touch scroll indicator
    const wrapper = comparisonTable.closest('.comparison-table-wrapper');
    if (wrapper) {
        const scrollHint = document.createElement('div');
        scrollHint.className = 'scroll-hint';
        scrollHint.innerHTML = '← Deslize para ver mais →';
        scrollHint.style.cssText = `
            text-align: center;
            padding: 0.5rem;
            background: rgba(255, 107, 53, 0.1);
            color: var(--color-secondary);
            font-size: 0.875rem;
            font-weight: 600;
            border-radius: var(--radius-sm);
            margin-bottom: 0.5rem;
        `;

        wrapper.parentNode.insertBefore(scrollHint, wrapper);

        // Remove hint after first scroll
        wrapper.addEventListener('scroll', function() {
            scrollHint.style.display = 'none';
        }, { once: true });
    }
}

// ========================================
// 4. FORM SUBMISSION (AMOSTRAS)
// ========================================

const amostrasForm = document.getElementById('amostras-form');

if (amostrasForm) {
    amostrasForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validação
        const formData = new FormData(amostrasForm);
        const data = Object.fromEntries(formData);

        // Adicionar origem
        data.origem = 'Página Materiais';

        // Obter materiais selecionados
        const materiaisSelecionados = [];
        amostrasForm.querySelectorAll('input[name="materiais[]"]:checked').forEach(checkbox => {
            materiaisSelecionados.push(checkbox.value);
        });

        data.materiais = materiaisSelecionados;

        // Validar se pelo menos um material foi selecionado
        if (materiaisSelecionados.length === 0) {
            showErrorMessage('Por favor, selecione pelo menos um material de interesse.');
            return;
        }

        // Validar campos obrigatórios
        const requiredFields = ['nome', 'email', 'telefone', 'endereco', 'cidade', 'estado', 'cep', 'aceite_contato'];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = amostrasForm.querySelector(`[name="${field}"]`);
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
        const emailInput = amostrasForm.querySelector('[name="email"]');
        if (emailInput.value && !isValidEmail(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('error');
            showError(emailInput, 'E-mail inválido');
        }

        // Validar telefone
        const telefoneInput = amostrasForm.querySelector('[name="telefone"]');
        if (telefoneInput.value && !isValidPhone(telefoneInput.value)) {
            isValid = false;
            telefoneInput.classList.add('error');
            showError(telefoneInput, 'Telefone inválido');
        }

        // Validar CEP
        const cepInput = amostrasForm.querySelector('[name="cep"]');
        if (cepInput.value && !isValidCEP(cepInput.value)) {
            isValid = false;
            cepInput.classList.add('error');
            showError(cepInput, 'CEP inválido');
        }

        if (!isValid) return;

        // Desabilita botão e mostra loading
        const submitButton = amostrasForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        try {
            // Enviar para o servidor
            const response = await fetch(amostrasForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Sucesso
                showSuccessMessage('Solicitação enviada! As amostras serão enviadas em até 7 dias úteis.');
                amostrasForm.reset();

                // Google Analytics Event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        'event_category': 'Lead',
                        'event_label': 'Amostras - ' + materiaisSelecionados.join(', ')
                    });
                }

                // Facebook Pixel Event
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'Amostras de Materiais',
                        content_category: materiaisSelecionados.join(', ')
                    });
                }

                // Redirecionar para página de obrigado
                setTimeout(() => {
                    window.location.href = '/obrigado?origem=amostras';
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

    // CEP mask
    const cepInput = amostrasForm.querySelector('[name="cep"]');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });

        // Auto-fill address from CEP (using ViaCEP API)
        cepInput.addEventListener('blur', async function() {
            const cep = this.value.replace(/\D/g, '');

            if (cep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();

                    if (!data.erro) {
                        const cidadeInput = amostrasForm.querySelector('[name="cidade"]');
                        const estadoInput = amostrasForm.querySelector('[name="estado"]');

                        if (cidadeInput) cidadeInput.value = data.localidade;
                        if (estadoInput) estadoInput.value = data.uf;
                    }
                } catch (error) {
                    console.error('Erro ao buscar CEP:', error);
                }
            }
        });
    }
}

// ========================================
// 5. MATERIAL SECTIONS SCROLL ANIMATION
// ========================================

const materialSections = document.querySelectorAll('.material-detail');

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const materialsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';

            // Track material view
            const materialId = entry.target.querySelector('[id]')?.id || '';
            if (materialId && typeof gtag !== 'undefined') {
                gtag('event', 'scroll_to_material', {
                    'event_category': 'Materials',
                    'event_label': materialId
                });
            }
        }
    });
}, observerOptions);

materialSections.forEach(section => {
    materialsObserver.observe(section);
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
                body: JSON.stringify({ email, origem: 'Página Materiais' })
            });

            if (response.ok) {
                showSuccessMessage('Obrigado! Você foi inscrito na nossa newsletter.');
                newsletterForm.reset();

                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        'event_category': 'Newsletter',
                        'event_label': 'Página Materiais'
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
// 7. MATERIAL LOGOS ANIMATION
// ========================================

const materialLogos = document.querySelectorAll('.material-detail__logo');

materialLogos.forEach(logo => {
    const logoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'bounceIn 0.8s ease-out';
            }
        });
    }, { threshold: 0.5 });

    logoObserver.observe(logo);
});

// Add bounce animation
const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.3) translateY(20px);
        }
        50% {
            opacity: 1;
            transform: translateX(-50%) scale(1.05) translateY(-10px);
        }
        70% {
            transform: translateX(-50%) scale(0.95) translateY(0);
        }
        100% {
            transform: translateX(-50%) scale(1) translateY(0);
        }
    }
`;
document.head.appendChild(bounceStyle);

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

function isValidCEP(cep) {
    const cleaned = cep.replace(/\D/g, '');
    return cleaned.length === 8;
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
        'page_title': 'Materiais & Tecnologia',
        'page_location': window.location.href,
        'page_path': window.location.pathname
    });
}

if (typeof fbq !== 'undefined') {
    fbq('track', 'PageView');
    fbq('track', 'ViewContent', {
        content_name: 'Materiais & Tecnologia',
        content_type: 'product_group'
    });
}

// Track time on page
let startTime = Date.now();

window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);

    if (typeof gtag !== 'undefined' && timeOnPage > 10) {
        gtag('event', 'time_on_page', {
            'event_category': 'Engagement',
            'event_label': 'Materiais & Tecnologia',
            'value': timeOnPage
        });
    }
});

// ========================================
// 10. CONSOLE MESSAGE
// ========================================

console.log(
    '%c🏗️ Materiais & Tecnologia - Toldo Vela',
    'font-size: 16px; font-weight: bold; color: #1A4D5C;'
);
console.log(
    '%cMateriais premium de performance mundial',
    'font-size: 12px; color: #FF6B35;'
);
