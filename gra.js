document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var tileset = new Image();
  tileset.src = "tileset.png";

  var tileSize = 16;

  var sourceX = 0;
  var sourceY = 0;
  var sourceWidth = tileSize;
  var sourceHeight = tileSize;

  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;

  var destinationWidth = tileSize;
  var destinationHeight = tileSize;

  var spacing = 0;

  var player = {
    x: centerX - tileSize / 2,
    y: canvas.height - tileSize * 2 - 16,
    width: 16,
    height: 32,
    speed: 2,
    fallSpeed: 2,
    moveLeft: false,
    moveRight: false
  };

  var squares = [];  // Tablica kwadratów

  tileset.onload = function () {
    // pętla - podstawa
    for (var i = 0; i < 5; i++) {
      squares.push({
        x: centerX - tileSize / 2 + i * (tileSize + spacing),
        y: canvas.height - tileSize,
        width: tileSize,
        height: tileSize
      });
    }

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    function keyDownHandler(e) {
      if (e.key === "a") {
        player.moveLeft = true;
      }
      if (e.key === "d") {
        player.moveRight = true;
      }
    }

    function keyUpHandler(e) {
      if (e.key === "a") {
        player.moveLeft = false;
      }
      if (e.key === "d") {
        player.moveRight = false;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Podstawa
      for (var i = 0; i < squares.length; i++) {
        ctx.drawImage(tileset, sourceX, sourceY, sourceWidth, sourceHeight, squares[i].x, squares[i].y, destinationWidth, destinationHeight);
      }

      // Gracz
      ctx.fillStyle = "blue";
      ctx.fillRect(player.x, player.y, player.width, player.height);

      if (player.moveLeft && player.x > 0) {
        player.x -= player.speed;
      }
      if (player.moveRight && player.x + player.width < canvas.width) {
        player.x += player.speed;
      }


      for (var j = 0; j < squares.length; j++) {
        if (checkCollision(player, squares[j])) {

          player.y = squares[j].y - player.height;


          player.fallSpeed = 0;
        }
      }

      // spadanie
      if (player.y < canvas.height - player.height) {
        player.y += player.fallSpeed;
        player.fallSpeed += 0.1; 
      }

      requestAnimationFrame(draw);
    }

    draw();
  };
});

// Kolizja
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}