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


  tileset.onload = function () {
    for (var i = 0; i < 5; i++) {
      var destinationX = centerX - tileSize / 2 + i * (tileSize + spacing);  
      var destinationY = canvas.height - tileSize;  

      ctx.drawImage(tileset, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight);
    }
  };
});