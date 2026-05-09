// Product data
const PRODUCTS = [
    {
        productId: 1,
        name: "MacBook Pro 14",
        description: "Apple M3 Pro chip, 18GB RAM, 512GB SSD, 14-inch Liquid Retina XDR display. Perfect for professionals.",
        price: 189999,
        imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQwMWlfuFrVBl19Qm7bmEGqJ2NTOMG8AbJ2jltpypWmiIzD_nOAeKiS9YNfieYMIvNCUQVJ_hkz_AFNizrIslbv12wSb_sv9hGMPATFhF8j_GX6AOQ9Kqmnu8WkNg-_k2gnuz2OxVdUKg&usqp=CAc",
        stock: 10,
        category: "Electronics",
        isFeatured: true
    },
    {
        productId: 2,
        name: "iPhone 15 Pro Max",
        description: "6.7-inch Super Retina XDR, A17 Pro chip, 256GB, Titanium design with 48MP camera.",
        price: 149999,
        imageUrl: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS35bZ6pv6iyR1AY3O-VhlgfaqPWqZkyOR7d1h3Os2UTKjWqTs21l1JLTupj3Z-_Y68KgdQMBf-V4XIc4yxroiZruM6ycx02J4bIPjBnpp0H105S5frmQC5uc30vJETJRNV--B-bQ&usqp=CAc",
        stock: 15,
        category: "Electronics",
        isFeatured: true
    },
    {
        productId: 3,
        name: "Sony WH-1000XM5",
        description: "Industry-leading noise cancellation, 30-hour battery life, premium sound quality.",
        price: 29999,
        imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQsXXpuVA6E_9H6LCMDougIJohLXPys2gCLCdIi16n4jGeO-zTu1fJ8eRtjrofRAralzcdPUwmz1N8m18MrWcpJK0o0JdGuGSNsM5Vkouc&usqp=CAc",
        stock: 25,
        category: "Audio",
        isFeatured: true
    },
    {
        productId: 4,
        name: "Logitech MX Master 3S",
        description: "Quiet clicks, 8K DPI any-surface tracking, MagSpeed scroll wheel, ergonomic design.",
        price: 8999,
        imageUrl: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSnuDusKA9MbCtDtLG7ew9wwU90ZShrIfo8jelAgVVaPBOLiAcLncy9dzMRYWGBhHB09Nf35axFoE4U1Al-Lu8aZM6T-Z7MMcRrOdxutWVVgB2u5WXoF1gjMHyMecD04xNhVLELfRg&usqp=CAc",
        stock: 30,
        category: "Accessories",
        isFeatured: false
    },
    {
        productId: 5,
        name: "Samsung Odyssey G9",
        description: "49-inch Dual QHD curved gaming monitor, 240Hz refresh rate, 1ms response time.",
        price: 149999,
        imageUrl: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQvHFew_1P1AsziTSE4ZFHt8IrhvhXDE4KiOTmSr5hAU7bsymNbPhG0RAGR_BfR9sVc7Nmq4q1CMRbgJVbX4rHnz6TnUpPqXbgki-WLnMOQ1L53ghNsCrB52h8G2eJsGiTnYIrV_48gQw&usqp=CAc",
        stock: 5,
        category: "Electronics",
        isFeatured: true
    },
    {
        productId: 6,
        name: "Keychron K2 Pro",
        description: "Wireless mechanical keyboard, hot-swappable, RGB backlight, 4000mAh battery.",
        price: 7999,
        imageUrl: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS0k9ldgTm3IIMUj4h8lhQf5RrZ873d6H7jqLldKch7rMuRcgTNgBod-XKBJx8cm2iLePxv9rkhkZ_lhQwET1EJChilgVw_drH2ewmclxoYbFLzseM_peESFrapdbS99iJhPCHVLw&usqp=CAc",
        stock: 20,
        category: "Accessories",
        isFeatured: false
    },
    {
        productId: 7,
        name: "Apple Watch Ultra 2",
        description: "49mm titanium case, S9 SiP, 100m water resistance, dual-frequency GPS, 36-hour battery.",
        price: 89999,
        imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTfngfC54_VaANwa4iiOe-LGE14kJr6WMTrdhS2HISHKnaWX8CxJ3fVseZ1pNvBje1IBoxiIMrpuOOin7476I5SAz8MYxtcFzigaDjYPb9AhYNTwnO8xJha9TsMgtb_f8hem6o4V7cu&usqp=CAc",
        stock: 12,
        category: "Electronics",
        isFeatured: true
    },
    {
        productId: 8,
        name: "iPad Pro 12.9\"",
        description: "M2 chip, Liquid Retina XDR display, 256GB storage, Wi-Fi 6E, Apple Pencil hover support.",
        price: 119999,
        imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRN1-y92i_YxXUXoI77zuCjwxvFlDFQ-tmkUKL-0lrYqmKX_G_t0uDZFS_LC4YrVtUMuPYF6SHRwquKCeqn7OHsoCWVUoPfg-xOx7e_PqnyapwpXcK5iRzQuczW2xLtIowEO8HSeUM&usqp=CAc",
        stock: 8,
        category: "Electronics",
        isFeatured: false
    }
];

// Display products
function displayProducts(products, containerId) {
    const container = $(containerId);
    if (!container.length) {
        console.log('Container not found:', containerId);
        return;
    }
    
    if (!products || products.length === 0) {
        container.html('<div class="col-12 text-center py-5"><h4>No products found</h4></div>');
        return;
    }
    
    let html = '<div class="row g-4">';
    products.forEach(product => {
        html += `
            <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="product-card bg-white rounded-4 overflow-hidden shadow-sm h-100" style="cursor: pointer;" data-product-id="${product.productId}">
                    <img src="${product.imageUrl}" 
                         alt="${product.name}" 
                         loading="lazy" 
                         style="height: 250px; width: 100%; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
                    <div class="card-body p-4">
                        <h5 class="product-title fw-bold mb-2">${product.name.length > 40 ? product.name.substring(0, 40) + '...' : product.name}</h5>
                        <p class="text-muted small mb-2">${product.category || 'General'}</p>
                        <p class="product-price text-primary fw-bold fs-4 mb-3">${formatPrice(product.price)}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary-custom flex-grow-1 add-to-cart-btn" data-id="${product.productId}">
                                <i class="bi bi-cart-plus"></i> Add to Cart
                            </button>
                            <button class="btn btn-outline-secondary view-details-btn" data-id="${product.productId}">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    container.html(html);
    
    // Bind events
    $('.add-to-cart-btn').off('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = parseInt($(this).data('id'));
        const product = PRODUCTS.find(p => p.productId === productId);
        if (product) {
            addToCart(product);
        }
    });
    
    $('.view-details-btn').off('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const productId = parseInt($(this).data('id'));
        if (productId) {
            localStorage.setItem('selectedProductId', productId);
            window.location.href = 'product-details.html';
        }
    });
    
    $('.product-card').off('click').on('click', function(e) {
        if ($(e.target).closest('.add-to-cart-btn, .view-details-btn').length) return;
        const productId = $(this).data('product-id');
        if (productId) {
            localStorage.setItem('selectedProductId', productId);
            window.location.href = 'product-details.html';
        }
    });
}

// Display featured products
function displayFeaturedProducts() {
    console.log('Displaying featured products...');
    const featured = PRODUCTS.filter(p => p.isFeatured === true);
    displayProducts(featured, '#featuredProducts');
}

// Display all products
function displayAllProducts() {
    displayProducts(PRODUCTS, '#allProducts');
}

// Load product details
function loadProductDetails() {
    const productId = localStorage.getItem('selectedProductId');
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    const product = PRODUCTS.find(p => p.productId === parseInt(productId));
    if (!product) {
        showToast('Product not found', 'error');
        window.location.href = 'products.html';
        return;
    }
    
    // Display product details
    $('#productImage').attr('src', product.imageUrl);
    $('#productName').text(product.name);
    $('#productPrice').text(formatPrice(product.price));
    $('#productDescription').text(product.description);
    $('#productStock').html(`<span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">${product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}</span>`);
    
    if (product.stock === 0) {
        $('#addToCartBtn').prop('disabled', true).html('<i class="bi bi-cart-x"></i> Out of Stock');
    }
    
    // Store product for cart operations
    window.currentProduct = product;
    
    // Bind quantity buttons
    $('#decreaseQty').off('click').on('click', function() {
        let qty = parseInt($('#quantity').val());
        if (qty > 1) {
            $('#quantity').val(qty - 1);
        }
    });
    
    $('#increaseQty').off('click').on('click', function() {
        let qty = parseInt($('#quantity').val());
        if (product.stock > 0 && qty < product.stock) {
            $('#quantity').val(qty + 1);
        } else if (product.stock > 0) {
            showToast(`Only ${product.stock} items available`, 'warning');
        }
    });
    
    $('#addToCartBtn').off('click').on('click', function() {
        if (window.currentProduct && window.currentProduct.stock > 0) {
            const quantity = parseInt($('#quantity').val()) || 1;
            addToCart(window.currentProduct, quantity);
        }
    });
    
    $('#buyNowBtn').off('click').on('click', function() {
        if (window.currentProduct && window.currentProduct.stock > 0) {
            const quantity = parseInt($('#quantity').val()) || 1;
            addToCart(window.currentProduct, quantity);
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 500);
        }
    });
}

// Initialize products page
$(document).ready(function() {
    if ($('#featuredProducts').length) {
        displayFeaturedProducts();
    }
    if ($('#allProducts').length) {
        displayAllProducts();
    }
    if ($('#productImage').length) {
        loadProductDetails();
    }
});