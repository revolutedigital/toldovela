/* ========================================
   CONTATO & OBRIGADO PAGE SCRIPTS
   ======================================== */

(function() {
    'use strict';

    /* ========================================
       UTILITY FUNCTIONS
       ======================================== */

    /**
     * Apply phone mask for Brazilian format
     */
    function applyPhoneMask(input) {
        let value = input.value.replace(/\D/g, '');

        if (value.length <= 10) {
            // (11) 4035-8878
            value = value.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3');
        } else {
            // (11) 91262-3834
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        }

        input.value = value;
    }

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Validate phone format
     */
    function isValidPhone(phone) {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 11;
    }

    /**
     * Show error on form field
     */
    function showError(formGroup, message) {
        formGroup.classList.add('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    /**
     * Clear error from form field
     */
    function clearError(formGroup) {
        formGroup.classList.remove('error');
    }

    /**
     * Track event (Google Analytics & Facebook Pixel)
     */
    function trackEvent(eventName, eventData = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, eventData);
        }

        console.log('Event tracked:', eventName, eventData);
    }

    /* ========================================
       CONTACT FORM HANDLING
       ======================================== */

    const contactForm = document.getElementById('contato-form');

    if (contactForm) {
        // Phone mask
        const phoneInput = contactForm.querySelector('input[name="telefone"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                applyPhoneMask(this);
            });
        }

        // Real-time validation
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                if (formGroup.classList.contains('error')) {
                    clearError(formGroup);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validateForm(contactForm)) {
                submitContactForm(contactForm);
            }
        });
    }

    /**
     * Validate individual field
     */
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        const fieldName = field.getAttribute('name');
        const fieldValue = field.value.trim();

        // Clear previous error
        clearError(formGroup);

        // Required field validation
        if (field.hasAttribute('required') && !fieldValue) {
            showError(formGroup, 'Este campo é obrigatório');
            return false;
        }

        // Email validation
        if (fieldName === 'email' && fieldValue && !isValidEmail(fieldValue)) {
            showError(formGroup, 'Por favor, insira um e-mail válido');
            return false;
        }

        // Phone validation
        if (fieldName === 'telefone' && fieldValue && !isValidPhone(fieldValue)) {
            showError(formGroup, 'Por favor, insira um telefone válido');
            return false;
        }

        // Name validation (minimum 3 characters)
        if (fieldName === 'nome' && fieldValue && fieldValue.length < 3) {
            showError(formGroup, 'Nome deve ter pelo menos 3 caracteres');
            return false;
        }

        // Message validation (minimum 10 characters)
        if (fieldName === 'mensagem' && fieldValue && fieldValue.length < 10) {
            showError(formGroup, 'Mensagem deve ter pelo menos 10 caracteres');
            return false;
        }

        return true;
    }

    /**
     * Validate entire form
     */
    function validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input, select, textarea');

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Submit contact form
     */
    function submitContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        // Track form submission attempt
        trackEvent('form_submit_attempt', {
            form_name: 'contato',
            assunto: data.assunto
        });

        // Simulate API call (replace with actual endpoint)
        setTimeout(() => {
            console.log('Form data:', data);

            // Track successful submission
            trackEvent('form_submit_success', {
                form_name: 'contato',
                assunto: data.assunto
            });

            // Redirect to thank you page with context
            window.location.href = `/obrigado?form=contato&assunto=${encodeURIComponent(data.assunto)}`;

            /*
            // Real API implementation:
            fetch('/api/contato', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    trackEvent('form_submit_success', {
                        form_name: 'contato',
                        assunto: data.assunto
                    });
                    window.location.href = `/obrigado?form=contato&assunto=${encodeURIComponent(data.assunto)}`;
                } else {
                    throw new Error(result.message || 'Erro ao enviar formulário');
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                alert('Erro ao enviar formulário. Por favor, tente novamente ou entre em contato via WhatsApp.');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;

                trackEvent('form_submit_error', {
                    form_name: 'contato',
                    error: error.message
                });
            });
            */
        }, 1500);
    }

    /* ========================================
       NEWSLETTER FORM (FOOTER)
       ======================================== */

    const newsletterForm = document.querySelector('.footer__newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (!isValidEmail(email)) {
                alert('Por favor, insira um e-mail válido');
                return;
            }

            // Track newsletter signup
            trackEvent('newsletter_signup', {
                email: email,
                page: window.location.pathname
            });

            // Simulate API call
            console.log('Newsletter signup:', email);
            alert('Obrigado por se inscrever! Você receberá nossas novidades em breve.');
            emailInput.value = '';

            /*
            // Real API implementation:
            fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Obrigado por se inscrever! Você receberá nossas novidades em breve.');
                    emailInput.value = '';
                } else {
                    throw new Error(result.message || 'Erro ao se inscrever');
                }
            })
            .catch(error => {
                console.error('Newsletter signup error:', error);
                alert('Erro ao se inscrever. Por favor, tente novamente.');
            });
            */
        });
    }

    /* ========================================
       GOOGLE MAPS INTEGRATION
       ======================================== */

    const mapWrapper = document.querySelector('.contato-mapa__wrapper');

    if (mapWrapper) {
        // Replace placeholder with actual Google Maps embed
        // You'll need to add your Google Maps API key

        /*
        // Example implementation:
        function initMap() {
            const location = { lat: -23.550520, lng: -46.633308 }; // São Paulo coordinates

            const map = new google.maps.Map(mapWrapper, {
                center: location,
                zoom: 15,
                styles: [
                    // Custom map styles (optional)
                ]
            });

            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: 'Toldo Vela'
            });
        }

        // Load Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        */
    }

    /* ========================================
       OBRIGADO PAGE - DYNAMIC MESSAGE
       ======================================== */

    const obrigadoMessage = document.getElementById('obrigado-message');

    if (obrigadoMessage) {
        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const formType = urlParams.get('form');
        const assunto = urlParams.get('assunto');

        // Customize message based on form origin
        let message = '';

        switch(formType) {
            case 'contato':
                message = `Obrigado por entrar em contato conosco${assunto ? ' sobre ' + assunto : ''}. Recebemos sua mensagem e nossa equipe retornará em breve, geralmente em até 24 horas úteis.`;
                break;

            case 'orcamento':
                message = 'Obrigado por solicitar um orçamento! Nossa equipe comercial está analisando suas necessidades e retornará em breve com uma proposta personalizada.';
                break;

            case 'arquiteto':
                message = 'Obrigado pelo seu interesse em nossa parceria para arquitetos! Nossa equipe técnica entrará em contato em breve para apresentar nossas soluções e condições especiais.';
                break;

            case 'material':
                message = 'Obrigado por solicitar amostras de materiais! Prepararemos seu kit personalizado e entraremos em contato para confirmar o envio.';
                break;

            default:
                message = 'Obrigado por entrar em contato conosco. Recebemos sua mensagem e nossa equipe retornará em breve, geralmente em até 24 horas úteis.';
        }

        obrigadoMessage.textContent = message;

        // Track thank you page view
        trackEvent('thank_you_page_view', {
            form_type: formType,
            assunto: assunto
        });
    }

    /* ========================================
       CLICK TRACKING
       ======================================== */

    // Track WhatsApp clicks
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('whatsapp_click', {
                page: window.location.pathname,
                location: this.closest('section')?.className || 'unknown'
            });
        });
    });

    // Track phone clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('phone_click', {
                page: window.location.pathname,
                phone: this.getAttribute('href')
            });
        });
    });

    // Track email clicks
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('email_click', {
                page: window.location.pathname,
                email: this.getAttribute('href')
            });
        });
    });

    // Track social media clicks
    const socialLinks = document.querySelectorAll('.contato-social__link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.className.split('--')[1] || 'unknown';
            trackEvent('social_click', {
                platform: platform,
                page: window.location.pathname
            });
        });
    });

    // Track "extra links" on obrigado page
    const extraLinks = document.querySelectorAll('.extra-link');
    extraLinks.forEach(link => {
        link.addEventListener('click', function() {
            const title = this.querySelector('h3')?.textContent || 'unknown';
            trackEvent('thank_you_navigation', {
                destination: this.getAttribute('href'),
                title: title
            });
        });
    });

    /* ========================================
       SCROLL ANIMATIONS
       ======================================== */

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe contact items
    const contactItems = document.querySelectorAll('.contato-item');
    contactItems.forEach(item => observer.observe(item));

    // Observe obrigado elements
    const obrigadoElements = document.querySelectorAll('.obrigado-icon, .obrigado-title, .obrigado-text, .obrigado-info, .obrigado-urgente, .obrigado-actions, .obrigado-extra');
    obrigadoElements.forEach(element => observer.observe(element));

    /* ========================================
       PAGE LOAD TRACKING
       ======================================== */

    // Track page view
    trackEvent('page_view', {
        page_path: window.location.pathname,
        page_title: document.title
    });

    // Track time on page
    let timeOnPage = 0;
    const timeInterval = setInterval(() => {
        timeOnPage += 10;
    }, 10000); // Every 10 seconds

    window.addEventListener('beforeunload', function() {
        clearInterval(timeInterval);
        trackEvent('time_on_page', {
            page: window.location.pathname,
            seconds: timeOnPage
        });
    });

    /* ========================================
       ACCESSIBILITY ENHANCEMENTS
       ======================================== */

    // Ensure all form inputs have labels
    const formInputsAll = document.querySelectorAll('input, select, textarea');
    formInputsAll.forEach(input => {
        if (!input.getAttribute('aria-label') && !input.getAttribute('id')) {
            const label = input.closest('.form-group')?.querySelector('label');
            if (label && !label.getAttribute('for')) {
                const uniqueId = 'field-' + Math.random().toString(36).substr(2, 9);
                input.setAttribute('id', uniqueId);
                label.setAttribute('for', uniqueId);
            }
        }
    });

    // Add keyboard navigation for social links
    const focusableElements = document.querySelectorAll('.contato-social__link, .extra-link');
    focusableElements.forEach((element, index) => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    /* ========================================
       CONSOLE INFO
       ======================================== */

    console.log('%c Toldo Vela - Contato ', 'background: #0066CC; color: white; font-size: 14px; padding: 5px 10px; border-radius: 3px;');
    console.log('Contact form initialized successfully');
    console.log('Event tracking: Active');
    console.log('Form validation: Active');

})();
