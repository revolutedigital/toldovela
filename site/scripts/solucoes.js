/* ========================================
   SOLUÇÕES - INTERATIVIDADE
   ======================================== */

(function() {
    'use strict';

    /* FAQ Accordion */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Fecha todos os outros
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle o atual
            item.classList.toggle('active');
        });
    });

    /* Form Handling */
    const form = document.getElementById('orcamento-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Track event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    form_name: 'orcamento_solucao',
                    tipo_projeto: data.tipo_projeto
                });
            }

            // Submit via fetch (when API is ready)
            console.log('Form data:', data);

            // Redirect to thank you page
            window.location.href = `/obrigado?form=orcamento&tipo=${encodeURIComponent(data.tipo_projeto)}`;
        });

        // Phone mask
        const phoneInput = form.querySelector('input[name="telefone"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                let value = this.value.replace(/\D/g, '');
                if (value.length <= 10) {
                    value = value.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3');
                } else {
                    value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
                }
                this.value = value;
            });
        }
    }

    /* Scroll Animations */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe elements
    const animatedElements = document.querySelectorAll('.application-card, .benefit-card, .process-step, .project-item, .spec-category');
    animatedElements.forEach(el => observer.observe(el));

    /* Track CTA Clicks */
    const ctaButtons = document.querySelectorAll('.solution-hero__cta .btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    location: 'hero',
                    text: this.textContent.trim()
                });
            }
        });
    });

    /* Track WhatsApp Click */
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        whatsappFloat.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    page: window.location.pathname
                });
            }
        });
    }

    console.log('✓ Soluções page initialized');
})();
