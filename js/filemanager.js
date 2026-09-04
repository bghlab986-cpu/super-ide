// File Manager Implementation

class FileManager {
    constructor() {
        this.files = [];
        this.currentPath = '/';
        this.loadFileSystem();
    }

    loadFileSystem() {
        const saved = localStorage.getItem('filesystem');
        if (saved) {
            this.files = JSON.parse(saved);
        } else {
            this.createDefaultStructure();
        }
    }

    createDefaultStructure() {
        this.files = [
            { name: 'index.html', type: 'file', size: 1024, created: new Date() },
            { name: 'style.css', type: 'file', size: 512, created: new Date() },
            { name: 'script.js', type: 'file', size: 768, created: new Date() },
            { name: 'assets', type: 'folder', files: [] }
        ];
    }

    createFile(filename) {
        const file = {
            name: filename,
            type: 'file',
            size: 0,
            created: new Date(),
            content: ''
        };
        this.files.push(file);
        this.save();
        return file;
    }

    createFolder(foldername) {
        const folder = {
            name: foldername,
            type: 'folder',
            files: [],
            created: new Date()
        };
        this.files.push(folder);
        this.save();
        return folder;
    }

    deleteFile(filename) {
        const index = this.files.findIndex(f => f.name === filename);
        if (index > -1) {
            this.files.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    renameFile(oldName, newName) {
        const file = this.files.find(f => f.name === oldName);
        if (file) {
            file.name = newName;
            this.save();
            return true;
        }
        return false;
    }

    getFile(filename) {
        return this.files.find(f => f.name === filename);
    }

    getAllFiles(type = null) {
        return type ? this.files.filter(f => f.type === type) : this.files;
    }

    save() {
        localStorage.setItem('filesystem', JSON.stringify(this.files));
    }

    getFileTree() {
        return this.buildTree(this.files);
    }

    buildTree(files, level = 0) {
        return files.map(file => {
            const indent = '  '.repeat(level);
            if (file.type === 'folder') {
                return `${indent}📁 ${file.name}\n${this.buildTree(file.files, level + 1)}`;
            } else {
                const icon = this.getFileIcon(file.name);
                return `${indent}${icon} ${file.name} (${this.formatSize(file.size)})`;
            }
        }).join('\n');
    }

    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const icons = {
            'html': '🌐',
            'css': '🎨',
            'js': '⚙️',
            'json': '📋',
            'png': '🖼️',
            'jpg': '🖼️',
            'gif': '🎬',
            'txt': '📄',
            'pdf': '📕'
        };
        return icons[ext] || '📄';
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }
}

// Initialize file manager
const fileManager = new FileManager();

// Update file tree display
function updateFileTree() {
    const fileTree = document.getElementById('files-tree');
    const html = fileManager.getFileTree();
    fileTree.textContent = html;
}

// File operations
document.addEventListener('click', function(e) {
    const newFileBtn = document.querySelector('.files-toolbar .btn-primary:first-child');
    const newFolderBtn = document.querySelector('.files-toolbar .btn-primary:last-child');

    if (e.target === newFileBtn || e.target.closest('.files-toolbar .btn-primary:first-child')) {
        const filename = prompt('اسم الملف الجديد:');
        if (filename) {
            fileManager.createFile(filename);
            updateFileTree();
            addLog(`تم إنشاء الملف: ${filename}`, 'success');
        }
    }

    if (e.target === newFolderBtn || e.target.closest('.files-toolbar .btn-primary:last-child')) {
        const foldername = prompt('اسم المجلد الجديد:');
        if (foldername) {
            fileManager.createFolder(foldername);
            updateFileTree();
            addLog(`تم إنشاء المجلد: ${foldername}`, 'success');
        }
    }
});
