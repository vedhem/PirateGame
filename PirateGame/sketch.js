const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var balls = [];
var boats = [];
var boatAnimation = [];
var boatSpriteData, boatSpriteSheet;
var brokenBoatAnimation = [];
var brokenBoatSpriteData, brokenBoatSpriteSheet;
var waterSplashAnimation = [];
var waterSplashSpriteData, waterSplashSpriteSheet;
var canvas, angle, tower, ground, cannon;
var backgroundMusic;
var cannonExplode;
var cannonWater;
var pirateLaugh;
var isGameOver = false;
var isLaughing = false;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpriteData = loadJSON("assets/boat/boat.json");
  boatSpriteSheet = loadImage("assets/boat/boat.png");
  brokenBoatSpriteData = loadJSON("assets/boat/brokenBoat.json");
  brokenBoatSpriteSheet = loadImage("assets/boat/brokenBoat.png");
  waterSplashSpriteData = loadJSON("assets/water/waterSplash.json");
  waterSplashSpriteSheet = loadImage("assets/water/waterSplash.png");
  backgroundMusic = loadSound("assets/assets_background_music.mp3");
  cannonExplode = loadSound("assets/assets_cannon_explosion.mp3");
  cannonWater = loadSound("assets/assets_cannon_water.mp3");
  pirateLaugh = loadSound("assets/assets_pirate_laugh.mp3");
}

function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  
  var options = {
    isStatic: true
  }

  angleMode(DEGREES);
  angle = 15;

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, options);
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, options);
  World.add(world, tower);
  
  cannon = new Cannon(180, 110, 130,  130, angle);

  var boatFrames = boatSpriteData.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

  var brokenBoatFrames = brokenBoatSpriteData.frames;
  for (var i = 0; i < brokenBoatFrames; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }

  var waterFrames = waterSplashSpriteData.frames;
  for (var i = 0; i < waterFrames.length; i++) {
    var pos = waterFrames[i].position;
    var img = waterSplashSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function draw() {
  background(20);
  image(backgroundImg,0,0,1200,600)
  if (!backgroundMusic.isPlaying()) {
    backgroundMusic.play();
    backgroundMusic.setVolume(0.1);
  }
  Engine.update(engine);

  push();
  translate(ground.position.x, ground.position.y);
  fill("brown");
  rectMode(CENTER);
  rect(0, 0, width * 2, 1);
  pop();

  push();
  translate(tower.position.x, tower.position.y);
  rotate(tower.angle);
  imageMode(CENTER);
  image(towerImage, 0, 0, 160, 310);
  pop();  

  showBoats();

  for (var i=0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    boatCollision(i);
  }

  cannon.display();
}

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display();
    ball.animate();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
      ball.remove(index);
    }
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length-1].shoot();
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (boats.length < 4 && boats[boats.length - 1].body.position.x < width - 300) {
      var positions = [-40, -60, -70, -50];
      var position = random(positions);
      var boat = new Boat(width, height - 100, 150, 170, position, boatAnimation);
      boats.push(boat);
    }

    for (var i = 0; i < boats.length; i++) {
        Matter.Body.setVelocity(boats[i].body, {x : -0.9, y : 0});
        


        boats[i].display();
        boats[i].animate();
        var collision = Matter.SAT.collides(this.tower, boats[i].body);
        if (collision.collided && !boats[i].isBroken) {
          if (!isLaughing && !pirateLaugh.isPlaying()) {
            pirateLaugh.play();
            isLaughing = true;
          }
          isGameOver = true;
        }
    }
  }
  else {
    var boat = new Boat(width, height - 100, 150, 170, -50, boatAnimation);
    boats.push(boat);
  }
}

function boatCollision(index) {
  for(var i = 0; i < boats.length; i++) {
    if (balls[index] !== undefined && boats[i] !== undefined) {
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);

      if (collision.collided) {
        boats[i].remove(i);

        Matter.World.remove(world, balls[index].body);
        delete balls[index];
      }
    }
  }
}
