document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var tileSize = 16;
  var tileset = new Image();
  tileset.src = "tileset.png";

  var background = new Image();
  background.src = "images/background.png";

  var instructionScreenVisible = false;

  var player = {
    x: 50,
    y: canvas.height - tileSize * 2 - 16,
    width: 16,
    height: 32,
    speed: 4,
    fallSpeed: 0,
    jumpForce: 4,
    isJumping: false,
    isMoving: false,
    moveLeft: false,
    moveRight: false,
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

  function Rectangle() {
    this.width = 16;
    this.height = 16;
    this.x = Math.random() * canvas.width;
    this.y = 0;
    this.speed = 2;
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

  loadIdleSprites();
  loadRunSprites();

  showInstructionScreen();

  document.addEventListener("keydown", function startGameOnKeyPress() {
    document.removeEventListener("keydown", startGameOnKeyPress);
    hideInstructionScreen();
    startGame();
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
      player[keys[e.key]] = e.type === "keydown";
      player.isMoving = player.moveLeft || player.moveRight;
      if (keys[e.key] === "jump" && !player.isJumping) {
        player.isJumping = true;
        player.fallSpeed = -player.jumpForce;
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

  function startGame() {
    player.x = 50;
    player.y = canvas.height - tileSize * 2 - 16;
    player.isJumping = false;
    player.isMoving = false;
    player.moveLeft = false;
    player.moveRight = false;
    player.fallSpeed = 0;
    player.currentIdleSpriteIndex = 0;
    player.lastIdleAnimationTime = 0;
    player.currentRunSpriteIndex = 0;
    player.lastRunAnimationTime = 0;

    rectangles = []; // Resetujemy prostokąty przy rozpoczęciu nowej gry

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
    } else {
      squares.forEach(square => ctx.drawImage(tileset, 0, 0, tileSize, tileSize, square.x, square.y, tileSize, tileSize));

      // Rysuj prostokąty
      rectangles.forEach(rectangle => {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);

        // Aktualizuj pozycję prostokąta
        rectangle.y += rectangle.speed;

        // Sprawdź, czy prostokąt dotknął dolnej krawędzi planszy
        if (rectangle.y + rectangle.height >= canvas.height) {
          // Odejmij życie, gdy prostokąt dotknie dolnej krawędzi
          lives--;
          // Usuń prostokąty, które dotarły do dolnej krawędzi
          rectangles.splice(rectangles.indexOf(rectangle), 1);
        }

        // Sprawdzanie kolizji z graczem
        if (checkCollision(player, rectangle)) {
          // Dodaj punkt, gdy gracz dotknie prostokąta
          score++;
          rectangles.splice(rectangles.indexOf(rectangle), 1);
        }
      });

      player.moveLeft && player.x > 0 && (player.x -= player.speed);
      player.moveRight && player.x + player.width < canvas.width && (player.x += player.speed);

      squares.forEach(square => {
        if (checkCollision(player, square)) {
          player.y = square.y - player.height;
          player.fallSpeed = 0;
          player.isJumping = false;
          if (!player.isMoving) {
            startIdleAnimation();
          }
        }
      });

      // Sprawdzenie kolizji z prostokątami
      rectangles.forEach(rectangle => {
        if (checkCollision(player, rectangle)) {
          // Gracz zdobywa punkt, a prostokąt znika
          score++;
          rectangles.splice(rectangles.indexOf(rectangle), 1);
        }
      });

      // Sprawdź, czy gracz stracił życie
      if (player.y + player.height >= canvas.height) {
        // Odejmij życie
        lives--;

        player.y = canvas.height - player.height;
        player.fallSpeed = 0;
        player.isJumping = false;
        !player.isMoving && startIdleAnimation();
      }

      // Sprawdź, czy gracz stracił wszystkie życia
      if (lives <= 0) {
        // Tutaj możesz dodać kod zakończenia gry, na przykład wyświetlić komunikat lub zresetować grę
        resetGame();
      }

      player.y += player.fallSpeed;
      player.fallSpeed += 0.1;

      startRunAnimation();

      const currentSprites = player.isMoving ? (player.moveRight ? player.runSpritesRight : player.runSpritesLeft) : player.idleSprites;
      const currentSpriteIndex = player.isMoving ? player.currentRunSpriteIndex : player.currentIdleSpriteIndex;

      ctx.drawImage(currentSprites[currentSpriteIndex], player.x, player.y, player.width, player.height);
    }

    // Rysowanie licznika punktów w rogu canvas
    ctx.fillStyle = "#FFF";
    ctx.font = "16px Arial";
    ctx.textAlign = "right";
    ctx.fillText("Punkty: " + score, canvas.width - 10, 20);

    // Rysowanie licznika żyć w rogu canvas
    ctx.fillStyle = "#FFF";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Życia: " + lives, 10, 20);

    requestAnimationFrame(draw);
  }

  // Funkcja resetująca grę po zakończeniu
  function resetGame() {
    // Przywróć punkty i życia do początkowych wartości
    score = 0;
    lives = 3;
    // Dodaj nowe prostokąty i zresetuj gracza
    rectangles = [];
    player.x = 50;
    player.y = canvas.height - tileSize * 2 - 16;
    player.isJumping = false;
    player.isMoving = false;
    player.moveLeft = false;
    player.moveRight = false;
    player.fallSpeed = 0;
    player.currentIdleSpriteIndex = 0;
    player.lastIdleAnimationTime = 0;
    player.currentRunSpriteIndex = 0;
    player.lastRunAnimationTime = 0;
    // Ponownie wyświetl planszę z instrukcjami
    showInstructionScreen();
  }

  tileset.onload = function () {
    // draw();
  };

  // Dodaj nowy prostokąt co określony czas
  setInterval(spawnRectangle, 2000);
});

function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}