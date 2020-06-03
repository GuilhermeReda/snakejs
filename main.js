class Engine {
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

    this.keyDownListener = window.addEventListener('keydown', (event) => this.keyDown.call(this, event), true);
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
  
  async loadImages() {
    this.IMAGES = {
      GAME_OVER: await this.loadImage('img/gameover.png'),
    }
  }

  clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasContext.strokeStyle = "rgba(0,0,0,255)";
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
    if (this.isPaused) {
      return;
    }

    switch (event.key) {
      case 'w':
      case 'ArrowUp':
        if (this.direction !== this.DIRECTIONS.DOWN) {
          this.nextDirection = this.DIRECTIONS.UP;
        }
        break;
      case 'd':
      case 'ArrowRight':
        if (this.direction !== this.DIRECTIONS.LEFT) {
          this.nextDirection = this.DIRECTIONS.RIGHT;
        }
        break;
      case 's':
      case 'ArrowDown':
        if (this.direction !== this.DIRECTIONS.UP) {
          this.nextDirection = this.DIRECTIONS.DOWN;
        }
        break;
      case 'a':
      case 'ArrowLeft':
        if (this.direction !== this.DIRECTIONS.RIGHT) {
          this.nextDirection = this.DIRECTIONS.LEFT;
        }
        break;
    }
  }

  loadImage(src) {
    const image = new Image();
    image.src = src;
    return new Promise(resolve => image.onload = () => resolve(image));
  }
}

class Snake extends Engine {
  constructor() {
    super();

    this.bodyImages = [];
    this.bodyX = [];
    this.bodyY = [];
    this.directions = [];
  }

  async init() {
    super.init();

    await this.loadImages();

    this.bodyImages = [this.IMAGES.HEAD_LEFT];
    this.bodyX = [500];
    this.bodyY = [0];

    this.createFood();

    this.directions = [this.DIRECTIONS.LEFT];

    this.addTail();
    this.addTail();
    // fix head
    this.bodyImages[0] = this.IMAGES.HEAD_LEFT;

    if (this.drawInterval) {
      clearInterval(this.drawInterval);
    }

    this.drawInterval = setInterval(this.drawImages.bind(this), 1000 / this.FPS);
  }

  async loadImages() {
    await super.loadImages();

    this.IMAGES = {
      ...this.IMAGES,
      APPLE: await super.loadImage('img/apple.PNG'),
      BANANA: await super.loadImage('img/banana.PNG'),
      PEACH: await super.loadImage('img/peach.PNG'),
      STRAWBERRY: await super.loadImage('img/strawberry.PNG'),
      BODY_HORIZONTAL: await super.loadImage('img/bodyx.PNG'),
      BODY_VERTICAL: await super.loadImage('img/bodyy.PNG'),
      HEAD_LEFT: await super.loadImage('img/headx-.PNG'),
      HEAD_RIGHT: await super.loadImage('img/headx+.PNG'),
      HEAD_UP: await super.loadImage('img/heady-.PNG'),
      HEAD_DOWN: await super.loadImage('img/heady+.PNG'),
      TAIL_LEFT: await super.loadImage('img/tailx-.PNG'),
      TAIL_RIGHT: await super.loadImage('img/tailx+.PNG'),
      TAIL_UP: await super.loadImage('img/taily-.PNG'),
      TAIL_DOWN: await super.loadImage('img/taily+.PNG'),
      TURN_X_LEFT_Y_UP: await super.loadImage('img/turn1.PNG'),
      TURN_X_LEFT_Y_DOWN: await super.loadImage('img/turn3.PNG'),
      TURN_X_RIGHT_Y_UP: await super.loadImage('img/turn4.PNG'),
      TURN_X_RIGHT_Y_DOWN: await super.loadImage('img/turn2.PNG'),
    }
    this.FOODS = [this.IMAGES.APPLE, this.IMAGES.BANANA, this.IMAGES.PEACH, this.IMAGES.STRAWBERRY];

    this.TURN_CONFIGURATIONS = [
      [this.DIRECTIONS.RIGHT, this.DIRECTIONS.UP, this.IMAGES.TURN_X_RIGHT_Y_DOWN],
      [this.DIRECTIONS.RIGHT, this.DIRECTIONS.DOWN, this.IMAGES.TURN_X_RIGHT_Y_UP],
      [this.DIRECTIONS.LEFT, this.DIRECTIONS.UP, this.IMAGES.TURN_X_LEFT_Y_DOWN],
      [this.DIRECTIONS.LEFT, this.DIRECTIONS.DOWN, this.IMAGES.TURN_X_LEFT_Y_UP],
      [this.DIRECTIONS.UP, this.DIRECTIONS.RIGHT, this.IMAGES.TURN_X_LEFT_Y_UP],
      [this.DIRECTIONS.UP, this.DIRECTIONS.LEFT, this.IMAGES.TURN_X_RIGHT_Y_UP],
      [this.DIRECTIONS.DOWN, this.DIRECTIONS.RIGHT, this.IMAGES.TURN_X_LEFT_Y_DOWN],
      [this.DIRECTIONS.DOWN, this.DIRECTIONS.LEFT, this.IMAGES.TURN_X_RIGHT_Y_DOWN],
    ];
  }

  addTail() {
    const snakeLength = this.bodyImages.length;
    if (!snakeLength) {
      return;
    }

    const tailIndex = snakeLength - 1;
    const tailDirection = this.directions[tailIndex];
    switch (tailDirection) {
      case this.DIRECTIONS.UP:
        this.bodyImages[tailIndex] = this.IMAGES.BODY_VERTICAL;
        this.bodyImages[snakeLength] = this.IMAGES.TAIL_UP;

        this.bodyX[snakeLength] = this.bodyX[tailIndex];
        this.bodyY[snakeLength] = this.bodyY[tailIndex] + this.BODY_PART_SIZE;

        break;
      case this.DIRECTIONS.DOWN:
          this.bodyImages[tailIndex] = this.IMAGES.BODY_VERTICAL;
          this.bodyImages[snakeLength] = this.IMAGES.TAIL_DOWN;

          this.bodyX[snakeLength] = this.bodyX[tailIndex];
          this.bodyY[snakeLength] = this.bodyY[tailIndex] - this.BODY_PART_SIZE;

        break;
      case this.DIRECTIONS.LEFT:
          this.bodyImages[tailIndex] = this.IMAGES.BODY_HORIZONTAL;
          this.bodyImages[snakeLength] = this.IMAGES.TAIL_LEFT;

          this.bodyX[snakeLength] = this.bodyX[tailIndex] + this.BODY_PART_SIZE;
          this.bodyY[snakeLength] = this.bodyY[tailIndex];
        break;
      case this.DIRECTIONS.RIGHT:
          this.bodyImages[tailIndex] = this.IMAGES.BODY_HORIZONTAL;
          this.bodyImages[snakeLength] = this.IMAGES.TAIL_RIGHT;

          this.bodyX[snakeLength] = this.bodyX[tailIndex] - this.BODY_PART_SIZE;
          this.bodyY[snakeLength] = this.bodyY[tailIndex];
        break;
    }

    // follow the same direction as the previous tail.
    this.directions[snakeLength] = tailDirection;
  }

  drawImages() {
    if (this.isPaused) {
      return;
    }

    this.direction = this.nextDirection;

    this.moveBody();
    super.clearCanvas();

    super.drawImage(this.foodImage, this.foodX, this.foodY);

    for (let i = this.bodyImages.length -1; i >= 0; i--) {
      super.drawImage(this.bodyImages[i], this.bodyX[i], this.bodyY[i]);
    }

    this.checkCollision();
  }

  newHeadData() {
    const headX = this.bodyX[0];
    const headY = this.bodyY[0];
    const headImage = this.bodyImages[0];
    let newHeadX = headX;
    let newHeadY = headY;
    let newHeadImage = headImage;

    switch (this.direction) {
      case this.DIRECTIONS.UP:
        newHeadY = headY - this.BODY_PART_SIZE;
        newHeadImage = this.IMAGES.HEAD_UP;
        break;
      case this.DIRECTIONS.DOWN:
        newHeadY = headY + this.BODY_PART_SIZE;
        newHeadImage = this.IMAGES.HEAD_DOWN;
        break;
      case this.DIRECTIONS.LEFT:
        newHeadX = headX - this.BODY_PART_SIZE;
        newHeadImage = this.IMAGES.HEAD_LEFT;
        break;
      case this.DIRECTIONS.RIGHT:
        newHeadX = headX + this.BODY_PART_SIZE;
        newHeadImage = this.IMAGES.HEAD_RIGHT;
        break;
    }

    // checking collision
		if(newHeadX === 500) {
      newHeadX = 0;
    } else if (newHeadX === -25) {
      newHeadX = 500;
    }

    if(newHeadY === 500) {
      newHeadY = 0;
    } else if (newHeadY === -25) {
      newHeadY = 500;
    }

    return [newHeadX, newHeadY, newHeadImage];
  }

  moveBody() {
    for (let i = this.bodyImages.length - 1; i > 0; i--) {
      this.bodyX[i] = this.bodyX[i - 1];
      this.bodyY[i] = this.bodyY[i - 1];
      this.directions[i] = this.directions[i - 1];

      switch (this.directions[i]) {
        case this.DIRECTIONS.UP:
        case this.DIRECTIONS.DOWN:
          this.bodyImages[i] = this.IMAGES.BODY_VERTICAL;
          break;
        case this.DIRECTIONS.LEFT:
        case this.DIRECTIONS.RIGHT:
          this.bodyImages[i] = this.IMAGES.BODY_HORIZONTAL;
          break;
      }
    }

    const [newHeadX, newHeadY, newHeadImage] = this.newHeadData();
  
    this.bodyX[0] = newHeadX;
    this.bodyY[0] = newHeadY;
    this.bodyImages[0] = newHeadImage;
    this.directions[0] = this.direction;

    this.fixImages();
  }

  fixImages() {
    for (let i = this.bodyImages.length - 1; i > 0; i--) {
      const isTail = this.bodyImages.length - 1 === i;
      const thisDirection = this.directions[i];
      const previousDirection = this.directions[i - 1];
      let newImage;

      if (isTail) {
        switch (previousDirection) {
          case this.DIRECTIONS.UP:
            newImage = this.IMAGES.TAIL_UP;
            break;
          case this.DIRECTIONS.DOWN:
            newImage = this.IMAGES.TAIL_DOWN;
            break;
          case this.DIRECTIONS.LEFT:
            newImage = this.IMAGES.TAIL_LEFT;
            break;
          case this.DIRECTIONS.RIGHT:
            newImage = this.IMAGES.TAIL_RIGHT;
            break;
        }
      } else {
        const turnConfigurationFound = this.TURN_CONFIGURATIONS.find(turnConfiguration => {
          return (
            turnConfiguration[0] === previousDirection &&
            turnConfiguration[1] === thisDirection
          );
        });

        if (!turnConfigurationFound) {
          continue;
        }

        newImage = turnConfigurationFound[2];
      }

      this.bodyImages[i] = newImage;
    }
  }

  checkCollision() {
    const headX = this.bodyX[0];
    const headY = this.bodyY[0];

    for (let i = this.bodyImages.length - 1; i > 0; i--) {
      const bodyX = this.bodyX[i];
      const bodyY = this.bodyY[i];

      if (headX === bodyX && headY === bodyY) {
        return this.gameOver(this.IMAGES.GAME_OVER);
      }
    }

    if (this.solidWalls) {
      if(headX === 500 || headX === -25 || headY === 500 || headY === -25) {
        return this.gameOver(this.IMAGES.GAME_OVER);
      }
    }

    if (headX === this.foodX && headY === this.foodY) {
      this.eatFood();
    }
  }

  eatFood() {
    this.createFood();
    this.addTail();
    this.score();
  }

  createFood() {
    this.foodX = null;
    this.foodY = null;
    this.foodImage = null;

    let collision = true;
    let foodX;
    let foodY;

    while (collision) {
      let collided = false;
      foodX = Math.floor(Math.random() * 20) * 25;
      foodY = Math.floor(Math.random() * 20) * 25;

      for (let i = 0; i < this.bodyImages.length; i++) {
        const bodyX = this.bodyX[i];
        const bodyY = this.bodyY[i];

        if (foodX === bodyX && foodY === bodyY) {
          collided = true;
        }
      }

      collision = collided;
    }

		var randomFood = Math.floor(Math.random() * 4);
    this.foodX = foodX;
    this.foodY = foodY;

    this.foodImage = this.FOODS[randomFood];
  }

  gameOver() {
    super.gameOver();
    clearInterval(this.drawInterval);
    setTimeout(() => this.init(), 3000);
  }
}

window.onload = function () {
  const snake = new Snake();
  snake.init();
};