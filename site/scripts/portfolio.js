/* ========================================
   PORTFÓLIO - JAVASCRIPT
   Versão: 1.0
   ======================================== */

'use strict';

// ========================================
// 1. PORTFOLIO FILTER SYSTEM
// ========================================

const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const searchInput = document.getElementById('portfolio-search');
const resultsCount = document.getElementById('results-count');
const emptyState = document.getElementById('empty-state');
const portfolioGrid = document.getElementById('portfolio-grid');

let currentFilter = 'all';
let currentSearchTerm = '';

// Filter by category
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Get filter value
        currentFilter = this.getAttribute('data-filter');

        // Apply filter
        applyFilters();

        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'filter_portfolio', {
                'event_category': 'Portfolio',
                'event_label': currentFilter
            });
        }
    });
});

// Search functionality
if (searchInput) {
    let searchTimeout;

    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            currentSearchTerm = e.target.value.toLowerCase().trim();
            applyFilters();

            // Track search
            if (currentSearchTerm && typeof gtag !== 'undefined') {
                gtag('event', 'search_portfolio', {
                    'event_category': 'Portfolio',
                    'event_label': currentSearchTerm
                });
            }
        }, 300); // Debounce search
    });
}

function applyFilters() {
    let visibleCount = 0;

    portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const tags = item.getAttribute('data-tags') || '';
        const title = item.querySelector('.portfolio-item__title')?.textContent.toLowerCase() || '';
        const description = item.querySelector('.portfolio-item__description')?.textContent.toLowerCase() || '';

        // Check category filter
        const categoryMatch = currentFilter === 'all' || category === currentFilter;

        // Check search term
        const searchMatch = !currentSearchTerm ||
            title.includes(currentSearchTerm) ||
            description.includes(currentSearchTerm) ||
            tags.includes(currentSearchTerm);

        // Show/hide item
        if (categoryMatch && searchMatch) {
            item.classList.remove('hidden', 'filtering-out');
            item.classList.add('filtering-in');
            visibleCount++;

            // Remove animation class after animation completes
            setTimeout(() => {
                item.classList.remove('filtering-in');
            }, 400);
        } else {
            item.classList.add('filtering-out');

            setTimeout(() => {
                item.classList.add('hidden');
                item.classList.remove('filtering-out');
            }, 300);
        }
    });

    // Update count
    if (resultsCount) {
        resultsCount.textContent = visibleCount;
    }

    // Show/hide empty state
    if (emptyState) {
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
            portfolioGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            portfolioGrid.style.display = 'grid';
        }
    }
}

// Reset filters
const resetFiltersBtn = document.getElementById('reset-filters-btn');
if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
        // Reset filter buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        filterButtons[0]?.classList.add('active'); // Activate "Todos"

        // Reset search
        if (searchInput) {
            searchInput.value = '';
        }

        // Reset values
        currentFilter = 'all';
        currentSearchTerm = '';

        // Apply filters
        applyFilters();
    });
}

// ========================================
// 2. LOAD MORE FUNCTIONALITY
// ========================================

const loadMoreBtn = document.getElementById('load-more-btn');
let itemsToShow = 12; // Initial number of items to show
let currentlyShowing = 8; // Currently visible items

if (loadMoreBtn) {
    // Initially hide items beyond currentlyShowing
    portfolioItems.forEach((item, index) => {
        if (index >= currentlyShowing) {
            item.style.display = 'none';
        }
    });

    loadMoreBtn.addEventListener('click', function() {
        const hiddenItems = Array.from(portfolioItems).filter(item =>
            item.style.display === 'none' && !item.classList.contains('hidden')
        );

        // Show next batch
        hiddenItems.slice(0, itemsToShow).forEach((item, index) => {
            setTimeout(() => {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }, index * 50);
        });

        currentlyShowing += itemsToShow;

        // Hide button if no more items
        if (currentlyShowing >= portfolioItems.length) {
            loadMoreBtn.style.display = 'none';
        }

        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'load_more', {
                'event_category': 'Portfolio',
                'event_label': 'Load More Projects'
            });
        }
    });
}

// ========================================
// 3. LAZY LOADING IMAGES
// ========================================

const portfolioImages = document.querySelectorAll('.portfolio-item__image img');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const container = img.closest('.portfolio-item__image');

            if (container) {
                container.classList.add('loading');
            }

            // Load image
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }

            img.addEventListener('load', () => {
                if (container) {
                    container.classList.remove('loading');
                }
            });

            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

portfolioImages.forEach(img => {
    imageObserver.observe(img);
});

// ========================================
// 4. PORTFOLIO ITEM TRACKING
// ========================================

portfolioItems.forEach(item => {
    const link = item.querySelector('.portfolio-item__link');

    if (link) {
        link.addEventListener('click', function(e) {
            const title = item.querySelector('.portfolio-item__title')?.textContent || '';
            const category = item.getAttribute('data-category') || '';

            // Track click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click_portfolio_item', {
                    'event_category': 'Portfolio',
                    'event_label': `${category} - ${title}`
                });
            }

            if (typeof fbq !== 'undefined') {
                fbq('track', 'ViewContent', {
                    content_name: title,
                    content_category: category,
                    content_type: 'portfolio_item'
                });
            }
        });
    }
});

// ========================================
// 5. SMOOTH SCROLL TO GRID
// ========================================

// When filter changes, scroll to grid if needed
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Check if portfolio grid is not in viewport
        const gridRect = portfolioGrid.getBoundingClientRect();
        const isInViewport = gridRect.top >= 0 && gridRect.top <= window.innerHeight;

        if (!isInViewport && window.pageYOffset > 300) {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const filtersSection = document.querySelector('.portfolio-filters');
            const filtersHeight = filtersSection ? filtersSection.offsetHeight : 0;
            const targetPosition = filtersSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// 6. KEYBOARD NAVIGATION
// ========================================

// Arrow key navigation for portfolio items
let currentFocusIndex = -1;
const focusableItems = Array.from(document.querySelectorAll('.portfolio-item__link'));

document.addEventListener('keydown', (e) => {
    // Only activate when a portfolio item is focused
    if (!document.activeElement.classList.contains('portfolio-item__link')) {
        return;
    }

    const visibleItems = focusableItems.filter(item =>
        !item.closest('.portfolio-item').classList.contains('hidden')
    );

    currentFocusIndex = visibleItems.indexOf(document.activeElement);

    let nextIndex = currentFocusIndex;

    switch(e.key) {
        case 'ArrowRight':
            e.preventDefault();
            nextIndex = Math.min(currentFocusIndex + 1, visibleItems.length - 1);
            break;
        case 'ArrowLeft':
            e.preventDefault();
            nextIndex = Math.max(currentFocusIndex - 1, 0);
            break;
        case 'ArrowDown':
            e.preventDefault();
            // Move down one row (assuming 3 columns)
            nextIndex = Math.min(currentFocusIndex + 3, visibleItems.length - 1);
            break;
        case 'ArrowUp':
            e.preventDefault();
            // Move up one row
            nextIndex = Math.max(currentFocusIndex - 3, 0);
            break;
    }

    if (nextIndex !== currentFocusIndex) {
        visibleItems[nextIndex]?.focus();
    }
});

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
                body: JSON.stringify({ email, origem: 'Página Portfólio' })
            });

            if (response.ok) {
                showSuccessMessage('Obrigado! Você foi inscrito na nossa newsletter.');
                newsletterForm.reset();

                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        'event_category': 'Newsletter',
                        'event_label': 'Página Portfólio'
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
// 8. URL PARAMETERS FOR FILTERING
// ========================================

// Support URL parameters like ?category=residencial
function applyURLFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');

    if (categoryParam) {
        const filterBtn = document.querySelector(`[data-filter="${categoryParam}"]`);
        if (filterBtn) {
            filterBtn.click();
        }
    }

    if (searchParam && searchInput) {
        searchInput.value = searchParam;
        currentSearchTerm = searchParam.toLowerCase();
        applyFilters();
    }
}

// Apply URL filters on page load
applyURLFilters();

// Update URL when filter changes
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');

        if (filter !== 'all') {
            const url = new URL(window.location);
            url.searchParams.set('category', filter);
            window.history.pushState({}, '', url);
        } else {
            const url = new URL(window.location);
            url.searchParams.delete('category');
            window.history.pushState({}, '', url);
        }
    });
});

// ========================================
// 9. MASONRY LAYOUT TOGGLE (OPTIONAL)
// ========================================

// Add button to toggle between grid and masonry layouts
const layoutToggleBtn = document.createElement('button');
layoutToggleBtn.className = 'layout-toggle-btn';
layoutToggleBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
    </svg>
`;
layoutToggleBtn.title = 'Alternar Layout';

// Add styles
const layoutToggleStyle = document.createElement('style');
layoutToggleStyle.textContent = `
    .layout-toggle-btn {
        position: fixed;
        bottom: 100px;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: var(--color-white);
        border: 2px solid var(--color-border);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: all var(--transition-normal);
        z-index: 99;
    }

    .layout-toggle-btn:hover {
        background: var(--color-secondary);
        border-color: var(--color-secondary);
    }

    .layout-toggle-btn:hover svg {
        stroke: var(--color-white);
    }

    @media (max-width: 768px) {
        .layout-toggle-btn {
            display: none;
        }
    }
`;

document.head.appendChild(layoutToggleStyle);
document.body.appendChild(layoutToggleBtn);

layoutToggleBtn.addEventListener('click', () => {
    portfolioGrid.classList.toggle('masonry');

    // Track toggle
    if (typeof gtag !== 'undefined') {
        const layout = portfolioGrid.classList.contains('masonry') ? 'masonry' : 'grid';
        gtag('event', 'toggle_layout', {
            'event_category': 'Portfolio',
            'event_label': layout
        });
    }
});

// ========================================
// 10. UTILITY FUNCTIONS
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
// 11. PAGE LOAD TRACKING
// ========================================

// Track page view
if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
        'page_title': 'Portfólio',
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
            'event_label': 'Portfólio',
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
// 12. PERFORMANCE OPTIMIZATION
// ========================================

// Defer non-critical animations on slower devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    document.body.classList.add('low-performance');

    const lowPerfStyle = document.createElement('style');
    lowPerfStyle.textContent = `
        .low-performance .portfolio-item,
        .low-performance .portfolio-item__image img {
            animation: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(lowPerfStyle);
}

// ========================================
// 13. CONSOLE MESSAGE
// ========================================

console.log(
    '%c📸 Portfólio Toldo Vela - Projetos que Transformam',
    'font-size: 16px; font-weight: bold; color: #1A4D5C;'
);
console.log(
    '%c500+ projetos executados em todo o Brasil',
    'font-size: 12px; color: #FF6B35;'
);
