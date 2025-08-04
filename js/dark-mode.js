/**
 * Dark Mode Toggle Functionality
 * Inspired by modern theme switchers with smooth transitions and local storage persistence
 */

(function() {
    'use strict';

    // Get DOM elements
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Theme configuration
    const themes = {
        light: {
            name: 'light',
            icon: '🌙'
        },
        dark: {
            name: 'dark',
            icon: '☀️'
        }
    };

    /**
     * Get the current theme from localStorage or default to light
     */
    function getCurrentTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            return savedTheme;
        }
        
        // Check for system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    }

    /**
     * Apply the theme to the document
     */
    function applyTheme(themeName) {
        html.setAttribute('data-theme', themeName);
        
        // Update button icon
        if (themeToggle) {
            themeToggle.textContent = themes[themeName].icon;
            themeToggle.setAttribute('aria-label', 
                themeName === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
            );
        }
        
        // Save to localStorage
        localStorage.setItem('theme', themeName);
        
        // Dispatch custom event for other scripts that might need to know about theme changes
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: themeName } 
        }));
    }

    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        
        // Add a subtle animation effect
        if (themeToggle) {
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        }
    }

    /**
     * Initialize the theme system
     */
    function initTheme() {
        // Apply the current theme immediately to prevent flash
        const currentTheme = getCurrentTheme();
        applyTheme(currentTheme);
        
        // Add click event listener to toggle button
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('theme')) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    /**
     * Keyboard accessibility
     */
    function initKeyboardSupport() {
        if (themeToggle) {
            themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initTheme();
            initKeyboardSupport();
        });
    } else {
        initTheme();
        initKeyboardSupport();
    }

    // Expose theme functions to global scope for debugging/external use
    window.themeController = {
        getCurrentTheme,
        applyTheme,
        toggleTheme
    };

})();
