var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var tileSize = 16;
  var tileset = new Image();
  tileset.src = "tileset.png";

	var background = new Image();
	background.src = "images/background.png";
	var background2 = new Image();
	background2.src = "images/background2.png";
	var background3 = new Image();
	background3.src = "images/background3.png";
	var background4 = new Image();
	background4.src = "images/background4.png";
	
	var backgroundAudio = document.getElementById("backgroundSong");

var ghostImage = new Image();
ghostImage.src = "images/ghost.png";
var ghostFalling = false;

var ghost = {
    x: 400,
    y: -50,
    speed: 2,
	size:50
};

var ballImage = new Image();
ballImage.src = "images/kulka.png";
var ballFalling = false;
var specialScore = 0;

var ball = {
	x: 400,
    y: -50,
    speed: 1,
	size:50
};

  var hpImage = new Image();
  hpImage.src = "images/hp/zycie.png";

  var instructionScreenVisible = false;
  var gameOver = false;
  
  var deathSprites = [
  new Image(), // "sprite_death0.png"
  new Image(), // "sprite_death1.png"
  new Image(), // "sprite_death2.png"
  new Image(), // "sprite_death3.png"
  new Image(), // "sprite_death4.png"
  new Image(),  // "sprite_death5.png"
  new Image(),  // "sprite_death6.png"
];


	deathSprites[0].src = "images/death/sprite_death0.png";
	deathSprites[1].src = "images/death/sprite_death1.png";
	deathSprites[2].src = "images/death/sprite_death2.png";
	deathSprites[3].src = "images/death/sprite_death3.png";
	deathSprites[4].src = "images/death/sprite_death4.png";
	deathSprites[5].src = "images/death/sprite_death5.png";
	deathSprites[6].src = "images/death/sprite_death6.png";

  // var deathSprites = ["sprite_death0.png", "sprite_death1.png", "sprite_death2.png", "sprite_death3.png", "sprite_death4.png", "sprite_death5.png", "sprite_death6.png"];

var mauzoleumImage = new Image();
mauzoleumImage.src = "images/mauzoleum.png";

var tree01Image = new Image();
tree01Image.src = "images/tree01.png";

var tree02Image = new Image();
tree02Image.src = "images/tree02.png";

 var player = {
    x: 50,
    y: canvas.height - tileSize * 2 - 16,
    width: 32,
    height: 32,
    speed: 8,
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

 
  var deathAnimationStartTime = 0;
  var deathAnimationDuration = 2000;
  var deathSpriteIndex = 0;
  var deathAnimationPlayed = false;
  
  function createObject(x, y) {
  return {
    x: x,
    y: y,
    width: tileSize,
    height: tileSize,
    image: (function() {
      var img = new Image();
      img.src = "tileset.png";
      img.onload = function() {
        console.log("Obrazek tileset załadowany:", img.src);
      };
      return img;
    })()
  };
}

function drawImageWithOffset(imageObj, offsetX, offsetY) {
  if (imageObj && imageObj.image && imageObj.image instanceof Image && imageObj.image.complete) {
    ctx.drawImage(
      imageObj.image,
      offsetX,
      offsetY,
      tileSize,
      tileSize,
      imageObj.x,
      imageObj.y,
      tileSize,
      tileSize
    );
  } 
}


  
var fence = createObject(canvas.width - 64, canvas.height - 32);
var fence2 = createObject(canvas.width - 80, canvas.height - 32);
var grave = createObject(canvas.width - 128, canvas.height - 32);
var cross = createObject(canvas.width - 256, canvas.height - 32);
var grass = createObject(canvas.width - 272, canvas.height - 32);
var grass2 = createObject(canvas.width - 96, canvas.height - 32);
var grass3 = createObject(canvas.width - 160, canvas.height - 32);
var grass4 = createObject(528, canvas.height - 32);
var grass5 = createObject(80, canvas.height - 32);
var grass6 = createObject(176, canvas.height - 32);
var grass7 = createObject(256, canvas.height - 32);
var biggrass = createObject(canvas.width - 112, canvas.height - 32);
var biggrass2 = createObject(canvas.width - 144, canvas.height - 32);
var biggrass3 = createObject(112, canvas.height - 32);
var biggrass4 = createObject(160, canvas.height - 32);
var flower = createObject(144, canvas.height - 32);
var flower2 = createObject(272, canvas.height - 32);
var flower3 = createObject(512, canvas.height - 32);
var flower4 = createObject(672, canvas.height - 32);

  function loadSprites(spriteSet, prefix) {
    return spriteSet.map((sprite, index) => Object.assign(new Image(), { src: "images/" + prefix + index + ".png" }));
  }

    var bugSprites = loadSprites([...Array(6).keys()], "bug/run/sprite_bug");
  var bug = {
    x: canvas.width,
    y: canvas.height - tileSize - 32,
    width: 32,
    height: 32,
    speed: 2,
    currentBugSpriteIndex: 0,
    lastBugAnimationTime: 0
  };
  
  