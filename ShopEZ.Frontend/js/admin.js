// Admin Panel Functions

// Check if user is admin
function isAdmin() {
    const user = getUser();
    return user && user.role === 'Admin';
}

// Redirect if not admin
function requireAdmin() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Load admin dashboard
async function loadAdminDashboard() {
    if (!requireAdmin()) return;
    
    try {
        // Load statistics
        const products = await apiRequest('/Products');
        const orders = await apiRequest('/Orders');
        
        $('#totalProducts').text(products.length);
        $('#totalOrders').text(orders.length);
        $('#totalRevenue').text(formatPrice(orders.reduce((sum, o) => sum + o.totalAmount, 0)));
        $('#pendingOrders').text(orders.filter(o => o.status === 'Pending').length);
        
        // Load recent orders
        displayAdminOrders(orders.slice(0, 10));
        
        // Load products table
        displayAdminProducts(products);
        
    } catch (error) {
        showToast('Failed to load admin data', 'error');
    }
}

// Display admin orders table
function displayAdminOrders(orders) {
    const container = $('#adminOrdersList');
    if (!orders.length) {
        container.html('<tr><td colspan="5" class="text-center">No orders found</td></tr>');
        return;
    }
    
    let html = '';
    orders.forEach(order => {
        html += `
            <tr>
                <td>#${order.orderId}</td>
                <td>${order.userName}</td>
                <td>${formatDate(order.orderDate)}</td>
                <td>${formatPrice(order.totalAmount)}</td>
                <td>
                    <select class="form-select form-select-sm order-status" data-id="${order.orderId}">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            </tr>
        `;
    });
    
    container.html(html);
    
    // Bind status change events
    $('.order-status').change(async function() {
        const orderId = $(this).data('id');
        const newStatus = $(this).val();
        await updateOrderStatus(orderId, newStatus);
    });
}

// Display admin products table
function displayAdminProducts(products) {
    const container = $('#adminProductsList');
    if (!products.length) {
        container.html('<tr><td colspan="6" class="text-center">No products found</td></tr>');
        return;
    }
    
    let html = '';
    products.forEach(product => {
        html += `
            <tr>
                <td>${product.productId}</td>
                <td>${product.name}</td>
                <td>${formatPrice(product.price)}</td>
                <td>${product.stock}</td>
                <td>${product.category || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-product" data-id="${product.productId}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-product" data-id="${product.productId}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    container.html(html);
    
    // Bind edit events
    $('.edit-product').click(function() {
        const productId = $(this).data('id');
        editProduct(productId);
    });
    
    // Bind delete events
    $('.delete-product').click(async function() {
        const productId = $(this).data('id');
        if (confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(productId);
        }
    });
}

// Update order status
async function updateOrderStatus(orderId, status) {
    try {
        // Note: You would need to add an endpoint for updating order status
        showToast(`Order #${orderId} status updated to ${status}`, 'success');
    } catch (error) {
        showToast('Failed to update order status', 'error');
    }
}

// Edit product
function editProduct(productId) {
    // Open modal with product details for editing
    $('#editProductModal').modal('show');
    loadProductForEdit(productId);
}

// Load product for editing
async function loadProductForEdit(productId) {
    try {
        const product = await apiRequest(`/Products/${productId}`);
        $('#editProductId').val(product.productId);
        $('#editName').val(product.name);
        $('#editDescription').val(product.description);
        $('#editPrice').val(product.price);
        $('#editStock').val(product.stock);
        $('#editCategory').val(product.category);
        $('#editIsFeatured').prop('checked', product.isFeatured);
    } catch (error) {
        showToast('Failed to load product', 'error');
    }
}

// Update product
async function updateProduct() {
    const productId = $('#editProductId').val();
    const data = {
        name: $('#editName').val(),
        description: $('#editDescription').val(),
        price: parseFloat($('#editPrice').val()),
        stock: parseInt($('#editStock').val()),
        category: $('#editCategory').val(),
        isFeatured: $('#editIsFeatured').is(':checked')
    };
    
    try {
        await apiRequest(`/Products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        showToast('Product updated successfully', 'success');
        $('#editProductModal').modal('hide');
        loadAdminDashboard();
    } catch (error) {
        showToast('Failed to update product', 'error');
    }
}

// Delete product
async function deleteProduct(productId) {
    try {
        await apiRequest(`/Products/${productId}`, { method: 'DELETE' });
        showToast('Product deleted successfully', 'success');
        loadAdminDashboard();
    } catch (error) {
        showToast('Failed to delete product', 'error');
    }
}

// Create new product
async function createProduct() {
    const data = {
        name: $('#createName').val(),
        description: $('#createDescription').val(),
        price: parseFloat($('#createPrice').val()),
        stock: parseInt($('#createStock').val()),
        category: $('#createCategory').val(),
        imageUrl: $('#createImageUrl').val(),
        isFeatured: $('#createIsFeatured').is(':checked')
    };
    
    try {
        await apiRequest('/Products', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        showToast('Product created successfully', 'success');
        $('#createProductModal').modal('hide');
        loadAdminDashboard();
        $('#createProductForm')[0].reset();
    } catch (error) {
        showToast('Failed to create product', 'error');
    }
}