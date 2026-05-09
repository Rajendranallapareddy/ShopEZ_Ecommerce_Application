// Mock user database
const MOCK_USERS = [
    {
        id: 1,
        name: "John Customer",
        email: "john@example.com",
        password: "customer123",
        role: "Customer"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        password: "customer123",
        role: "Customer"
    },
    {
        id: 3,
        name: "Admin User",
        email: "admin@shopez.com",
        password: "admin123",
        role: "Admin"
    }
];

// Login function
async function login(email, password) {
    try {
        showLoading();
        
        // Find user
        const user = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Create mock token
            const mockToken = btoa(JSON.stringify({ 
                id: user.id, 
                email: user.email, 
                exp: Date.now() + 86400000 
            }));
            
            // Store user data
            localStorage.setItem('shopez_token', mockToken);
            localStorage.setItem('shopez_user', JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }));
            localStorage.setItem('shopez_cart', JSON.stringify([]));
            
            showToast(`Welcome back, ${user.name}!`, 'success');
            
            // Update navigation immediately
            updateNav();
            updateCartCount();
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showToast('Invalid email or password. Try: john@example.com / customer123', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Login failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Register function
async function register(name, email, password, confirmPassword) {
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Check if email already exists
    if (MOCK_USERS.find(u => u.email === email)) {
        showToast('Email already registered. Please login.', 'error');
        return;
    }
    
    try {
        showLoading();
        
        // Create new user
        const newUser = {
            id: MOCK_USERS.length + 1,
            name: name,
            email: email,
            password: password,
            role: "Customer"
        };
        
        MOCK_USERS.push(newUser);
        
        // Create mock token
        const mockToken = btoa(JSON.stringify({ 
            id: newUser.id, 
            email: newUser.email, 
            exp: Date.now() + 86400000 
        }));
        
        // Store user data
        localStorage.setItem('shopez_token', mockToken);
        localStorage.setItem('shopez_user', JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }));
        localStorage.setItem('shopez_cart', JSON.stringify([]));
        
        showToast('Registration successful! Redirecting...', 'success');
        
        // Update navigation immediately
        updateNav();
        updateCartCount();
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Registration failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

// Initialize auth pages
$(document).ready(function() {
    // Check if already logged in and redirect
    if (isLoggedIn()) {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'login.html' || currentPage === 'register.html') {
            window.location.href = 'index.html';
            return;
        }
    }
    
    // Login form handler
    $('#loginForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        const email = $('#email').val().trim();
        const password = $('#password').val();
        
        if (!email || !password) {
            showToast('Please enter both email and password', 'warning');
            return;
        }
        
        login(email, password);
    });
    
    // Register form handler
    $('#registerForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();
        
        if (!name || !email || !password || !confirmPassword) {
            showToast('Please fill in all fields', 'warning');
            return;
        }
        
        register(name, email, password, confirmPassword);
    });
});