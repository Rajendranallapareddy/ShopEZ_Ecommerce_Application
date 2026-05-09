// Form Validation Functions

// Validate required fields
function validateRequired(value, fieldName) {
    if (!value || value.trim() === '') {
        return `${fieldName} is required`;
    }
    return null;
}

// Validate email
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return 'Email is required';
    }
    if (!isValidEmail(email)) {
        return 'Please enter a valid email address';
    }
    return null;
}

// Validate phone
function validatePhone(phone) {
    if (!phone || phone.trim() === '') {
        return 'Phone number is required';
    }
    if (!isValidPhone(phone)) {
        return 'Please enter a valid 10-digit phone number';
    }
    return null;
}

// Validate password
function validatePassword(password, fieldName = 'Password') {
    if (!password || password === '') {
        return `${fieldName} is required`;
    }
    if (password.length < 6) {
        return `${fieldName} must be at least 6 characters`;
    }
    return null;
}

// Validate confirm password
function validateConfirmPassword(password, confirmPassword) {
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return null;
}

// Validate product quantity
function validateQuantity(quantity, stock) {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
        return 'Quantity must be at least 1';
    }
    if (stock !== undefined && qty > stock) {
        return `Only ${stock} items available in stock`;
    }
    return null;
}

// Validate checkout form
function validateCheckoutForm(data) {
    const errors = {};
    
    const nameError = validateRequired(data.name, 'Full name');
    if (nameError) errors.name = nameError;
    
    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.phone = phoneError;
    
    const addressError = validateRequired(data.address, 'Delivery address');
    if (addressError) errors.address = addressError;
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Validate registration form
function validateRegistrationForm(data) {
    const errors = {};
    
    const nameError = validateRequired(data.name, 'Full name');
    if (nameError) errors.name = nameError;
    
    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;
    
    const confirmError = validateConfirmPassword(data.password, data.confirmPassword);
    if (confirmError) errors.confirmPassword = confirmError;
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Validate login form
function validateLoginForm(data) {
    const errors = {};
    
    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validateRequired(data.password, 'Password');
    if (passwordError) errors.password = passwordError;
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Show validation errors on form
function showValidationErrors(errors, formId) {
    // Clear existing errors
    $(`${formId} .is-invalid`).removeClass('is-invalid');
    $(`${formId} .invalid-feedback`).remove();
    
    // Show new errors
    Object.keys(errors).forEach(field => {
        const input = $(`${formId} #${field}`);
        input.addClass('is-invalid');
        input.after(`<div class="invalid-feedback">${errors[field]}</div>`);
    });
}

// Clear validation errors
function clearValidationErrors(formId) {
    $(`${formId} .is-invalid`).removeClass('is-invalid');
    $(`${formId} .invalid-feedback`).remove();
}

// Validate product form (for admin)
function validateProductForm(data) {
    const errors = {};
    
    const nameError = validateRequired(data.name, 'Product name');
    if (nameError) errors.name = nameError;
    
    if (data.price && (isNaN(data.price) || data.price <= 0)) {
        errors.price = 'Price must be greater than 0';
    }
    
    if (data.stock !== undefined && (isNaN(data.stock) || data.stock < 0)) {
        errors.stock = 'Stock cannot be negative';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}