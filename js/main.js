// Navigation and Section Management
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupDarkMode();
    setupEditor();
    setupFileManager();
    setupScraper();
    setupGame();
    setupConsole();
}

// Navigation Setup
function setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionName = this.dataset.section;
            
            // Remove active from all
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active to current
            this.classList.add('active');
            document.getElementById(sectionName + '-section').classList.add('active');
            
            // Update title
            updatePageTitle(sectionName);
        });
    });
}

function updatePageTitle(section) {
    const titles = {
        'editor': 'محرر الأكواد',
        'game': 'محرك الألعاب',
        'files': 'إدارة الملفات',
        'scraper': 'جلب البيانات من الويب',
        'settings': 'الإعدادات'
    };
    document.getElementById('page-title').textContent = titles[section] || 'Super IDE';
}

// Dark Mode Setup
function setupDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode');
    const savedMode = localStorage.getItem('darkMode') === 'true';
    
    if (savedMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', this.checked);
    });
}

// Editor Setup
function setupEditor() {
    const codeEditor = document.getElementById('code-editor');
    const lineNumbers = document.getElementById('line-numbers');
    const previewFrame = document.getElementById('preview-frame');
    const refreshBtn = document.querySelector('.refresh-preview');
    const addTabBtn = document.querySelector('.add-tab');
    const clearConsoleBtn = document.querySelector('.clear-console');
    const consoleInput = document.querySelector('.console-input');

    if (!codeEditor) return;

    // Update line numbers
    codeEditor.addEventListener('input', function() {
        updateLineNumbers();
        autoSaveCode();
    });

    codeEditor.addEventListener('scroll', function() {
        lineNumbers.scrollTop = this.scrollTop;
    });

    // Refresh preview
    refreshBtn.addEventListener('click', updatePreview);
    codeEditor.addEventListener('change', updatePreview);

    // Add new tab
    addTabBtn.addEventListener('click', addNewTab);

    // Clear console
    clearConsoleBtn.addEventListener('click', function() {
        document.getElementById('console-output').innerHTML = '';
    });

    // Console input
    consoleInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            executeConsoleCommand(this.value);
            this.value = '';
        }
    });

    updateLineNumbers();
    updatePreview();
}

function updateLineNumbers() {
    const codeEditor = document.getElementById('code-editor');
    const lineNumbers = document.getElementById('line-numbers');
    const lines = codeEditor.value.split('\n').length;
    
    let lineNumbersText = '';
    for (let i = 1; i <= lines; i++) {
        lineNumbersText += i + '\n';
    }
    lineNumbers.textContent = lineNumbersText;
}

function updatePreview() {
    const codeEditor = document.getElementById('code-editor');
    const previewFrame = document.getElementById('preview-frame');
    
    try {
        previewFrame.srcdoc = codeEditor.value;
        addLog('تم تحديث المعاينة', 'success');
    } catch(e) {
        addLog('خطأ: ' + e.message, 'error');
    }
}

function addNewTab() {
    const fileName = prompt('اسم الملف الجديد:');
    if (!fileName) return;
    
    const fileExtension = fileName.split('.').pop();
    const validExtensions = ['html', 'css', 'js', 'json', 'xml', 'txt'];
    
    if (!validExtensions.includes(fileExtension)) {
        alert('صيغة الملف غير مدعومة!');
        return;
    }
    
    const tabsContainer = document.querySelector('.file-tabs');
    const newTab = document.createElement('div');
    newTab.className = 'tab active';
    newTab.dataset.file = fileName;
    newTab.innerHTML = `
        <span>${fileName}</span>
        <button class="close-tab">×</button>
    `;
    
    tabsContainer.insertBefore(newTab, tabsContainer.lastElementChild);
    
    // Save to localStorage
    saveProjectFiles();
    
    addLog(`تم إنشاء الملف: ${fileName}`, 'success');
}

function autoSaveCode() {
    const codeEditor = document.getElementById('code-editor');
    const activeTab = document.querySelector('.tab.active');
    
    if (activeTab) {
        localStorage.setItem(`file_${activeTab.dataset.file}`, codeEditor.value);
    }
}

function saveProjectFiles() {
    const files = {};
    document.querySelectorAll('.tab').forEach(tab => {
        const fileName = tab.dataset.file;
        files[fileName] = localStorage.getItem(`file_${fileName}`) || '';
    });
    localStorage.setItem('project_files', JSON.stringify(files));
}

function addLog(message, type = 'log') {
    const consoleOutput = document.getElementById('console-output');
    const logElement = document.createElement('div');
    logElement.className = `log ${type}`;
    logElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    consoleOutput.appendChild(logElement);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function executeConsoleCommand(command) {
    try {
        const result = eval(command);
        addLog(`> ${command}`, 'log');
        if (result !== undefined) {
            addLog(`${result}`, 'success');
        }
    } catch(e) {
        addLog(`خطأ: ${e.message}`, 'error');
    }
}

// File Manager Setup
function setupFileManager() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    
    if (!dropZone) return;
    
    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#e3f2fd';
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.style.backgroundColor = 'transparent';
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = 'transparent';
        handleFiles(e.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

function handleFiles(files) {
    const filesList = document.getElementById('files-tree');
    
    for (let file of files) {
        const listItem = document.createElement('li');
        listItem.className = 'file';
        listItem.innerHTML = `
            <i class="fas fa-file"></i>
            <span>${file.name}</span>
        `;
        filesList.appendChild(listItem);
        
        addLog(`تم تحميل الملف: ${file.name}`, 'success');
    }
}

// Web Scraper Setup
function setupScraper() {
    const scrapButton = document.querySelector('.scraper-container .btn-primary');
    
    if (scrapButton) {
        scrapButton.addEventListener('click', performScrape);
    }
}

async function performScrape() {
    const url = document.getElementById('scraper-url').value;
    const output = document.getElementById('scraper-output');
    
    if (!url) {
        alert('من فضلك أدخل رابط الموقع');
        return;
    }
    
    output.innerHTML = '<p>جاري الجلب...</p>';
    
    try {
        const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
        const html = await response.text();
        
        output.innerHTML = `
            <pre>${escapeHtml(html).substring(0, 1000)}...</pre>
            <p>تم جلب البيانات بنجاح (عرض أول 1000 حرف)</p>
        `;
        addLog('تم جلب البيانات من ' + url, 'success');
    } catch(e) {
        output.innerHTML = `<p class="error">خطأ: ${e.message}</p>`;
        addLog('خطأ في جلب البيانات: ' + e.message, 'error');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Game Setup
function setupGame() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Simple game loop
    let gameRunning = false;
    const gameButtons = document.querySelectorAll('.game-container .btn-primary');
    
    if (gameButtons[1]) {
        gameButtons[1].addEventListener('click', function() {
            gameRunning = !gameRunning;
            this.textContent = gameRunning ? 'إيقاف اللعبة' : 'تشغيل اللعبة';
            if (gameRunning) {
                startGameLoop(ctx, canvas);
                addLog('تم تشغيل اللعبة', 'success');
            }
        });
    }
}

function startGameLoop(ctx, canvas) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw sample game elements
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(canvas.width / 2 - 25, canvas.height / 2 - 25, 50, 50);
    
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText('لعبتك ستظهر هنا!', 20, 30);
}

// Console Setup
function setupConsole() {
    // Intercept console logs
    const originalLog = console.log;
    console.log = function(...args) {
        originalLog.apply(console, args);
        addLog(args.join(' '), 'log');
    };
}

// Logout
document.querySelector('.logout-btn').addEventListener('click', function() {
    if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
        localStorage.clear();
        alert('تم تسجيل الخروج بنجاح');
        // Redirect to login page
        window.location.href = 'login.html';
    }
});
