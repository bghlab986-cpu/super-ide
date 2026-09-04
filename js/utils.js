// Utility Functions

// Format date
function formatDate(date) {
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Generate unique ID
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if browser supports feature
function featureSupported(feature) {
    const features = {
        localStorage: typeof(Storage) !== "undefined",
        sessionStorage: typeof(sessionStorage) !== "undefined",
        serviceWorker: 'serviceWorker' in navigator,
        webWorker: typeof(Worker) !== "undefined",
        canvas: document.createElement('canvas').getContext('2d') !== null,
        dragDrop: window.ondrop === null,
        fetch: typeof(fetch) !== "undefined"
    };
    return features[feature] || false;
}

// Show notification
function showNotification(message, type = 'info', duration = 3000) {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), duration);
}

// Download text as file
function downloadAsFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('تم النسخ إلى الحافظة', 'success');
    }).catch(() => {
        showNotification('فشل النسخ', 'error');
    });
}

// Validate email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validate URL
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

// Get query parameter
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// Base64 encode/decode
function encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function decode(str) {
    return decodeURIComponent(escape(atob(str)));
}

// Color converter
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// JSON pretty print
function prettyJSON(obj) {
    return JSON.stringify(obj, null, 2);
}

// Deep clone object
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Array utilities
const ArrayUtils = {
    shuffle: (arr) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    unique: (arr) => [...new Set(arr)],
    
    flatten: (arr) => arr.reduce((flat, item) => 
        flat.concat(Array.isArray(item) ? ArrayUtils.flatten(item) : item), []),
    
    groupBy: (arr, key) => arr.reduce((obj, item) => {
        const group = item[key];
        obj[group] = (obj[group] || []).concat(item);
        return obj;
    }, {})
};

// String utilities
const StringUtils = {
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    
    reverse: (str) => str.split('').reverse().join(''),
    
    isPalindrome: (str) => str === StringUtils.reverse(str),
    
    slugify: (str) => str.toLowerCase().replace(/\s+/g, '-')
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        formatFileSize,
        generateId,
        debounce,
        throttle,
        featureSupported,
        showNotification,
        downloadAsFile,
        copyToClipboard,
        isValidEmail,
        isValidURL,
        ArrayUtils,
        StringUtils
    };
}
