// Web Scraper Implementation

class WebScraper {
    constructor() {
        this.history = [];
        this.loadHistory();
    }

    async scrapeURL(url, selector = null) {
        try {
            // Using a CORS proxy
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const response = await fetch(proxyUrl + url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            let data = [];
            
            if (selector) {
                const elements = doc.querySelectorAll(selector);
                elements.forEach(el => {
                    data.push({
                        text: el.textContent,
                        html: el.innerHTML,
                        tag: el.tagName
                    });
                });
            } else {
                data = html;
            }
            
            this.addToHistory(url, data);
            return data;
        } catch (error) {
            throw new Error(`خطأ في جلب البيانات: ${error.message}`);
        }
    }

    async scrapeJSON(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.addToHistory(url, data);
            return data;
        } catch (error) {
            throw new Error(`خطأ في جلب البيانات JSON: ${error.message}`);
        }
    }

    async downloadFile(url, filename) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename || 'download';
            link.click();
            this.addToHistory(url, { type: 'file', filename });
            return true;
        } catch (error) {
            throw new Error(`خطأ في تحميل الملف: ${error.message}`);
        }
    }

    addToHistory(url, data) {
        this.history.push({
            url,
            data,
            timestamp: new Date(),
            size: JSON.stringify(data).length
        });
        
        // Keep only last 50 items
        if (this.history.length > 50) {
            this.history.shift();
        }
        
        this.saveHistory();
    }

    saveHistory() {
        localStorage.setItem('scraper_history', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('scraper_history');
        if (saved) {
            this.history = JSON.parse(saved);
        }
    }

    getHistory() {
        return this.history;
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem('scraper_history');
    }

    // Extract specific data types
    extractEmails(html) {
        const regex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
        return html.match(regex) || [];
    }

    extractLinks(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = [];
        doc.querySelectorAll('a').forEach(a => {
            links.push({
                text: a.textContent,
                href: a.href
            });
        });
        return links;
    }

    extractImages(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const images = [];
        doc.querySelectorAll('img').forEach(img => {
            images.push({
                src: img.src,
                alt: img.alt,
                title: img.title
            });
        });
        return images;
    }

    convertToCSV(data) {
        if (Array.isArray(data)) {
            const headers = Object.keys(data[0]);
            let csv = headers.join(',') + '\n';
            data.forEach(item => {
                csv += headers.map(h => JSON.stringify(item[h])).join(',') + '\n';
            });
            return csv;
        }
        return data;
    }

    exportJSON(data, filename = 'data.json') {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
}

// Initialize scraper
const webScraper = new WebScraper();
