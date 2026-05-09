// Dashboard - My Orders

// Load and display user orders
function loadUserOrders() {
    console.log('=== Loading User Orders ===');
    
    // Get current user
    const currentUser = getCurrentUser();
    console.log('Current User:', currentUser);
    
    if (!currentUser) {
        console.log('No user logged in');
        $('#ordersList').html(`
            <div class="text-center py-5">
                <i class="bi bi-exclamation-triangle fs-1 text-warning"></i>
                <h5 class="mt-3">Please Login</h5>
                <p class="text-muted">You need to be logged in to view your orders</p>
                <a href="login.html" class="btn btn-primary-custom mt-3">Login Now</a>
            </div>
        `);
        return;
    }
    
    // Get all orders from localStorage
    const allOrders = JSON.parse(localStorage.getItem('shopez_orders') || '[]');
    console.log('All orders in storage:', allOrders);
    console.log('Total orders found:', allOrders.length);
    
    // Filter orders for current user by email OR userId
    const userOrders = allOrders.filter(order => {
        // Check multiple conditions for user match
        const matchByEmail = order.customer && order.customer.email === currentUser.email;
        const matchByUserId = order.userId === currentUser.id;
        const matchByUserEmail = order.userEmail === currentUser.email;
        
        return matchByEmail || matchByUserId || matchByUserEmail;
    });
    
    console.log('Filtered orders for user:', userOrders);
    console.log('User orders count:', userOrders.length);
    
    const container = $('#ordersList');
    
    if (!userOrders || userOrders.length === 0) {
        console.log('No orders found for this user');
        container.html(`
            <div class="text-center py-5">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <h5 class="mt-3">No orders yet</h5>
                <p class="text-muted">You haven't placed any orders yet.</p>
                <a href="products.html" class="btn btn-primary-custom mt-3">Start Shopping</a>
            </div>
        `);
        return;
    }
    
    // Display orders
    let html = '';
    userOrders.forEach((order, index) => {
        console.log(`Rendering order ${index + 1}:`, order.orderId);
        
        html += `
            <div class="card mb-4 shadow-sm order-card" data-order-id="${order.orderId}">
                <div class="card-header bg-light">
                    <div class="row align-items-center">
                        <div class="col-md-4">
                            <strong><i class="bi bi-receipt"></i> Order #${order.orderId}</strong>
                        </div>
                        <div class="col-md-3">
                            <i class="bi bi-calendar3"></i> ${new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div class="col-md-3">
                            <span class="badge bg-success">${order.status || 'Confirmed'}</span>
                        </div>
                        <div class="col-md-2 text-end">
                            <button class="btn btn-sm btn-outline-primary view-order-details" data-order-id="${order.orderId}">
                                <i class="bi bi-eye"></i> View Details
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-7">
                            <h6 class="mb-2 fw-bold">Items Ordered:</h6>
                            ${order.items.map(item => `
                                <div class="d-flex justify-content-between mb-2">
                                    <div>
                                        <span class="fw-bold">${item.name}</span>
                                        <br>
                                        <small class="text-muted">Qty: ${item.quantity} × ${formatPrice(item.price)}</small>
                                    </div>
                                    <div class="fw-bold">${formatPrice(item.price * item.quantity)}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="col-md-5 text-end">
                            <h6 class="mb-2">Order Total</h6>
                            <h3 class="text-primary mb-2">${formatPrice(order.total)}</h3>
                            <small class="text-muted">Paid via ${order.customer.paymentMethod}</small>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-white">
                    <div class="row">
                        <div class="col-md-8">
                            <i class="bi bi-geo-alt"></i> Shipping to: ${order.customer.address}, ${order.customer.city}
                        </div>
                        <div class="col-md-4 text-md-end">
                            <i class="bi bi-envelope"></i> ${order.customer.email}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.html(html);
    console.log('Orders displayed successfully');
    
    // Bind view details events
    $('.view-order-details').off('click').on('click', function() {
        const orderId = $(this).data('order-id');
        console.log('View details clicked for order:', orderId);
        showOrderDetails(orderId);
    });
}

// Show order details modal
function showOrderDetails(orderId) {
    console.log('Showing order details for:', orderId);
    
    const allOrders = JSON.parse(localStorage.getItem('shopez_orders') || '[]');
    const order = allOrders.find(o => o.orderId === orderId);
    
    if (!order) {
        console.error('Order not found:', orderId);
        showToast('Order not found', 'error');
        return;
    }
    
    console.log('Order found:', order);
    
    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <div>
                    <h6 class="mb-1 fw-bold">${item.name}</h6>
                    <small class="text-muted">Quantity: ${item.quantity} × ${formatPrice(item.price)}</small>
                </div>
                <div class="fw-bold fs-5">${formatPrice(item.price * item.quantity)}</div>
            </div>
        `;
    });
    
    const modalHtml = `
        <div class="modal fade" id="orderDetailsModal" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-receipt"></i> Order Details - ${order.orderId}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <div class="card bg-light">
                                    <div class="card-body">
                                        <h6 class="fw-bold mb-3">Order Information</h6>
                                        <p class="mb-2"><strong>Order ID:</strong> ${order.orderId}</p>
                                        <p class="mb-2"><strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                                        <p class="mb-0"><strong>Status:</strong> <span class="badge bg-success">${order.status || 'Confirmed'}</span></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card bg-light">
                                    <div class="card-body">
                                        <h6 class="fw-bold mb-3">Payment Information</h6>
                                        <p class="mb-2"><strong>Method:</strong> ${order.customer.paymentMethod}</p>
                                        <p class="mb-2"><strong>Amount Paid:</strong> ${formatPrice(order.total)}</p>
                                        <p class="mb-0"><strong>Status:</strong> <span class="badge bg-success">Paid</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <h6 class="fw-bold mb-3">Order Items</h6>
                        <div class="bg-light p-3 rounded mb-4">
                            ${itemsHtml}
                            <hr class="my-3">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal</span>
                                <span class="fw-bold">${formatPrice(order.subtotal)}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Shipping</span>
                                <span class="fw-bold">${order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Tax (18% GST)</span>
                                <span class="fw-bold">${formatPrice(order.tax)}</span>
                            </div>
                            <hr class="my-2">
                            <div class="d-flex justify-content-between fw-bold fs-4 text-primary">
                                <span>Total</span>
                                <span>${formatPrice(order.total)}</span>
                            </div>
                        </div>
                        
                        <h6 class="fw-bold mb-2">Shipping Address</h6>
                        <div class="bg-light p-3 rounded">
                            <p class="mb-2"><strong>${order.customer.name}</strong></p>
                            <p class="mb-2"><i class="bi bi-envelope"></i> ${order.customer.email}</p>
                            <p class="mb-2"><i class="bi bi-phone"></i> ${order.customer.phone}</p>
                            <p class="mb-0"><i class="bi bi-geo-alt"></i> ${order.customer.address}, ${order.customer.city}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary-custom" onclick="window.print()">
                            <i class="bi bi-printer"></i> Print Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    $('#orderDetailsModal').remove();
    
    $('body').append(modalHtml);
    const modal = new bootstrap.Modal($('#orderDetailsModal')[0]);
    modal.show();
    
    $('#orderDetailsModal').off('hidden.bs.modal').on('hidden.bs.modal', function() {
        $('#orderDetailsModal').remove();
    });
}

// Initialize dashboard
$(document).ready(function() {
    console.log('=== Dashboard Initializing ===');
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        console.log('User not logged in, redirecting to login');
        showToast('Please login to view your dashboard', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    const user = getCurrentUser();
    console.log('Current user:', user);
    
    // Update user info
    $('#userName').text(user?.name || 'User');
    $('#userEmail').text(user?.email || '');
    $('#profileName').val(user?.name || '');
    $('#profileEmail').val(user?.email || '');
    $('#profileSince').val(new Date().toLocaleDateString());
    
    // Load orders
    loadUserOrders();
    
    // Tab switching
    $('#ordersTab').off('click').on('click', function(e) {
        e.preventDefault();
        console.log('Orders tab clicked');
        $('#ordersPanel').show();
        $('#profilePanel').hide();
        $(this).addClass('active');
        $('#profileTab').removeClass('active');
        loadUserOrders(); // Refresh orders when clicking tab
    });
    
    $('#profileTab').off('click').on('click', function(e) {
        e.preventDefault();
        console.log('Profile tab clicked');
        $('#ordersPanel').hide();
        $('#profilePanel').show();
        $(this).addClass('active');
        $('#ordersTab').removeClass('active');
    });
});

// Debug function to check orders (add to browser console)
window.checkOrders = function() {
    const orders = JSON.parse(localStorage.getItem('shopez_orders') || '[]');
    console.log('=== All Orders in Storage ===');
    console.log('Total orders:', orders.length);
    console.log('Orders:', orders);
    return orders;
};

// Clear all orders (for testing)
window.clearAllOrders = function() {
    if (confirm('Are you sure you want to clear ALL orders?')) {
        localStorage.removeItem('shopez_orders');
        console.log('All orders cleared');
        showToast('All orders cleared', 'info');
        if (window.location.pathname.includes('dashboard.html')) {
            loadUserOrders();
        }
    }
};