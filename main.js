document.addEventListener("DOMContentLoaded", function () {
	
	deathSprites.forEach(function (image) {
  image.onload = function () {
 
 
  console.log("Obraz załadowany:", image.src);
 };
});





bugSprites.forEach(function (image) {
    image.onload = function () {
        console.log("Obrazek robaka załadowany:", image.src);
    };
    image.onerror = function () {
        console.error("Błąd ładowania obrazka robaka:", image.src);
    };
});

  function loadBugSprites() {
    return loadSprites([...Array(6).keys()], "bug/run/sprites_bug");
  }

  function Rectangle() {
    this.width = 16;
    this.height = 16;
    this.x = Math.random() * canvas.width;
    this.y = 0;
    this.speed = 2;

    this.image = new Image();
    this.image.src = "images/eye/spriteeye_0.png";
  }

function startBackgroundMusic() {
    backgroundAudio.play();
}

function stopBackgroundMusic() {
    backgroundAudio.pause();
}

  function loadIdleSprites() {
    player.idleSprites = loadSprites(player.idleSprites, "sprite_idle");
  }

  function loadRunSprites() {
    player.runSpritesRight = loadSprites(player.runSpritesRight, "spriterun_");
    player.runSpritesLeft = loadSprites(player.runSpritesLeft, "run_left/spriterunleft_");
  }

  function loadJumpSprites() {
    player.jumpSprites = loadSprites(player.jumpSprites, "jump/sprite_jump");
  }

  function loadHpSprites() {
    const hpContainer = document.createElement('div');
    hpContainer.style.display = 'flex';

    for (let i = 1; i <= 3; i++) {
      let hpLifeImage = new Image();
      hpLifeImage.src = "images/hp/zycie.png";
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
        img.src = "images/hp/zycie.png";
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
 

 
  
// Kolizja z robakiem
if (checkCollision(player, bug)) {
  // Jeśli gracz jest w trakcie skoku, zabicie robaka
  if (player.isJumping) {
    // Dodaj animację śmierci robaka
    bug.currentBugSpriteIndex = 0;  // Reset indeksu animacji
    bug.lastBugAnimationTime = performance.now();
    bugSprites = loadSprites([...Array(3).keys()], "bug/death/sprite_");
    
    // Zwiększenie punktacji lub dodanie życia
    if (lives < 3) {
      lives++;
    } else {
      score++;
    }

    // Ukryj robaka (nie usuwaj go z listy)
    bug.x = -1000;
    bug.y = -1000;
  } else {
    // Jeśli gracz nie jest w trakcie skoku, odpychanie gracza
    player.y = bug.y - player.height;
    player.onGround = true;
  }
}

// Animacja śmierci robaka
function animateBugDeath() {
  var now = performance.now();
  var elapsed = now - bug.lastBugAnimationTime;

  if (elapsed > 100) {
    bug.currentBugSpriteIndex++;

    if (bug.currentBugSpriteIndex >= bugSprites.length) {
      // Zakończ animację śmierci robaka
      bugSprites = loadSprites([...Array(6).keys()], "bug/run/sprite_bug");
      bug.currentBugSpriteIndex = 0;
    } else {
      bug.lastBugAnimationTime = now;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  
	if (score >=15){
	    ctx.drawImage(background4, 0, 0, canvas.width, canvas.height);
	} else if (score >= 10) {
        ctx.drawImage(background3, 0, 0, canvas.width, canvas.height);
    } else if (score >= 5) {
        ctx.drawImage(background2, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    }

    if (score >= 4 && !gameOver) {
        ctx.drawImage(ballImage, ball.x, ball.y, ball.size, ball.size);
        ball.y += ball.speed;

        // Sprawdź kolizję z graczem
        if (
            ball.x < player.x + player.width &&
            ball.x + ball.size > player.x &&
            ball.y < player.y + player.height &&
            ball.y + ball.size > player.y
        ) {
            gameOver = true;
            drawWinScreen();
        }
    }

if (score === 15) {
    var audio = document.getElementById("myAudio");
    audio.play();
  }

  if (instructionScreenVisible) {
    showInstructionScreen();
  } else if (gameOver) {
    showGameOverScreen();
  } else {
    squares.forEach((square) =>
      ctx.drawImage(tileset, 0, 0, tileSize, tileSize, square.x, square.y, tileSize, tileSize)
    );

    rectangles.forEach((rectangle) => {
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
	

drawImageWithOffset(fence, 16, 128);
drawImageWithOffset(fence2, 16, 128);
drawImageWithOffset(grave, 32, 128);
drawImageWithOffset(cross, 48, 128);
drawImageWithOffset(grass, 32, 80);
drawImageWithOffset(grass2, 32, 80);
drawImageWithOffset(grass3, 32, 80);
drawImageWithOffset(grass4, 32, 80);
drawImageWithOffset(grass5, 32, 80);
drawImageWithOffset(grass6, 32, 80);
drawImageWithOffset(grass7, 32, 80);
drawImageWithOffset(biggrass, 48, 80);
drawImageWithOffset(biggrass2, 48, 80);
drawImageWithOffset(biggrass3, 48, 80);
drawImageWithOffset(biggrass4, 48, 80);
drawImageWithOffset(flower, 64, 80);
drawImageWithOffset(flower2, 64, 80);
drawImageWithOffset(flower3, 64, 80);
drawImageWithOffset(flower4, 64, 80);

ctx.drawImage(mauzoleumImage, 300, canvas.height - 16 - 98, 90, 98);

  ctx.drawImage(tree01Image, 630, canvas.height - 64 - 16, 64, 64);
  ctx.drawImage(tree02Image, 200, canvas.height - 64 - 16, 64, 64);

    startJumpAnimation();

    try {
      var elapsedTimeBug = Date.now() - bug.lastBugAnimationTime;

      if (elapsedTimeBug > 100) {
        bug.currentBugSpriteIndex = (bug.currentBugSpriteIndex + 1) % bugSprites.length;
        bug.lastBugAnimationTime = Date.now();
      }

      bug.x -= bug.speed;

      if (bug.x + bug.width <= 0) {
        bug.x = canvas.width;
      }

      ctx.drawImage(bugSprites[bug.currentBugSpriteIndex], bug.x, bug.y, bug.width, bug.height);
    } catch (error) {
      console.error("Błąd podczas rysowania robaka:", error);
    }
function playDeathSound() {
  var deathSound = document.getElementById("deathSound");
  deathSound.play();
}


     if (lives <= 0) {
    if (!deathAnimationPlayed) {
      deathAnimationStartTime = Date.now();
      deathAnimationPlayed = true;
	  playDeathSound();
    }

    var elapsedTime = Date.now() - deathAnimationStartTime;

    if (elapsedTime < deathAnimationDuration) {
      deathSpriteIndex = Math.floor(elapsedTime / (deathAnimationDuration / deathSprites.length));
      ctx.drawImage(deathSprites[deathSpriteIndex], player.x, player.y, player.width, player.height);
    } else {
      deathAnimationPlayed = false;
      deathSpriteIndex = 0;
      gameOver = true;
      showGameOverScreen();
      return;
    }
    }
	else {
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
        player.moveRight &&
          player.x + player.width < canvas.width &&
          (player.x += player.speed);
      }

  if (bug.currentBugSpriteIndex < bugSprites.length) {
    drawImageWithOffset(bugSprites[bug.currentBugSpriteIndex], 0, 0, bug.x, bug.y);
    animateBugDeath();
  }

      squares.forEach((square) => {
        if (checkCollision(player, square)) {
          player.y = square.y - player.height;
          if (!player.isMoving) {
            startIdleAnimation();
          }
          player.onGround = true;
        }
      });

      rectangles.forEach((rectangle) => {
        if (checkCollision(player, rectangle)) {
          score++;
          rectangles.splice(rectangles.indexOf(rectangle), 1);
        }
      });
	  
	  rectangles.forEach((rectangle) => {
    ctx.drawImage(rectangle.image, rectangle.x, rectangle.y, rectangle.width, rectangle.height);

    rectangle.y += rectangle.speed;

    if (rectangle.y + rectangle.height >= canvas.height) {
      lives--;
      rectangles.splice(rectangles.indexOf(rectangle), 1);
    }

    if (checkCollision(player, rectangle)) {
      player.y = rectangle.y - player.height;
      if (!player.isMoving) {
        startIdleAnimation();
      }
      player.onGround = true;
    }
  });
	  
	  

  

    if (lives <= 0) {
      ctx.drawImage(deathSprites[deathSpriteIndex], player.x, player.y, player.width, player.height);
    } else {
      startRunAnimation();

        const currentSprites = player.isMoving
          ? player.moveRight
            ? player.runSpritesRight
            : player.runSpritesLeft
          : player.isJumping
          ? player.jumpSprites
          : player.idleSprites;
        const currentSpriteIndex = player.isMoving
          ? player.currentRunSpriteIndex
          : player.isJumping
          ? player.currentJumpSpriteIndex
          : player.currentIdleSpriteIndex;

        ctx.drawImage(
          currentSprites[currentSpriteIndex],
          player.x,
          player.y,
          player.width,
          player.height
        );

        for (let i = 0; i < lives; i++) {
          ctx.drawImage(hpImage, 10 + i * 20, 5, 16, 16);
        }

        ctx.textAlign = "right";
        ctx.fillText("Punkty: " + score, canvas.width - 10, 20);

        if (score >= 1 && score <= 24) {
          const creatureImage = new Image();
          let spriteNumber = score < 10 ? `0${score}` : score;
          let spritePath = `images/creature/uprising/sprite_creature${spriteNumber}.png`;

          creatureImage.src = spritePath;

          const middleSquareIndex = Math.floor(squares.length / 2);
          const middleSquare = squares[middleSquareIndex];

          ctx.drawImage(
            creatureImage,
            middleSquare.x,
            middleSquare.y - 64,
            64,
            64
          );
        }
      }
    }
	updateGameLogic();
    startBackgroundMusic();
    requestAnimationFrame(draw);
  }
}

function drawWinScreen() {
    ctx.fillStyle = "green";
    ctx.font = "40px Arial";
    ctx.fillText("Wygrałeś!", canvas.width / 2 - 100, canvas.height / 2);
}

function showGameOverScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Koniec gry - Przegrałeś", canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillText("Twój wynik: " + score, canvas.width / 2, canvas.height / 2);
  ctx.fillText("Naciśnij 'SPACJĘ' aby zacząć jeszcze raz,", canvas.width / 2, canvas.height / 2 + 60);
  ctx.fillText("ale lepiej odśwież stronę, bo restart jest zbugowany JESZCZE", canvas.width / 2, canvas.height / 2 + 90);
   
  ctx.fillText("Naciśnij 'S' aby zapisać wynik", canvas.width / 2, canvas.height / 2 + 120);
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
  
function updateGameLogic() {
  // Sprawdzenie kolizji między graczem a robakiem
  if (checkCollision(player, bug)) {
    // Tutaj umieść kod reakcji na kolizję
    if (player.y + player.height <= bug.y) {
      // Gracz skoczył na robaka, więc zabij robaka
      console.log("Zabito robaka!");
      // Tutaj możesz dodać kod do obsługi zabicie robaka, np. zwiększenie wyniku, zresetowanie pozycji robaka, itp.
      resetBugPosition();
    } else {
      // Gracz i robak są na tym samym poziomie, co oznacza utratę życia, restart gry itp.
      console.log("Kolizja z robakiem, utrata życia!");
    }
  }
}

function resetBugPosition() {
  bug.x = canvas.width; 
bug.y = canvas.height - tileSize - 32;}

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

