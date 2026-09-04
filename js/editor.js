// Advanced Code Editor Features

class CodeEditor {
    constructor() {
        this.editor = document.getElementById('code-editor');
        this.currentFile = 'index.html';
        this.files = {};
        this.loadFiles();
    }

    loadFiles() {
        const saved = localStorage.getItem('project_files');
        if (saved) {
            this.files = JSON.parse(saved);
        } else {
            this.files = {
                'index.html': '<!-- أكتب أكوادك هنا -->',
                'style.css': '/* CSS هنا */',
                'script.js': '// JavaScript هنا'
            };
        }
    }

    getFile(filename) {
        return this.files[filename] || '';
    }

    setFile(filename, content) {
        this.files[filename] = content;
        localStorage.setItem(`file_${filename}`, content);
        localStorage.setItem('project_files', JSON.stringify(this.files));
    }

    syntaxHighlight(code) {
        // Basic syntax highlighting
        if (this.currentFile.endsWith('.html')) {
            return this.highlightHTML(code);
        } else if (this.currentFile.endsWith('.css')) {
            return this.highlightCSS(code);
        } else if (this.currentFile.endsWith('.js')) {
            return this.highlightJS(code);
        }
        return code;
    }

    highlightHTML(code) {
        return code
            .replace(/(&lt;[^&]*&gt;)/g, '<span class="tag">$1</span>')
            .replace(/("[^"]*")/g, '<span class="string">$1</span>');
    }

    highlightCSS(code) {
        return code
            .replace(/([\w-]+)(?=\s*:)/g, '<span class="property">$1</span>')
            .replace(/(#[\w]+|\.[\w]+)/g, '<span class="selector">$1</span>');
    }

    highlightJS(code) {
        const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while'];
        let highlighted = code;
        keywords.forEach(kw => {
            highlighted = highlighted.replace(new RegExp(`\\b${kw}\\b`, 'g'), 
                `<span class="keyword">${kw}</span>`);
        });
        return highlighted;
    }
}

// Initialize editor
const codeEditor = new CodeEditor();

// Tab Management
document.addEventListener('click', function(e) {
    if (e.target.closest('.tab')) {
        const tab = e.target.closest('.tab');
        if (tab.querySelector('.close-tab') === e.target) {
            // Close tab
            const filename = tab.dataset.file;
            tab.remove();
            addLog(`تم إغلاق الملف: ${filename}`, 'warning');
        } else {
            // Switch tab
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filename = tab.dataset.file;
            codeEditor.currentFile = filename;
            document.getElementById('code-editor').value = codeEditor.getFile(filename);
            updateLineNumbers();
        }
    }
});

// Auto-completion
document.getElementById('code-editor').addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + '\t' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
    }

    // Auto close brackets
    const brackets = { '(': ')', '{': '}', '[': ']', '"': '"', "'": "'" };
    if (brackets[e.key]) {
        e.preventDefault();
        const start = this.selectionStart;
        const before = this.value.substring(0, start);
        const after = this.value.substring(start);
        this.value = before + e.key + brackets[e.key] + after;
        this.selectionStart = this.selectionEnd = start + 1;
    }
});
