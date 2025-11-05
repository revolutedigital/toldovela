/**
 * BLOG - FUNCIONALIDADES INTERATIVAS
 */

document.addEventListener('DOMContentLoaded', function() {

    // ====================================
    // FILTROS DE CATEGORIA
    // ====================================

    const filterButtons = document.querySelectorAll('.blog-filter');
    const blogCards = document.querySelectorAll('.blog-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Atualiza estado ativo dos botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filtra os cards
            blogCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                    // Animação de entrada
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.classList.add('hidden');
                }
            });

            // Tracking do Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'filter_blog', {
                    category: category
                });
            }
        });
    });


    // ====================================
    // BUSCA DE ARTIGOS
    // ====================================

    const searchInput = document.getElementById('blogSearch');

    if (searchInput) {
        let searchTimeout;

        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);

            const searchTerm = this.value.toLowerCase().trim();

            // Debounce para não filtrar a cada tecla
            searchTimeout = setTimeout(() => {
                blogCards.forEach(card => {
                    const title = card.querySelector('.blog-card__title a').textContent.toLowerCase();
                    const excerpt = card.querySelector('.blog-card__excerpt').textContent.toLowerCase();
                    const category = card.querySelector('.blog-card__category').textContent.toLowerCase();

                    const matches = title.includes(searchTerm) ||
                                  excerpt.includes(searchTerm) ||
                                  category.includes(searchTerm);

                    if (matches || searchTerm === '') {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeInUp 0.5s ease';
                    } else {
                        card.classList.add('hidden');
                    }
                });

                // Verifica se há resultados
                const visibleCards = document.querySelectorAll('.blog-card:not(.hidden)');

                if (visibleCards.length === 0 && searchTerm !== '') {
                    showNoResultsMessage();
                } else {
                    removeNoResultsMessage();
                }

                // Tracking do Analytics
                if (searchTerm !== '' && typeof gtag !== 'undefined') {
                    gtag('event', 'search_blog', {
                        search_term: searchTerm,
                        results_count: visibleCards.length
                    });
                }
            }, 300);
        });
    }


    // ====================================
    // MENSAGEM DE "SEM RESULTADOS"
    // ====================================

    function showNoResultsMessage() {
        removeNoResultsMessage(); // Remove se já existir

        const blogGrid = document.querySelector('.blog-grid');
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results-message';
        noResultsDiv.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 4rem 2rem;
            color: var(--color-text-light);
        `;
        noResultsDiv.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 1.5rem; opacity: 0.3;">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--color-text-dark);">Nenhum artigo encontrado</h3>
            <p>Tente usar outros termos de busca ou explore nossas categorias.</p>
        `;

        blogGrid.appendChild(noResultsDiv);
    }

    function removeNoResultsMessage() {
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }


    // ====================================
    // PAGINAÇÃO
    // ====================================

    const paginationNumbers = document.querySelectorAll('.pagination-number');
    const prevButton = document.querySelector('.pagination-btn--prev');
    const nextButton = document.querySelector('.pagination-btn--next');

    paginationNumbers.forEach(button => {
        button.addEventListener('click', function() {
            // Atualiza estado ativo
            paginationNumbers.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Scroll suave para o topo da listagem
            const blogFilters = document.querySelector('.blog-filters');
            if (blogFilters) {
                blogFilters.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Tracking do Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'pagination_click', {
                    page_number: this.textContent
                });
            }
        });
    });

    if (prevButton) {
        prevButton.addEventListener('click', function() {
            const activePage = document.querySelector('.pagination-number.active');
            const prevPage = activePage.previousElementSibling;

            if (prevPage && prevPage.classList.contains('pagination-number')) {
                prevPage.click();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const activePage = document.querySelector('.pagination-number.active');
            const nextPage = activePage.nextElementSibling;

            if (nextPage && nextPage.classList.contains('pagination-number')) {
                nextPage.click();
            }
        });
    }


    // ====================================
    // NEWSLETTER FORM
    // ====================================

    const newsletterForm = document.getElementById('blogNewsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            const email = emailInput.value;

            // Desabilita botão durante envio
            submitButton.disabled = true;
            submitButton.textContent = 'Inscrevendo...';

            try {
                const response = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        origem: 'blog'
                    })
                });

                const data = await response.json();

                if (data.success) {
                    // Sucesso
                    emailInput.value = '';
                    showFormMessage(newsletterForm, 'success', 'Inscrição realizada com sucesso! Verifique seu e-mail.');

                    // Tracking do Analytics
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'newsletter_signup', {
                            location: 'blog'
                        });
                    }

                    // Facebook Pixel
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'Lead', { content_name: 'Newsletter Blog' });
                    }
                } else {
                    showFormMessage(newsletterForm, 'error', data.message || 'Erro ao processar inscrição. Tente novamente.');
                }
            } catch (error) {
                console.error('Erro ao enviar newsletter:', error);
                showFormMessage(newsletterForm, 'error', 'Erro ao processar inscrição. Verifique sua conexão e tente novamente.');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Inscrever-se';
            }
        });
    }


    // ====================================
    // FUNÇÃO AUXILIAR - MOSTRAR MENSAGENS
    // ====================================

    function showFormMessage(form, type, message) {
        // Remove mensagem anterior se existir
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message--${type}`;
        messageDiv.style.cssText = `
            margin-top: 1.5rem;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            animation: fadeInUp 0.5s ease;
        `;

        if (type === 'success') {
            messageDiv.style.background = 'rgba(34, 197, 94, 0.1)';
            messageDiv.style.color = '#16a34a';
            messageDiv.style.border = '1px solid rgba(34, 197, 94, 0.3)';
        } else {
            messageDiv.style.background = 'rgba(239, 68, 68, 0.1)';
            messageDiv.style.color = '#dc2626';
            messageDiv.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        }

        messageDiv.textContent = message;
        form.appendChild(messageDiv);

        // Remove mensagem após 5 segundos
        setTimeout(() => {
            messageDiv.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => messageDiv.remove(), 500);
        }, 5000);
    }


    // ====================================
    // SCROLL ANIMATIONS
    // ====================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observa os cards do blog
    blogCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });


    // ====================================
    // TRACKING DE CLIQUES EM ARTIGOS
    // ====================================

    const articleLinks = document.querySelectorAll('.blog-card__link, .blog-card__title a, .featured-post__title a');

    articleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const articleTitle = this.closest('article').querySelector('.blog-card__title a, .featured-post__title a').textContent;
            const articleCategory = this.closest('article').querySelector('.blog-card__category, .post-category').textContent;

            // Tracking do Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'article_click', {
                    article_title: articleTitle,
                    article_category: articleCategory
                });
            }
        });
    });

});
