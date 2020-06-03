export class Engine {
  constructor() {
    this.FPS = 10;
    this.BODY_PART_SIZE = 25;

    this.DIRECTIONS = {
      UP: 0,
      RIGHT: 1,
      DOWN: 2,
      LEFT: 3,
    };

    this.canvas = null;
    this.canvasContext = null;
    this.nextDirection = this.DIRECTIONS.LEFT;
    this.direction = this.DIRECTIONS.LEFT;

    this.solidWallsCheckbox = document.getElementById('solid-walls');
    this.scoreDiplay = document.getElementById('score');
    this.pauseButton = document.getElementById('pause');
    this.resetButton = document.getElementById('reset');

    window.addEventListener('keydown', event => this.keyDown.call(this, event), true);
    this.pauseButton.onclick = () => this.pauseGame.call(this);
    this.resetButton.onclick = () => this.init.call(this);
  }

  init() {
    this.isPaused = false;
    this.nextDirection = this.DIRECTIONS.LEFT;
    this.direction = this.DIRECTIONS.LEFT;
    this.canvas = document.getElementById('canvas');
    this.canvasContext = this.canvas.getContext('2d');
    this.currentScore = 0;
    this.scoreDiplay.innerHTML = this.currentScore;
  }

  get solidWalls() {
    return this.solidWallsCheckbox.checked === true;
  }

  get canvasWidth() {
    return this.canvas.width;
  }

  get canvasHeight() {
    return this.canvas.height;
  }

  async loadImages() {
    this.IMAGES = {
      GAME_OVER: await this.loadImage('img/gameover.png'),
    };
  }

  clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.canvasContext.strokeStyle = 'rgba(0,0,0,255)';
  }

  drawImage(image, x, y) {
    this.canvasContext.drawImage(image, x, y);
  }

  gameOver() {
    this.canvasContext.drawImage(this.IMAGES.GAME_OVER, 0, 180);
  }

  pauseGame() {
    this.isPaused = !this.isPaused;
    if (!this.isPaused) {
      this.pauseButton.innerHTML = 'Pause';
    } else {
      this.pauseButton.innerHTML = 'Unpause';
    }
  }

  score() {
    this.currentScore += this.solidWalls ? 20 : 10;
    this.scoreDiplay.innerHTML = this.currentScore;
  }

  keyDown(event) {
    switch (event.key) {
      case 'w':
      case 'ArrowUp':
        if (!this.isPaused && this.direction !== this.DIRECTIONS.DOWN) {
          this.nextDirection = this.DIRECTIONS.UP;
        }
        break;
      case 'd':
      case 'ArrowRight':
        if (!this.isPaused && this.direction !== this.DIRECTIONS.LEFT) {
          this.nextDirection = this.DIRECTIONS.RIGHT;
        }
        break;
      case 's':
      case 'ArrowDown':
        if (!this.isPaused && this.direction !== this.DIRECTIONS.UP) {
          this.nextDirection = this.DIRECTIONS.DOWN;
        }
        break;
      case 'a':
      case 'ArrowLeft':
        if (!this.isPaused && this.direction !== this.DIRECTIONS.RIGHT) {
          this.nextDirection = this.DIRECTIONS.LEFT;
        }
        break;
      case 'Escape':
        this.pauseGame();
        break;
      // no default
    }
  }

  loadImage(src) {
    const image = new Image();
    image.src = src;
    return new Promise(resolve => {
      image.onload = () => resolve(image);
    });
  }
}
