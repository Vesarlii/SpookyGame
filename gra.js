document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var tileSize = 16;
  var tileset = new Image();
  tileset.src = "tileset.png";

  var background = new Image();
  background.src = "images/background.png";

  var hpImage = new Image();
  hpImage.src = "images/HP/zycie.png";

  var instructionScreenVisible = false;
  var gameOver = false;
  
  var deathSprites = [
  new Image(), // "sprite_death0.png"
  new Image(), // "sprite_death1.png"
  new Image(), // "sprite_death2.png"
  new Image(), // "sprite_death3.png"
  new Image(), // "sprite_death4.png"
  new Image()  // "sprite_death5.png"
];


deathSprites[0].src = "images/death/sprite_death0.png";
deathSprites[1].src = "images/death/sprite_death1.png";
deathSprites[2].src = "images/death/sprite_death2.png";
deathSprites[3].src = "images/death/sprite_death3.png";
deathSprites[4].src = "images/death/sprite_death4.png";
deathSprites[5].src = "images/death/sprite_death5.png";

deathSprites.forEach(function (image) {
  image.onload = function () {
 
 
  console.log("Obraz załadowany:", image.src);
 };
});


  var player = {
    x: 50,
    y: canvas.height - tileSize * 2 - 16,
    width: 16,
    height: 32,
    speed: 4,
    isMoving: false,
    moveLeft: false,
    moveRight: false,
    isJumping: false,
    onGround: true,
    jumpHeight: 128,
    jumpVelocity: 8,
    jumpSprites: ["sprite_jump0.png", "sprite_jump1.png"],
    currentJumpSpriteIndex: 0,
    lastJumpAnimationTime: 0,
    idleSprites: ["sprite_idle0.png", "sprite_idle1.png", "sprite_idle2.png", "sprite_idle3.png"],
    runSpritesRight: ["spriterun_0.png", "spriterun_1.png", "spriterun_2.png", "spriterun_3.png", "spriterun_4.png", "spriterun_5.png", "spriterun_6.png", "spriterun_7.png"],
    runSpritesLeft: ["spriterunleft_0.png", "spriterunleft_1.png", "spriterunleft_2.png", "spriterunleft_3.png", "spriterunleft_4.png", "spriterunleft_5.png", "spriterunleft_6.png", "spriterunleft_7.png"],
    currentRunSpriteIndex: 0,
    lastRunAnimationTime: 0,
    currentIdleSpriteIndex: 0,
    lastIdleAnimationTime: 0
  };

  var rectangles = [];
  var squares = [];
  var score = 0;
  var lives = 3;

 // var deathSprites = ["sprite_death0.png", "sprite_death1.png", "sprite_death2.png", "sprite_death3.png", "sprite_death4.png", "sprite_death5.png"];
  var deathAnimationStartTime = 0;
  var deathAnimationDuration = 2000;
  var deathSpriteIndex = 0;
  var deathAnimationPlayed = false;

  function Rectangle() {
    this.width = 16;
    this.height = 16;
    this.x = Math.random() * canvas.width;
    this.y = 0;
    this.speed = 2;

    this.image = new Image();
    this.image.src = "images/eye/spriteeye_0.png";
  }

  function loadSprites(spriteSet, prefix) {
    return spriteSet.map((sprite, index) => Object.assign(new Image(), { src: "images/" + prefix + index + ".png" }));
  }

  function loadIdleSprites() {
    player.idleSprites = loadSprites(player.idleSprites, "sprite_idle");
  }

  function loadRunSprites() {
    player.runSpritesRight = loadSprites(player.runSpritesRight, "spriterun_");
    player.runSpritesLeft = loadSprites(player.runSpritesLeft, "run_left/spriterunleft_");
  }

  function loadJumpSprites() {
    player.jumpSprites = loadSprites(player.jumpSprites, "Jump/sprite_jump");
  }

  function loadHpSprites() {
    const hpContainer = document.createElement('div');
    hpContainer.style.display = 'flex';

    for (let i = 1; i <= 3; i++) {
      let hpLifeImage = new Image();
      hpLifeImage.src = "images/HP/zycie.png";
      hpLifeImage.width = 16;
      hpLifeImage.height = 16;
      hpContainer.appendChild(hpLifeImage);
    }

    document.body.appendChild(hpContainer);
    document.body.appendChild(document.createTextNode("Życia: "));
  }

  function draw(lives) {
    if (lives >= 1 && lives <= 3) {
      const container = document.createElement('div');
      container.style.display = 'flex';

      for (let i = 0; i < lives; i++) {
        const img = document.createElement('img');
        img.src = "images/HP/zycie.png";
        img.width = 16;
        img.height = 16;
        container.appendChild(img);
      }

      document.body.appendChild(container);
    } else {
      console.error("Nieprawidłowa liczba żyć. Wprowadź liczbę od 1 do 3.");
    }
  }

  loadIdleSprites();
  loadRunSprites();
  loadJumpSprites();
  loadHpSprites();

  showInstructionScreen();

  document.addEventListener("keydown", function startGameOnKeyPress(e) {
    if (e.key !== " ") {
      document.removeEventListener("keydown", startGameOnKeyPress);
      hideInstructionScreen();
      startGame();
    }
  });

  function showInstructionScreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";

    ctx.fillText("Witaj w mojej grze!", canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText("Sterowanie:", canvas.width / 2, canvas.height / 2);
    ctx.fillText("A - Ruch w lewo", canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText("D - Ruch w prawo", canvas.width / 2, canvas.height / 2 + 60);
    ctx.fillText("Spacja - Skok", canvas.width / 2, canvas.height / 2 + 90);
    ctx.fillText("Naciśnij dowolny klawisz, aby rozpocząć", canvas.width / 2, canvas.height / 2 + 150);

    instructionScreenVisible = true;
  }

  function hideInstructionScreen() {
    instructionScreenVisible = false;
  }

  document.addEventListener("keydown", keyHandler);
  document.addEventListener("keyup", keyHandler);

  function keyHandler(e) {
    const keys = { "a": "moveLeft", "d": "moveRight", " ": "jump" };
    if (keys[e.key] !== undefined) {
      if (e.key === " ") {
        if (!player.isJumping && player.onGround) {
          player.isJumping = true;
          player.onGround = false;
        }
      } else {
        player[keys[e.key]] = e.type === "keydown";
        player.isMoving = player.moveLeft || player.moveRight;
      }
    }
  }

  function startIdleAnimation() {
    if (!player.isMoving && (Date.now() - player.lastIdleAnimationTime) > 200) {
      player.currentIdleSpriteIndex = (player.currentIdleSpriteIndex + 1) % player.idleSprites.length;
      player.lastIdleAnimationTime = Date.now();
    }
  }

  function startRunAnimation() {
    if (player.isMoving && (Date.now() - player.lastRunAnimationTime) > 100) {
      const runSprites = player.moveRight ? player.runSpritesRight : player.runSpritesLeft;
      player.currentRunSpriteIndex = (player.currentRunSpriteIndex + 1) % runSprites.length;
      player.lastRunAnimationTime = Date.now();
    }
  }

  function startJumpAnimation() {
    if (player.isJumping) {
      if ((Date.now() - player.lastJumpAnimationTime) > 200) {
        player.currentJumpSpriteIndex = (player.currentJumpSpriteIndex + 1) % player.jumpSprites.length;
        player.lastJumpAnimationTime = Date.now();
      }
    }
  }

  function startGame() {
    player.x = 50;
    player.y = canvas.height - tileSize * 2 - 16;
    player.isMoving = false;
    player.moveLeft = false;
    player.moveRight = false;
    player.isJumping = false;
    player.onGround = true;
    player.currentIdleSpriteIndex = 0;
    player.lastIdleAnimationTime = 0;
    player.currentRunSpriteIndex = 0;
    player.lastRunAnimationTime = 0;
    player.currentJumpSpriteIndex = 0;
    player.lastJumpAnimationTime = 0;

    rectangles = [];
    gameOver = false;

    hideInstructionScreen();
    requestAnimationFrame(draw);
  }

  function spawnRectangle() {
    rectangles.push(new Rectangle());
  }

  for (let i = 0; i < canvas.width / tileSize; i++) {
    squares.push({ x: i * tileSize, y: canvas.height - tileSize, width: tileSize, height: tileSize });
  }

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  if (instructionScreenVisible) {
    showInstructionScreen();
  } else if (gameOver) {
    showGameOverScreen();
  } else {
    squares.forEach(square => ctx.drawImage(tileset, 0, 0, tileSize, tileSize, square.x, square.y, tileSize, tileSize));

    rectangles.forEach(rectangle => {
      ctx.drawImage(rectangle.image, rectangle.x, rectangle.y, rectangle.width, rectangle.height);

      rectangle.y += rectangle.speed;

      if (rectangle.y + rectangle.height >= canvas.height) {
        lives--;
        rectangles.splice(rectangles.indexOf(rectangle), 1);
      }

      if (checkCollision(player, rectangle)) {
        score++;
        rectangles.splice(rectangles.indexOf(rectangle), 1);
      }
    });

    startJumpAnimation();

    if (lives <= 0) {
      if (!deathAnimationPlayed) {
        deathAnimationStartTime = Date.now();
        deathAnimationPlayed = true;
      }

      var elapsedTime = Date.now() - deathAnimationStartTime;

      if (elapsedTime < deathAnimationDuration) {
        deathSpriteIndex = Math.floor(elapsedTime / (deathAnimationDuration / deathSprites.length));
      } else {
        deathAnimationPlayed = false;
        deathSpriteIndex = 0;
        gameOver = true;
        showGameOverScreen();
        return;
      }
    }

    if (player.isJumping) {
      player.y -= player.jumpVelocity;

      if (player.y <= canvas.height - player.jumpHeight) {
        player.isJumping = false;
      }
    } else {
      if (player.y < canvas.height - tileSize * 2 - 16) {
        player.y += player.jumpVelocity;
      } else {
        player.onGround = true;
      }
    }

    if (lives > 0) {
      player.moveLeft && player.x > 0 && (player.x -= player.speed);
      player.moveRight && player.x + player.width < canvas.width && (player.x += player.speed);
    }

    squares.forEach(square => {
      if (checkCollision(player, square)) {
        player.y = square.y - player.height;
        if (!player.isMoving) {
          startIdleAnimation();
        }
        player.onGround = true;
      }
    });

    rectangles.forEach(rectangle => {
      if (checkCollision(player, rectangle)) {
        score++;
        rectangles.splice(rectangles.indexOf(rectangle), 1);
      }
    });

    if (lives <= 0) {
      ctx.drawImage(deathSprites[deathSpriteIndex], player.x, player.y, player.width, player.height);
    } else {
      startRunAnimation();

      const currentSprites = player.isMoving ? (player.moveRight ? player.runSpritesRight : player.runSpritesLeft) : (player.isJumping ? player.jumpSprites : player.idleSprites);
      const currentSpriteIndex = player.isMoving ? player.currentRunSpriteIndex : (player.isJumping ? player.currentJumpSpriteIndex : player.currentIdleSpriteIndex);

      ctx.drawImage(currentSprites[currentSpriteIndex], player.x, player.y, player.width, player.height);

      for (let i = 0; i < lives; i++) {
        ctx.drawImage(hpImage, 10 + i * 20, 5, 16, 16);
      }

      ctx.textAlign = "right";
      ctx.fillText("Punkty: " + score, canvas.width - 10, 20);


      if (score >= 1 && score <= 15) {
        const creatureImage = new Image();
        let spriteNumber = (score < 10) ? `0${score}` : score;
        let spritePath = `images/Creature/uprising/sprite_creature${spriteNumber}.png`;

        creatureImage.src = spritePath;

        const middleSquareIndex = Math.floor(squares.length / 2);
        const middleSquare = squares[middleSquareIndex];

        ctx.drawImage(creatureImage, middleSquare.x, middleSquare.y - 64, 64, 64);
      }
    }

    requestAnimationFrame(draw);
  }
}

  function showGameOverScreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Koniec gry - Przegrałeś", canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText("Twój wynik: " + score, canvas.width / 2, canvas.height / 2);
    ctx.fillText("Naciśnij 'SPACJĘ' aby zacząć jeszcze raz", canvas.width / 2, canvas.height / 2 + 60);
    ctx.fillText("Naciśnij 'S' aby zapisać wynik", canvas.width / 2, canvas.height / 2 + 90);
  }

  document.addEventListener("keydown", function (e) {
    if (gameOver && e.key === " ") {
      resetGame();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (gameOver && e.key === "s") {
      saveScore();
    }
  });

  function saveScore() {
    const playerName = prompt("Podaj swoje imię:");
    if (playerName) {
      const scoreEntry = document.createElement("tr");
      scoreEntry.innerHTML = `<td></td><td>${playerName}</td><td>${score}</td>`;
      document.getElementById("scoreTableBody").appendChild(scoreEntry);
    }
  }

  setInterval(spawnRectangle, 2000);

  function checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  function resetGame() {
    score = 0;
    lives = 3;
    player.speed = 4;
    player.isMoving = false;
    player.moveLeft = false;
    player.moveRight = false;
    player.isJumping = false;
    player.onGround = true;
    deathAnimationPlayed = false;
    player.currentIdleSpriteIndex = 0;
    player.lastIdleAnimationTime = 0;
    player.currentRunSpriteIndex = 0;
    player.lastRunAnimationTime = 0;
    player.currentJumpSpriteIndex = 0;
    player.lastJumpAnimationTime = 0;

    document.removeEventListener("keydown", keyHandler);
    document.removeEventListener("keyup", keyHandler);

    document.addEventListener("keydown", keyHandler);
    document.addEventListener("keyup", keyHandler);

    showInstructionScreen();

    document.addEventListener("keydown", function startGameOnKeyPress(e) {
      if (e.key !== " ") {
        document.removeEventListener("keydown", startGameOnKeyPress);
        hideInstructionScreen();
        startGame();
      }
    });
  }
});

function showGameOverScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Koniec gry - Przegrałeś", canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillText("Twój wynik: " + score, canvas.width / 2, canvas.height / 2);
  ctx.fillText("Naciśnij 'SPACJĘ' aby zacząć jeszcze raz", canvas.width / 2, canvas.height / 2 + 60);
  ctx.fillText("Naciśnij 'S' aby zapisać wynik", canvas.width / 2, canvas.height / 2 + 90);
}
