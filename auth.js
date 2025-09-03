// auth.js - Include this file in your index.html
// This checks if user is logged in and handles logout

// Check if user is authenticated
function checkAuthentication() {
    const idToken = localStorage.getItem('idToken');
    
    if (!idToken) {
        // No token, redirect to login
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        // Decode and check token expiration
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp < currentTime) {
            // Token expired, clear storage and redirect
            localStorage.clear();
            window.location.href = 'login.html';
            return false;
        }
        
        // Token is valid
        return true;
    } catch (error) {
        console.error('Error validating token:', error);
        localStorage.clear();
        window.location.href = 'login.html';
        return false;
    }
}

// Logout function
function logout() {
    // Clear all stored tokens
    localStorage.clear();
    // Redirect to login page
    window.location.href = 'login.html';
}

// Get current user email
function getCurrentUserEmail() {
    return localStorage.getItem('userEmail') || 'User';
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Only check auth if we're not on the login page
    if (!window.location.pathname.includes('login.html')) {
        checkAuthentication();
        
        // Optional: Display user email in the nav if there's an element for it
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) {
            userEmailElement.textContent = getCurrentUserEmail();
        }
    }
});