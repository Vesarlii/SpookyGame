document.addEventListener("DOMContentLoaded", function () {
  // Przykład uzyskiwania dostępu do canvasu i kontekstu 2D
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  // Przykład uzyskiwania dostępu do tilesetu
  var tileset = new Image();
  tileset.src = "tileset.png";  // Zmień na odpowiednią ścieżkę

  // Wymiary pojedynczego kwadracika w tilesecie
  var tileSize = 16;

  // Wyciągnij lewy, górny kwadracik o wymiarach 16x16 pikseli
  var sourceX = 0;
  var sourceY = 0;
  var sourceWidth = tileSize;
  var sourceHeight = tileSize;

  // Oblicz środek canvasu
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;

  // Wstaw ten fragment na canvasie, w poziomie na środku, w pionie na dole
  var destinationWidth = tileSize;
  var destinationHeight = tileSize;

  // Odległość między kolejnymi kwadracikami (ustawione na 0)
  var spacing = 0;

  // Rysuj fragment na canvasie po załadowaniu tilesetu
  tileset.onload = function () {
    for (var i = 0; i < 5; i++) {
      var destinationX = centerX - tileSize / 2 + i * (tileSize + spacing);  // Tuż obok siebie bez odstępu
      var destinationY = canvas.height - tileSize;  // Odpowiada za umieszczenie w pionie na dole

      ctx.drawImage(tileset, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight);
    }
  };
});