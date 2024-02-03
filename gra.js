document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var tileSize = 16;
  var tileset = new Image();
  tileset.src = "tileset.png"; 

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
    currentIdleSpriteIndex: 0,
    lastIdleAnimationTime: 0
  };

  var squares = [];

  function loadIdleSprites() {
    player.idleSprites = player.idleSprites.map(sprite => Object.assign(new Image(), { src: "images/" + sprite }));
  }

  loadIdleSprites();

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

  for (let i = 0; i < canvas.width / tileSize; i++) {
    squares.push({ x: i * tileSize, y: canvas.height - tileSize, width: tileSize, height: tileSize });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    ctx.drawImage(player.idleSprites[player.currentIdleSpriteIndex], player.x, player.y, player.width, player.height);

    requestAnimationFrame(draw);
  }

  tileset.onload = function () {
    draw();
  };
});

function checkCollision(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
}