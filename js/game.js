// Game Engine Implementation

class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gameObjects = [];
        this.running = false;
        this.fps = 60;
        this.frameTime = 1000 / this.fps;
        this.lastTime = 0;
    }

    start() {
        this.running = true;
        this.gameLoop();
    }

    stop() {
        this.running = false;
    }

    gameLoop = (timestamp) => {
        if (!this.running) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw objects
        this.gameObjects.forEach(obj => {
            if (obj.update) obj.update(deltaTime);
            if (obj.draw) obj.draw(this.ctx);
        });

        requestAnimationFrame(this.gameLoop);
    }

    addObject(obj) {
        this.gameObjects.push(obj);
    }

    removeObject(obj) {
        const index = this.gameObjects.indexOf(obj);
        if (index > -1) {
            this.gameObjects.splice(index, 1);
        }
    }
}

class GameObject {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
    }

    update(deltaTime) {
        this.x += this.vx * (deltaTime / 1000);
        this.y += this.vy * (deltaTime / 1000);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(other) {
        return !(this.x + this.width < other.x ||
                 this.x > other.x + other.width ||
                 this.y + this.height < other.y ||
                 this.y > other.y + other.height);
    }
}

class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 40, 40, '#00ff00');
        this.speed = 200;
    }

    handleInput(keys) {
        if (keys['ArrowUp'] || keys['w']) this.vy = -this.speed;
        else if (keys['ArrowDown'] || keys['s']) this.vy = this.speed;
        else this.vy = 0;

        if (keys['ArrowLeft'] || keys['a']) this.vx = -this.speed;
        else if (keys['ArrowRight'] || keys['d']) this.vx = this.speed;
        else this.vx = 0;
    }
}

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y, 30, 30, '#ff0000');
        this.speed = 100;
        this.direction = 1;
    }

    update(deltaTime) {
        this.x += this.speed * this.direction * (deltaTime / 1000);
        if (this.x <= 0 || this.x >= this.canvas.width - this.width) {
            this.direction *= -1;
        }
    }
}

class Particle {
    constructor(x, y, vx, vy, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
    }

    update(deltaTime) {
        this.x += this.vx * (deltaTime / 1000);
        this.y += this.vy * (deltaTime / 1000);
        this.vy += 200; // gravity
        this.life -= deltaTime;
    }

    draw(ctx) {
        const opacity = this.life / this.maxLife;
        ctx.globalAlpha = opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 5, 5);
        ctx.globalAlpha = 1;
    }

    isAlive() {
        return this.life > 0;
    }
}

// Initialize game engine when game section is active
document.addEventListener('DOMContentLoaded', function() {
    const gameEngine = new GameEngine('game-canvas');
    
    // Add sample objects
    const player = new Player(350, 250);
    gameEngine.addObject(player);
    
    const enemy = new Enemy(100, 100);
    gameEngine.addObject(enemy);
});
