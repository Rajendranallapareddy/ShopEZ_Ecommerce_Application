// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://localhost:7196/api',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3
};

// Storage Keys
const STORAGE_KEYS = {
    TOKEN: 'shopez_token',
    USER: 'shopez_user',
    CART: 'shopez_cart',
    SELECTED_PRODUCT: 'shopez_selected_product'
};

// Order Status Mapping
const ORDER_STATUS = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
};

// Payment Methods
const PAYMENT_METHODS = {
    COD: 'COD',
    CREDIT_CARD: 'Credit Card',
    DEBIT_CARD: 'Debit Card',
    UPI: 'UPI'
};

// Helper function to get auth token
function getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

// Helper function to get user
function getUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
}

// Helper function to set user
function setUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

// Helper function to clear auth data
function clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
}

// Helper function to check if token is expired
function isTokenExpired() {
    const token = getToken();
    if (!token) return true;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        return Date.now() >= exp;
    } catch {
        return true;
    }
}

// API request wrapper with error handling
async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const token = getToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, finalOptions);
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || error.title || `HTTP ${response.status}`);
        }
        
        // Return empty object for No Content responses
        if (response.status === 204) {
            return {};
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request Failed:', error);
        throw error;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, STORAGE_KEYS, ORDER_STATUS, PAYMENT_METHODS, apiRequest, getToken, getUser, setUser, clearAuth, isTokenExpired };
}