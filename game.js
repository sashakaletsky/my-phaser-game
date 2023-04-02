const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };
  
  const game = new Phaser.Game(config);
  let square, redSquares, cursors, timeCounter, gameOver, playAgainButton, timeElapsed;
  
  function preload() {
    this.load.image('myImage', 'C:\\Users\\sasha\\OneDrive\\Documents\\Personal\\Sasha Photos\\SK Lisbon Photos\\SK 2022 cropped_square_moustache.jpg');
  }
  
  function create() {
    const SQUARE_SIZE = 75;
    const RED_SQUARE_SIZE = 75;
  
    square = this.add.image(config.width / 2, config.height / 2, 'myImage');
    square.setDisplaySize(SQUARE_SIZE, SQUARE_SIZE);
  
    redSquares = [
      this.add.rectangle(randomPosition(RED_SQUARE_SIZE), randomPosition(RED_SQUARE_SIZE), RED_SQUARE_SIZE, RED_SQUARE_SIZE, 0xff0000),
      this.add.rectangle(randomPosition(RED_SQUARE_SIZE), randomPosition(RED_SQUARE_SIZE), RED_SQUARE_SIZE, RED_SQUARE_SIZE, 0xff0000),
      this.add.rectangle(randomPosition(RED_SQUARE_SIZE), randomPosition(RED_SQUARE_SIZE), RED_SQUARE_SIZE, RED_SQUARE_SIZE, 0xff0000),
    ];
  
    cursors = this.input.keyboard.createCursorKeys();
  
    timeCounter = this.add.text(config.width - 100, 10, '00:00', { fontSize: '36px', color: '#808080' });
    timeElapsed = 0;
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!gameOver) {
          timeElapsed++;
          timeCounter.setText(formatTime(timeElapsed));
        }
      },
      callbackScope: this,
      loop: true,
    });
  
    gameOver = false;
  }
  
  function update() {
    if (!gameOver) {
      moveRedSquares();
      handleSquareInput();
  
      if (checkCollision()) {
        endGame();
      }
    }
  }
  
  function moveRedSquares() {
    redSquares.forEach((redSquare) => {
      let directions = ['up', 'down', 'left', 'right'].filter((direction) => {
        if (direction === 'up') return redSquare.y > 0;
        if (direction === 'down') return redSquare.y < config.height - redSquare.height;
        if (direction === 'left') return redSquare.x > 0;
        if (direction === 'right') return redSquare.x < config.width - redSquare.width;
      });
  
      let direction = Phaser.Utils.Array.GetRandom(directions);
  
      if (direction === 'up') redSquare.y = Math.max(0, redSquare.y - 10);
      if (direction === 'down') redSquare.y = Math.min(config.height - redSquare.height, redSquare.y + 10);
      if (direction === 'left') redSquare.x = Math.max(0, redSquare.x - 10);
      if (direction === 'right') redSquare.x = Math.min(config.width - redSquare.width, redSquare.x + 10);
    });
  }
  
  function handleSquareInput() {
    if (cursors.up.isDown) {
      square.y = Math.max(0, square.y - 10);
    } else if (cursors.down.isDown) {
      square.y = Math.min(config.height - square.displayHeight, square.y + 10);
    }
  
    if (cursors.left.isDown) {
      square.x = Math.max(0, square.x - 10);
    } else if (cursors.right.isDown) {
        square.x = Math.min(config.width - square.displayWidth, square.x + 10);
      }
    }
    
    function checkCollision() {
      return redSquares.some((redSquare) => {
        return Phaser.Geom.Intersects.RectangleToRectangle(square.getBounds(), redSquare.getBounds());
      });
    }
    
    function endGame() {
      gameOver = true;
      timeCounter.setColor('#ff0000');
    
      playAgainButton = this.add.text(config.width / 2, config.height / 2, 'Play Again', { fontSize: '36px', color: '#0000ff' });
      playAgainButton.setOrigin(0.5);
      playAgainButton.setInteractive();
      playAgainButton.on('pointerdown', () => {
        this.scene.restart();
      });
    }
    
    function randomPosition(size) {
      return Math.floor(Math.random() * (config.width - size));
    }
    
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
