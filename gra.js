document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var tileSize = 16;
  var tileset = new Image();
  tileset.src = "tileset.png";

  var background = new Image();
  background.src = "images/background.png";

  var player = {
    x: 50,
    y: canvas.height - tileSize * 2 - 16,
    width: 16,
    height: 32,
    speed: 2,
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

  var squares = [];

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

  for (let i = 0; i < canvas.width / tileSize; i++) {
    squares.push({ x: i * tileSize, y: canvas.height - tileSize, width: tileSize, height: tileSize });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    squares.forEach(square => ctx.drawImage(tileset, 0, 0, tileSize, tileSize, square.x, square.y, tileSize, tileSize));

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

    player.y + player.height >= canvas.height && (player.y = canvas.height - player.height, player.fallSpeed = 0, player.isJumping = false, !player.isMoving && startIdleAnimation());

    player.y += player.fallSpeed;
    player.fallSpeed += 0.1;

    startRunAnimation();

    const currentSprites = player.isMoving ? (player.moveRight ? player.runSpritesRight : player.runSpritesLeft) : player.idleSprites;
    const currentSpriteIndex = player.isMoving ? player.currentRunSpriteIndex : player.currentIdleSpriteIndex;

    ctx.drawImage(currentSprites[currentSpriteIndex], player.x, player.y, player.width, player.height);

    requestAnimationFrame(draw);
  }

  tileset.onload = function () {
    draw();
  };
});

function checkCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
}