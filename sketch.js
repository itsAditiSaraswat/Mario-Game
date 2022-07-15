var bgImage, bg;
var mario, mario_running, mario_collided;
var jumpSound;
var brickImage, brickGroup;
var coinAnim, coinGroup;
// var totalCoins = 0;
var coinScore = 0;
// document.getElementById("coinsCollected").innerText = `0`;
var mushAnim, turtleAnim, obstacleGroup ;
var gameoverSound;
var restartImage, restart;
var gameState = "PLAY";

function preload(){
    // Background
    bgImage = loadImage("images/bgnew.jpg");

    // Mario
    mario_running = loadAnimation (
        "images/mar1.png",
        "images/mar2.png",
        "images/mar3.png",
        "images/mar4.png",
        "images/mar5.png",
        "images/mar6.png",
        "images/mar7.png",
    )
    mario_collided = loadAnimation("images/dead.png");
    // Load jump sound
    jumpSound = loadSound("sounds/jump.mp3");

    // Brick
    brickImage = loadImage('images/brick.png');

    // Coins
    coinAnim = loadAnimation (
        "images/con1.png",
        "images/con2.png",
        "images/con3.png",
        "images/con4.png",
        "images/con5.png",
        "images/con6.png",
    )

    // Coin collecting sound
    coinSound = loadSound("sounds/coinSound.mp3");

    // Mush
    mushAnim = loadAnimation(
        "images/mush1.png",
        "images/mush2.png",
        "images/mush3.png",
        "images/mush4.png",
        "images/mush5.png",
        "images/mush6.png",
    )
    // Turtle
    turtleAnim = loadAnimation(
        "images/tur1.png",
        "images/tur2.png",
        "images/tur3.png",
        "images/tur4.png",
        "images/tur5.png",
    )

    // Game over sound
    gameoverSound = loadSound("sounds/dieSound.mp3");

    // Restart Image
    restartImage = loadImage("images/restart.png");
}

function setup() {
    createCanvas(1000, 600);

    bg = createSprite(600, 300);
    bg.addImage(bgImage);
    bg.scale = 0.5; 

    mario = createSprite(200, 520,20,50);
    mario.addAnimation("running", mario_running);
    mario.addAnimation("collided", mario_collided);
    mario.scale = 0.2;

    ground = createSprite(200, 580, 400, 10);

    brickGroup = new Group();

    coinGroup = new Group();

    obstacleGroup = new Group();

    //Restart Object creation
    restart = createSprite(500, 300);
    restart.addImage(restartImage);
    restart.visible = false;
}

function draw() {
    drawSprites();

    if (gameState === "PLAY") {
        bg.velocityX = -6;

        if(bg.x < 100) {
            bg.x = bg.width / 4;
        }        

        // Code to make mario up
        if (keyDown("space")) {
            mario.velocityY = -10;
            jumpSound.play();
        }

        // Code to make mario down
        mario.velocityY = mario.velocityY + 1.0;

        mario.collide(ground);
        ground.visible = false;

        generateBricks();

        for(let i=0; i<brickGroup.length; i++)
        {
            var temp = brickGroup.get(i);
            if(temp.isTouching(mario))
            {
                mario.collide(temp);
            }
        }

        // Fixing mario issues
        if(mario.x < 200) {
            mario.x = 200;
        }
        if(mario.y < 50) {
            mario.y = 50;
        }

        generateCoins();
        for(let i=0; i<coinGroup.length; i++)
        {
            var temp = coinGroup.get(i);
            if(temp.isTouching(mario))
            {
                // temp.remove(mario);
                coinScore++;
                temp.destroy();
                temp = null;
                coinSound.play();
                // totalCoins++;
                // document.getElementById("coinsCollected").innerText = `${totalCoins}`;
            }
        }

        generateObstacle();
        for(let i=0; i<obstacleGroup.length; i++)
        {
            var temp = obstacleGroup.get(i);
            if(temp.isTouching(mario))
            {
                gameoverSound.play();
                gameState = "END";
            }
        }
    }

    //when mario dies
    else if (gameState == "END") {
        bg.velocityX = 0;
        mario.velocityX = 0;
        mario.velocityY = 0;

        mario.changeAnimation("collided", mario_collided);
        mario.y = 570;

        brickGroup.setVelocityXEach(0);
        coinGroup.setVelocityXEach(0);
        obstacleGroup.setVelocityXEach(0);

        brickGroup.setLifetimeEach(-1);
        coinGroup.setLifetimeEach(-1);
        obstacleGroup.setLifetimeEach(-1);

        restart.visible = true;

        // code to restart the Game Again
        if (mousePressedOver(restart)) {
            restartGame();
        }
    }
    // Display Score Board
    textAlign(CENTER);
    textSize(30);
    fill("white");
    text("Coins: " + coinScore, 430, 50);
    

    }

    function generateBricks() {
        if(frameCount % 70 == 0)
        {
            var brick = createSprite(1200, 120,40,10);
            brick.y = random(100,430);
            brick.addImage(brickImage);
            brick.scale = 0.5;
            brick.velocityX = -5;

            brick.lifetime = 250;

            brickGroup.add(brick);
    }
}

function generateCoins() {
    if(frameCount % 80 == 0)
    {
        var coin = createSprite(1200, 120,40,10);
        coin.y = random(80,350);
        coin.addAnimation("running",coinAnim);
        coin.scale = 0.1;
        coin.velocityX = -5;

        coin.lifetime = 250;

        coinGroup.add(coin);
    }
}
function generateObstacle() {
    var variableTime = Math.floor(Math.random() * (150 - 30 + 1)) + 30;
    if(frameCount % variableTime == 0)
    {
        console.log(variableTime);
        var obstacle = createSprite(1200, 555, 40, 10);
        obstacle.scale = 0.1;
        obstacle.velocityX = -10;

        var rand = Math.round(random(1, 2));
        switch (rand) {
        case 1:
            obstacle.addAnimation("mush", mushAnim);
            break;
        case 2:
            obstacle.addAnimation("turtle", turtleAnim);
            break;
        default:
            break;
        }
        obstacle.lifetime = 250;
        obstacleGroup.add(obstacle);
    }
}

function restartGame()
{
    gameState = "PLAY";
    mario.changeAnimation("running", mario_running);

    brickGroup.destroyEach();
    coinGroup.destroyEach();
    obstacleGroup.destroyEach();

    coinScore = 0;
    restart.visible = false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

