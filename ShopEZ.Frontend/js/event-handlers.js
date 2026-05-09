// Global Event Handlers

// Handle scroll events for navbar
$(window).scroll(throttle(function() {
    const scrollTop = $(this).scrollTop();
    if (scrollTop > 100) {
        $('.navbar').addClass('navbar-shrink');
    } else {
        $('.navbar').removeClass('navbar-shrink');
    }
}, 100));

// Handle escape key to close modals
$(document).keydown(function(e) {
    if (e.key === 'Escape') {
        $('.modal').modal('hide');
    }
});

// Handle click outside to close dropdowns
$(document).click(function(event) {
    if (!$(event.target).closest('.dropdown').length) {
        $('.dropdown-menu').removeClass('show');
    }
});

// Handle back button
window.addEventListener('popstate', function(event) {
    location.reload();
});

// Handle online/offline status
window.addEventListener('online', function() {
    showToast('Back online!', 'success');
    location.reload();
});

window.addEventListener('offline', function() {
    showToast('You are offline. Please check your connection.', 'error');
});

// Handle before unload (warn if cart has items)
let cartWarningEnabled = true;
window.addEventListener('beforeunload', function(e) {
    if (cartWarningEnabled && getCart().length > 0) {
        e.preventDefault();
        e.returnValue = 'You have items in your cart. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Disable cart warning on checkout
function disableCartWarning() {
    cartWarningEnabled = false;
}

// Enable cart warning
function enableCartWarning() {
    cartWarningEnabled = true;
}

// Handle image loading errors
function handleImageError(imgElement) {
    $(imgElement).attr('src', 'https://via.placeholder.com/400x400?text=No+Image');
}

// Handle form submissions with loading state
function handleFormSubmit(formId, submitHandler) {
    $(formId).submit(async function(e) {
        e.preventDefault();
        
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        
        try {
            submitBtn.prop('disabled', true);
            submitBtn.html('<span class="spinner-border spinner-border-sm me-2"></span> Processing...');
            
            await submitHandler($(this));
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            submitBtn.prop('disabled', false);
            submitBtn.html(originalText);
        }
    });
}

// Handle quantity buttons
function initQuantityButtons(container) {
    $(container).find('.decrease-qty').click(function() {
        const input = $(this).siblings('.quantity-input');
        let value = parseInt(input.val());
        if (value > 1) {
            input.val(value - 1).trigger('change');
        }
    });
    
    $(container).find('.increase-qty').click(function() {
        const input = $(this).siblings('.quantity-input');
        let value = parseInt(input.val());
        const max = input.data('max') || 999;
        if (value < max) {
            input.val(value + 1).trigger('change');
        }
    });
    
    $(container).find('.quantity-input').change(function() {
        let value = parseInt($(this).val());
        const min = 1;
        const max = $(this).data('max') || 999;
        
        if (isNaN(value) || value < min) {
            value = min;
        } else if (value > max) {
            value = max;
            showToast(`Maximum ${max} items allowed`, 'warning');
        }
        
        $(this).val(value);
    });
}

// Handle lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        $('img[data-src]').each(function() {
            $(this).attr('src', $(this).data('src'));
        });
    }
}

// Handle infinite scroll for products
let isLoadingMore = false;
let currentPage = 1;
const pageSize = 12;

function initInfiniteScroll(loadMoreCallback) {
    $(window).scroll(throttle(async function() {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 500) {
            if (!isLoadingMore) {
                isLoadingMore = true;
                currentPage++;
                await loadMoreCallback(currentPage);
                isLoadingMore = false;
            }
        }
    }, 500));
}