import { Engine } from './engine.js';

export class Snake extends Engine {
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
    this.bodyX = [this.canvasWidth - this.BODY_PART_SIZE];
    this.bodyY = [0];

    this.createFood();

    this.directions = [this.DIRECTIONS.LEFT];

    this.addTail();
    this.addTail();
    this.addTail();
    this.addTail();
    this.addTail();
    this.addTail();
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
    };
    this.FOODS = [this.IMAGES.APPLE, this.IMAGES.BANANA, this.IMAGES.PEACH, this.IMAGES.STRAWBERRY];

    this.TURN_CONFIGURATIONS = [
      [this.DIRECTIONS.RIGHT, this.DIRECTIONS.RIGHT, this.IMAGES.BODY_HORIZONTAL],
      [this.DIRECTIONS.LEFT, this.DIRECTIONS.LEFT, this.IMAGES.BODY_HORIZONTAL],
      [this.DIRECTIONS.UP, this.DIRECTIONS.UP, this.IMAGES.BODY_VERTICAL],
      [this.DIRECTIONS.DOWN, this.DIRECTIONS.DOWN, this.IMAGES.BODY_VERTICAL],

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
      // no default
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

    for (let i = this.bodyImages.length - 1; i >= 0; i -= 1) {
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
      // no default
    }

    // checking collision
    if (newHeadX === this.canvasWidth) {
      newHeadX = 0;
    } else if (newHeadX < 0) {
      newHeadX = this.canvasWidth - this.BODY_PART_SIZE;
    }

    if (newHeadY === this.canvasHeight) {
      newHeadY = 0;
    } else if (newHeadY === -this.BODY_PART_SIZE) {
      newHeadY = this.canvasHeight - this.BODY_PART_SIZE;
    }

    return [newHeadX, newHeadY, newHeadImage];
  }

  moveBody() {
    for (let i = this.bodyImages.length - 1; i > 0; i -= 1) {
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
        // no default
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
    for (let i = this.bodyImages.length - 1; i > 0; i -= 1) {
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
          // no default
        }
      } else {
        const turnConfigurationFound = this.TURN_CONFIGURATIONS.find(turnConfiguration => {
          return (
            turnConfiguration[0] === previousDirection && turnConfiguration[1] === thisDirection
          );
        });

        if (!turnConfigurationFound) {
          console.log(previousDirection, thisDirection, i);
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

    for (let i = this.bodyImages.length - 1; i > 0; i -= 1) {
      const bodyX = this.bodyX[i];
      const bodyY = this.bodyY[i];

      if (headX === bodyX && headY === bodyY) {
        this.gameOver(this.IMAGES.GAME_OVER);
        return;
      }
    }

    if (this.solidWalls) {
      if (headX === this.canvasWidth || headX < 0 || headY === this.canvasHeight || headY < 0) {
        this.gameOver(this.IMAGES.GAME_OVER);
        return;
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

  // @TODO, instead of generating random X and Y's, get all the possible X and Y's and choose
  //   one of those randomly.
  //   As the possible positions get smaller, it becomes very expensive to keep generating
  //   random numbers until one of the gets a good position.
  createFood() {
    this.foodX = null;
    this.foodY = null;
    this.foodImage = null;

    let collision = true;
    let foodX;
    let foodY;

    while (collision) {
      let collided = false;
      foodX = Math.floor(Math.random() * 20) * this.BODY_PART_SIZE;
      foodY = Math.floor(Math.random() * 20) * this.BODY_PART_SIZE;

      for (let i = 0; i < this.bodyImages.length; i += 1) {
        const bodyX = this.bodyX[i];
        const bodyY = this.bodyY[i];

        if (foodX === bodyX && foodY === bodyY) {
          collided = true;
        }
      }

      collision = collided;
    }

    const randomFood = Math.floor(Math.random() * 4);
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
