import Phaser from 'phaser';
import { Howl } from 'howler';

const GRID_SIZE = 20;

export class SnakeScene extends Phaser.Scene {
  private snake: Phaser.GameObjects.Rectangle[] = [];
  private apple!: Phaser.GameObjects.Rectangle;
  private direction: { x: number; y: number } = { x: 1, y: 0 };
  private nextDirection: { x: number; y: number } = { x: 1, y: 0 };
  private moveTimer = 0;
  private moveDelay = 150;
  private isGameOver = false;
  private score = 0;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  private eatSound!: Howl;
  private deathSound!: Howl;

  constructor() {
    super('SnakeScene');
  }

  preload() {
    // Sound initialization
    this.eatSound = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3'],
      volume: 0.5
    });
    this.deathSound = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/1103/1103-preview.mp3'],
      volume: 0.5
    });
  }

  create() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.resetGame();
    
    // Listen for orientation change from external UI (React buttons)
    this.events.on('set-direction', (dir: string) => {
      this.handleDirectionInput(dir);
    });
  }

  resetGame() {
    // Cleanup
    this.snake.forEach(segment => segment.destroy());
    this.snake = [];
    if (this.apple) this.apple.destroy();

    this.score = 0;
    this.isGameOver = false;
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.moveDelay = 150;
    
    // Create initial snake (3 segments)
    for (let i = 0; i < 3; i++) {
      const segment = this.add.rectangle(
        100 - (i * GRID_SIZE), 
        100, 
        GRID_SIZE - 2, 
        GRID_SIZE - 2, 
        0x10b981
      ).setOrigin(0);
      this.snake.push(segment);
    }

    this.spawnApple();
    this.game.events.emit('update-score', this.score);
  }

  private handleDirectionInput(dir: string) {
    if (dir === 'UP' && this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
    else if (dir === 'DOWN' && this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
    else if (dir === 'LEFT' && this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
    else if (dir === 'RIGHT' && this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
  }

  setDirection(dir: string) {
    this.handleDirectionInput(dir);
  }

  spawnApple() {
    const x = Math.floor(Math.random() * (this.sys.game.canvas.width / GRID_SIZE)) * GRID_SIZE;
    const y = Math.floor(Math.random() * (this.sys.game.canvas.height / GRID_SIZE)) * GRID_SIZE;
    
    // Don't spawn on snake body
    const onSnake = this.snake.some(seg => seg.x === x && seg.y === y);
    if (onSnake) {
      this.spawnApple();
      return;
    }

    if (this.apple) this.apple.destroy();
    this.apple = this.add.rectangle(x, y, GRID_SIZE - 2, GRID_SIZE - 2, 0xef4444).setOrigin(0);
    
    // Tiny apple animation
    this.tweens.add({
      targets: this.apple,
      scale: 1.1,
      duration: 300,
      yoyo: true,
      repeat: -1
    });
  }

  update(time: number) {
    if (this.isGameOver) return;

    // Handle keyboard input
    if (this.cursors.up.isDown && this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
    else if (this.cursors.down.isDown && this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
    else if (this.cursors.left.isDown && this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
    else if (this.cursors.right.isDown && this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };

    if (time > this.moveTimer) {
      this.moveSnake();
      this.moveTimer = time + this.moveDelay;
    }
  }

  private moveSnake() {
    this.direction = { ...this.nextDirection };
    
    const head = this.snake[0];
    const newX = head.x + (this.direction.x * GRID_SIZE);
    const newY = head.y + (this.direction.y * GRID_SIZE);

    // Wall collision
    if (newX < 0 || newX >= this.sys.game.canvas.width || newY < 0 || newY >= this.sys.game.canvas.height) {
      this.gameOver();
      return;
    }

    // Body collision
    if (this.snake.some(seg => seg.x === newX && seg.y === newY)) {
      this.gameOver();
      return;
    }

    // Apple collision
    const ateApple = (newX === this.apple.x && newY === this.apple.y);

    if (ateApple) {
      this.score += 10;
      this.game.events.emit('update-score', this.score);
      this.spawnApple();
      this.moveDelay = Math.max(50, this.moveDelay - 2);
      
      const isMuted = localStorage.getItem('snake-muted') === 'true';
      if (!isMuted) this.eatSound.play();

      // Snake grows, so we don't pop the last segment
      const newSegment = this.add.rectangle(newX, newY, GRID_SIZE - 2, GRID_SIZE - 2, 0x10b981).setOrigin(0);
      this.snake.unshift(newSegment);
    } else {
      // Move snake: take the tail and put it at the new head position
      const tail = this.snake.pop();
      if (tail) {
        tail.setPosition(newX, newY);
        this.snake.unshift(tail);
      }
    }

    // Color head differently
    this.snake.forEach((seg, i) => {
      seg.setFillStyle(i === 0 ? 0x34d399 : 0x10b981);
    });
  }

  private gameOver() {
    this.isGameOver = true;
    const isMuted = localStorage.getItem('snake-muted') === 'true';
    if (!isMuted) this.deathSound.play();
    this.game.events.emit('game-over', this.score);
  }
}