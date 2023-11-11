///// MY GAME PROJECT /////


//Declaring Global Variables
var gameChar_x;
var gameChar_y;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var cameraPosX;

var floorPos_y;

var trees_x;
var treePos_y;

var clouds;

var mountains;

var collectables;

var canyons;

var game_score;

var flagpole;

var livesArray;

var platforms;

var enemies;

var jumpSound;
var backgroundMusic;
var deathSound;
var gameOverSound;



function preload()
{
    soundFormats('mp3','wav');
    
    //load sounds into variables
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    backgroundMusic = loadSound('assets/music.mp3');
    backgroundMusic.setVolume(1);
    
    deathSound = loadSound('assets/death.wav');
    deathSound.setVolume(1);
    
    gameOverSound = loadSound('assets/game-over.wav');
    gameOverSound.setVolume(1);
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4; // sets the height of the ground
    
    startGame();  
    
    
    //Starts the game with 3 lives
    livesArray = [1,2,3];  
    
    //initialising camera
    cameraPosX = 0;
    
}


function draw()
{
    //sets the camera with the game character in the screen
    cameraPosX = gameChar_x - width/2;
	///////////DRAWING CODE//////////
    
	background(15,70,170); //fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground
    
    push();
    translate(-cameraPosX, 0);
    
    //draws stars
    drawStars();
    
    //draws the moon
    drawMoon();
        
    //draws the mountains
    drawMountains();

    //draws some clouds
    drawClouds();
    
    //draws some trees
    drawTrees();
    
    //draws platforms
    drawPlatforms();
    
	//draws the canyons
    for(var i = 0; i < canyons.length; i++)
        {
        drawCanyon(canyons[i])
        checkCanyon(canyons[i])
        }
    
    // draws the collectables
    for(var i = 0; i < collectables.length; i++)
        {
            if(!collectables[i].isFound)
            {
                drawCollectable(collectables[i])
                checkCollectable(collectables[i])
            }
        }
    
    renderFlagpole();
    
    
    //displays score on screen
    fill(255,255,0);
    noStroke();
    text("score: "+ game_score, gameChar_x + 400, height - 70);
    
    //draws life tokens
    drawLifeTokens();
    
    //draws enemies and checks for contact
    drawEnemies();
    
    //draws the game character
    drawGameChar();
   
    //draws the game over text and plays game over sound
    gameOver();
    
    //draws the level complete text
    levelComplete();
    
	///////////INTERACTION CODE//////////
	//Logic to make game character move left & right
    if(isLeft == true)
        {
            gameChar_x -= 6;
        }
    
    if(isRight == true)
        {
            gameChar_x += 6;
        }

    
    //logic to make the game character rise, fall & land on platforms
    if(gameChar_y < floorPos_y)
        {
            var isContact = false;
            for(var i = 0; i < platforms.length; i++)
                {
                    
                    if(platforms[i].checkContact(gameChar_x, gameChar_y))
                        {
                            isContact = true;
                            gameChar_x += platforms[i].inc + platforms[i].inc;
                            break;
                        }
                        
                }
            if(isContact == false)
                {
                        gameChar_y += 5;
                        isFalling = true;
                }

                    
        }
    
    else if(gameChar_y == floorPos_y)
        {
            isFalling = false;
        }
    
    //checks if the character has reached the end of the level
    if(flagpole.isReached == false)
        {
            checkFlagpole();
        }
    
    
    //checks if the player has died
    checkPlayerDie();
    
    pop();
    
}


function keyPressed()
{
	// if statements to control the animation of the character when
	// keys are pressed.
    
    //character walks left
    if(isPlummeting == false && key == "a" || keyCode == 37 && livesArray.length > 0)
        {
            isLeft = true;
        }
    
    //character walks right
    else if(isPlummeting == false && key == "d" || keyCode == 39 && livesArray.length > 0)
        {
            isRight = true;
            
        }
    
    //disables double jumping
    else if(isFalling == true || isPlummeting == true && key == "w")
        {
            isFalling = true;
        }
    else if(isFalling == true || isPlummeting == true && keyCode == 32)
        {
            isFalling = true;
        }
    
    //sets how high you can jump
    else if(key == "w" || keyCode == 32)
        {
            gameChar_y -= 150;
            jumpSound.play();
        }
    
    //enables you to restart from game over with space button
    if(livesArray.length < 1 && keyCode == 32)
        {
            return setup();
        }
    if(livesArray.length < 1 && keyCode !== 32)
        {
            return gameOver();
        }
    
    //logs each key to the console
    console.log("keyPressed: " + key);
	console.log("keyPressed: " + keyCode);
}

//sets what happens when key is released
function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.
    if(key == "a" || keyCode == 37)
        {
            isLeft = false;	
        }
    else if(key == "d" || keyCode == 39)
        {
            isRight = false;
        }
    
    //logs the released key to the console
	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
}

//draws the game character
function drawGameChar()
{
	if(isLeft && isFalling)
	{
		// character jumping-left code
        //body
        fill(255,90,20);
        triangle(gameChar_x, gameChar_y - 58, 
                 gameChar_x - 22.5, gameChar_y - 12,
                 gameChar_x + 22.5, gameChar_y - 12);

        //head
        fill(255,160,122);
        ellipse(gameChar_x, gameChar_y - 60, 25, 30);
        fill(100,100,100);
        ellipse(gameChar_x - 7, gameChar_y - 66, 9, 6);
        stroke(0);
        line(gameChar_x - 3, gameChar_y - 56, gameChar_x - 10, gameChar_y - 56);
        noStroke(0);

        //right hand
        fill(0);
        ellipse(gameChar_x - 14, gameChar_y - 45, 12, 14);

        //feet
        rect(gameChar_x - 13, gameChar_y - 12, 10, 8);
        rect(gameChar_x + 3, gameChar_y - 12, 10, 12);
	}
	else if(isRight && isFalling)
	{
		// character jumping-right code
        //body
        fill(255,90,20);
        triangle(gameChar_x, gameChar_y - 58, 
                 gameChar_x - 22.5, gameChar_y - 12, 
                 gameChar_x + 22.5, gameChar_y - 12);
        
        //head
        fill(255,160,122);
        ellipse(gameChar_x, gameChar_y - 60, 25, 30);
        fill(100,100,100);
        ellipse(gameChar_x + 7, gameChar_y - 66, 9, 6);
        stroke(0);
        line(gameChar_x + 3, gameChar_y - 56, gameChar_x + 10, gameChar_y - 56);
        noStroke(0);
        
        //right hand
        fill(0);
        ellipse(gameChar_x + 14, gameChar_y - 45, 12, 14);
        
        //feet
        rect(gameChar_x - 13, gameChar_y - 12, 10, 12);
        rect(gameChar_x + 3, gameChar_y - 12, 10, 8); 
	}
	else if(isLeft)
	{
		// character walking left code
        //lefthand
        fill(0)
        ellipse(gameChar_x + 14, gameChar_y - 27, 12, 14);
        
        //body
        fill(255,90,20);
        triangle(gameChar_x, gameChar_y - 58,
                 gameChar_x - 22.5, gameChar_y - 12, 
                 gameChar_x + 22.5, gameChar_y - 12);
        
        //head
        fill(255,160,122);
        ellipse(gameChar_x, gameChar_y - 60, 25, 30);
        fill(100,100,100);
        ellipse(gameChar_x - 7, gameChar_y - 64, 9, 6);
        stroke(0);
        line(gameChar_x - 3, gameChar_y - 54, gameChar_x - 10, gameChar_y - 54);
        noStroke(0);
        
        //right hand
        fill(0);
        ellipse(gameChar_x - 14, gameChar_y - 27, 12, 14);
        
        //feet
        rect(gameChar_x - 13, gameChar_y - 12, 10, 10);
        rect(gameChar_x + 3, gameChar_y - 12, 10, 14);
	}
	else if(isRight)
	{
		// character walking right code
        //lefthand
        fill(0)
        ellipse(gameChar_x - 14, gameChar_y - 27, 12, 14);
        
        //body
        fill(255,90,20);
        triangle(gameChar_x, gameChar_y - 58,
                 gameChar_x - 22.5, gameChar_y - 12,
                 gameChar_x + 22.5, gameChar_y - 12);
        
        //head
        fill(255,160,122);
        ellipse(gameChar_x, gameChar_y - 60, 25, 30);
        fill(100,100,100);
        ellipse(gameChar_x + 7, gameChar_y - 64, 9, 6);
        stroke(0);
        line(gameChar_x + 3, gameChar_y - 54, gameChar_x + 10, gameChar_y - 54);
        noStroke(0);
        
        //right hand
        fill(0);
        ellipse(gameChar_x + 14, gameChar_y - 27, 12, 14);
        
        //feet
        rect(gameChar_x - 13, gameChar_y - 12, 10, 14);
        rect(gameChar_x + 3, gameChar_y - 12, 10, 10);
	}
	else if(isFalling || isPlummeting)
	{
		// character jumping facing forwards code
        //body
        fill(255,90,20);
        triangle(gameChar_x, gameChar_y - 58,
                 gameChar_x - 22.5, gameChar_y - 12, 
                 gameChar_x + 22.5, gameChar_y - 12);
        
        //head
        fill(255,160,122);
        ellipse(gameChar_x, gameChar_y - 60, 30, 30);
        fill(100,100,100);
        ellipse(gameChar_x - 6, gameChar_y - 66, 9, 6);
        ellipse(gameChar_x + 6, gameChar_y - 66, 9, 6);
        stroke(0);
        line(gameChar_x - 4, gameChar_y - 56, gameChar_x + 4, gameChar_y - 56);
        noStroke(0);
        
        //hands
        fill(0);
        ellipse(gameChar_x - 13, gameChar_y - 45, 12, 14);
        ellipse(gameChar_x + 13, gameChar_y - 45, 12, 14);
        
        //feet
        rect(gameChar_x - 15, gameChar_y - 12, 10, 10);
        rect(gameChar_x + 5, gameChar_y - 12, 10, 10);
	}
	else
	{
		// character stands front facing code
        //body
        fill(255,90,20);
        triangle(gameChar_x, gameChar_y - 58, 
                 gameChar_x - 22.5, gameChar_y - 12,
                 gameChar_x + 22.5, gameChar_y - 12);
        
        //head
        fill(255,160,122);
        ellipse(gameChar_x, gameChar_y - 60, 30, 30);
        fill(100,100,100);
        ellipse(gameChar_x - 6, gameChar_y - 64, 9, 6);
        ellipse(gameChar_x + 6, gameChar_y - 64, 9, 6);
        stroke(0);
        line(gameChar_x - 4, gameChar_y - 54, gameChar_x + 4, gameChar_y - 54);
        noStroke(0);
        
        //hands
        fill(0);
        ellipse(gameChar_x - 12, gameChar_y - 27, 12, 14);
        ellipse(gameChar_x + 12, gameChar_y - 27, 12, 14);
        
        //feet
        rect(gameChar_x - 15, gameChar_y - 12, 10, 14);
        rect(gameChar_x + 5, gameChar_y - 12, 10, 14);
	}
}


function drawMountains()
{
    for(var m = 0; m < mountains.length; m++)
        {
            noStroke();
            fill(180,180,180);
            triangle(mountains[m].xPos, mountains[m].yPos,
                     mountains[m].xPos + 54, mountains[m].height/2 + 54,
                     mountains[m].xPos + mountains[m].width, mountains[m].yPos);
            
            triangle(mountains[m].xPos + 101, mountains[m].yPos,
                     mountains[m].xPos + 97, mountains[m].height/2, 
                     mountains[m].xPos + mountains[m].width, mountains[m].yPos);
        }
}


function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
        {
            clouds[i].updateParticles(); 
        };
   
}


function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
        {
            //trunk
            fill(160,90,0);
            rect(trees_x[i], treePos_y, 60, 150);
            
            //branches
            fill(0,155,0);
            triangle(trees_x[i] - 50, treePos_y + 50,
                     trees_x[i] + 30, treePos_y - 50, 
                     trees_x[i] + 110, treePos_y + 50);
            
            triangle(trees_x[i] - 50, treePos_y,
                     trees_x[i] + 30, treePos_y - 100,
                     trees_x[i] + 110, treePos_y);
            
            triangle(trees_x[i] - 50, treePos_y - 50, 
                     trees_x[i] + 30, treePos_y - 150, 
                     trees_x[i] + 110, treePos_y - 50);
        }
    
}


function drawCollectable(t_collectable)
{
   if(t_collectable.isFound == false)
    {
        stroke(0);
        fill(189,0,0);
        rect(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size, t_collectable.size, 9);
        fill(0,160,0)
        ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size - 15, t_collectable.size - 5 )
        noStroke();
    } 
}

//checks if the collectable has been collected
function checkCollectable(t_collectable)
{
  //collectable Interaction - makes collectable disappear when collected
    if(dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) <= 55)
    {
        t_collectable.isFound = true;  
        game_score += 1;
    }  
}


function drawStars()
{
    for(var i = 0; i < clouds.length; i++)
        {
            stars[i].updateParticles(); 
        };
   
}


function drawMoon()
{
    fill(240, 240, 255);
    ellipse(gameChar_x + 400, 40, 65, 65);
}


function drawCanyon(t_canyon)
{
    //hole
    fill(111,81,37);
    rect(t_canyon.x_pos, 432, t_canyon.width, 144);
    
    //spikes
    fill(150,150,150);
    stroke(100);
    triangle(t_canyon.x_pos,height,t_canyon.x_pos + t_canyon.width/6, height - 56, 
             t_canyon.x_pos + t_canyon.width/3, height);
    
    triangle(t_canyon.x_pos + t_canyon.width/3, height,
             t_canyon.x_pos + t_canyon.width/3 + t_canyon.width/6, height -56,
             t_canyon.x_pos + t_canyon.width/3*2, height);
    
    triangle(t_canyon.x_pos + t_canyon.width/3*2, height,
             t_canyon.x_pos + t_canyon.width/3*2 + t_canyon.width/6, height - 56,
             t_canyon.x_pos + t_canyon.width - 1, height);
    noStroke();
}

//checks if the game character should be plummeting down the canyon
function checkCanyon(t_canyon)
{
if(gameChar_x <= t_canyon.x_pos + t_canyon.width 
   && gameChar_x >= t_canyon.x_pos 
   && gameChar_y >= floorPos_y)
        {
            isPlummeting = true;
        }
    if(isPlummeting == true)
        {
           if(gameChar_y < height)
            {
               gameChar_y += 10;
            } 
            isLeft = false;
            isRight = false;
        }
}

//draws the flagpole
function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(80);
    line(flagpole.xPos, floorPos_y, flagpole.xPos, floorPos_y - 250);
    noStroke();
    fill(255, 0, 100)
    
    //draws the flag when it has been reached 
    if(flagpole.isReached == true)
        {
            rect(flagpole.xPos, floorPos_y - 250, 50, 30);
        }
    //draws the flag when it has not been reached
    else
        {
            rect(flagpole.xPos, floorPos_y - 30, 50, 30);
        }
    pop();
}

//checks if the game character has reached the flagpole
function checkFlagpole()
{
   var d = abs(gameChar_x - flagpole.xPos);
    if(d < 15)
        {
            flagpole.isReached = true;
        }
}

//checks if the character has fallen down a canyon and died
function checkPlayerDie()
{
    
    if(isPlummeting == true && gameChar_y >= height)
        {
            //returns to startGame if lives are greater than 0            
            if(livesArray.length > 0)
                {
                    backgroundMusic.stop();
                    deathSound.play();
                    startGame();
                }
            //removes life from livesArray
            livesArray.pop();
            
            //sets what happens when the character loses the last life
            if(livesArray.length < 1)
                {
                    gameOverSound.play();
                    return gameOver();
                }
        }
    
}


function startGame()
{
    //sets the starting position of the game character
	gameChar_x = 100; 
	gameChar_y = floorPos_y;
    
    
    //starts background music
    backgroundMusic.play();
    
    
    //Initialising global variables to default values
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    
    
    //initialising collectables array
    collectables = []
    
    //setting properties of collectable objects and adding them to colectables array
    for(var i = 0; i < 20; i++)
        {
            var c = {
                x_pos: random(150, width + 1500), 
                y_pos: random(320, 280), 
                size: 20,
                isFound: false
                    }
            collectables.push(c)
        }

    
    canyons =[
        {
        x_pos: 1100, 
        width: 150
        },{
        x_pos: 300, 
        width: 130
        },{
        x_pos: 600, 
        width: 85
        }];
    
    //extends the length of the furthest canyon
    for(var i = 0; i < 11; i++)
        {
            var moreCanyons = 
                {
                    x_pos: 1100, 
                    width: 150
                }
            moreCanyons.x_pos += 150 * i;
            canyons.push(moreCanyons);
        }
   
    
    //array of tree x positions
    trees_x = [230, 75, 700, 950, 500, -320, - 100, 1150, 1425, 
                1700, 2125, 2350, 2575, 2800, 2950];
    
    //sets the y position of the trees
    treePos_y = floorPos_y - 150;
    
   
    //empty array for clouds
    clouds = [];
    
    //uses particle emitters to generate a cloud effect
    for(var i = 0; i < 50; i++)
        {
            var c = new Cloud_Emitter(random(-1000, width + 2000), 
                                random(height/4, 30), -0.3, -0.07, 
                                random(30, 60), color(225));
            c.startEmitter(1, 1000000);
            clouds.push(c);
        }
    
    
    //array of mountains
    mountains = [];
    
    for(var m = 0; m < 7; m++)
        {
           var mountain = 
                {
                    xPos: 100 + m * 600,
                    yPos: floorPos_y,
                    width: 350,
                    height: round(random(10, 200))
                }; 
            mountains.push(mountain);
        }
    
    
    //initialising platforms array
    platforms = [];
    
    //adds platforms to the platforms array
    platforms.push(createPlatforms(1275, floorPos_y-50, 200, 1240));
    platforms.push(createPlatforms(2550, floorPos_y-150, 200, 0));
    platforms.push(createPlatforms(1100, floorPos_y-100, 200, 0));
    
    
    //initialising game_score
    game_score = 0;
    
    
    //initialising flagpole object
    flagpole = {isReached: false, xPos: 3000};
    
    
    //empty array for enemies
    enemies = [];
    
    //adds moving enemies to enemies array
    enemies.push(new Enemy(700, floorPos_y - 20, 400));
    enemies.push(new Enemy(1400, floorPos_y - 50, 1000));
    
    //adds stationary enemies to enemies array
    enemies.push(new Enemy(2800, floorPos_y - 20, 0));
    enemies.push(new Enemy(2850, floorPos_y - 20, 0));
    enemies.push(new Enemy(2900, floorPos_y - 20, 0));
    
    
    //empty array for stars
    stars = []
    
    //adds emitters that generate stars to stars array
    for(var i = 0; i < 1000; i++)
        {
            var s = new Star_Emitter(random(-2000, width + 3000), 
                                random(height/4, 0), 0, 0, 
                                random(30, 60), color(255));
            s.startEmitter(35, 150000);
            stars.push(s);
        }
    
}


function drawLifeTokens()
{
    var x = gameChar_x + 400;
    
    for(var i = 0; i < livesArray.length; i++)
        {
            noStroke();
            fill(255, 0, 138);
            ellipse(x + i * 40, height - 50, 18, 18);
            ellipse(x + 15 + i * 40, height - 50, 18, 18);
            triangle(x - 9 + i * 40, height - 47,
            x + 23.8 + i * 40, height - 47,
            x + 8 + i * 40, height - 24);
                     
        }

}

//sets what appears onscreen when last life is lost
function gameOver()
{
    
    if(livesArray.length < 1)
        {
            
            backgroundMusic.stop();
            strokeWeight(8);
            fill(255,255,0);
            textSize(20);
            text("You Lose! Game Over. Press Space to Continue", gameChar_x - 150, height/2);
            strokeWeight(1);
        }
}

//sets what appears on screen when level is completed
function levelComplete()
{
    if(flagpole.isReached == true)
        {
            backgroundMusic.stop(5);
            strokeWeight(8);
            fill(255,255,0);
            textSize(20);
            text("Level complete! You Won!", gameChar_x - 50, height/2);
            text("Score: " + game_score + "/" + collectables.length, gameChar_x - 50, height/2 + 30);
            return levelComplete();
        }
}

//creates platform object
function createPlatforms(x, y, length, range)
{
        var p = 
            {
        x: x,
        y: y,
        length: length,
        range: range,
        currentX: x,
        inc: 3,
        update: function() //enables moving platforms
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
            {
                this.inc = -3;
            }
        else if(this.currentX < this.x)
            {
                this.inc = 3;
            }
        if(this.range == 0)
            {
                this.inc = 0;
            }
    },
        draw: function(){ //draws the platforms
            this.update();
            fill(255,255,0);
            rect(this.currentX, this.y, this.length, 10);
            
                        },
        checkContact: function(gc_x,gc_y) //checks in the character has made contact with the platform
        {
            if(gc_x > this.currentX && gc_x < this.currentX + this.length && gc_y == this.y)
                        {
                            this.update();
                            isFalling = false;
                            gc_y += 0;
                            return true;
                        }
            
            return false;
        }
            
            }
            
            return p;
    
}


function drawPlatforms()
{
    for(var i = 0; i < platforms.length; i++)
        { 
           platforms[i].draw(); 
        }
}

//constructor function to generate cloud particles
function Cloud_Particle(x, y, xSpeed, ySpeed, size, colour)
{
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.size = size;
    this.colour = colour;
    this.age = 0;
    
    this.drawParticle = function() //generates cloud shape
    {
        noStroke();
        fill(this.colour);
        ellipse(this.x, this.y, this.size);
        ellipse(this.x-30, this.y, this.size+25);
        ellipse(this.x-60, this.y, this.size+15);
        
    }
    
    this.updateParticle = function()
    {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.age++;
    }
}

//constructor function that creates the cloud emitter
function Cloud_Emitter(x, y, xSpeed, ySpeed, size, colour)
{
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.size = size;
    this.colour = colour;
    
    this.startParticles = 0;
    this.lifetime = 0;
    
    this.particles = [];
    
    this.addParticle = function() //adds new particle to the emitter
    {
         var p = new Cloud_Particle(random(this.x-100, this.x +100), 
                                     random(this.y, this.y+10), 
                                     this.xSpeed, 
                                     this.ySpeed, 
                                     this.size, 
                                     this.colour);
        
        return p;
    }
    
    this.startEmitter = function(startParticles, lifetime) //sets what happens when the emitter starts
    {
        this.startParticles = startParticles;
        this.lifetime = lifetime;
        
        //start emitter with initial particles
        for(var i = 0; i < startParticles; i++)
            {
                
                this.particles.push(this.addParticle());
            }
    }
    
    this.updateParticles = function()    
    {
        var deadParticles = 0;
        //iterate through particles and draw to screen
        for(var i = this.particles.length - 1; i >= 0; i--)
            {
                this.particles[i].drawParticle();
                this.particles[i].updateParticle();
                if(this.particles[i].age > random(0, this.lifetime))
                    {
                        //uses splice function to remove a specific element from the this.particles array
                        this.particles.splice(i, 1);
                        deadParticles++;
                    }
            }
        if(deadParticles > 0)
            {
                for(var i = 0; i < deadParticles; i++)
                    {
                        this.particles.push(this.addParticle());
                    }
            }
    }
}


function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.inc = 1;
    this.update = function() //enables moving enemies
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
            {
                this.inc = -1;
            }
        else if(this.currentX < this.x)
            {
                this.inc = 1;
            }
        if(this.range == 0)
            {
                this.inc = 0;
            }
    };
    this.draw = function() //draws the enemies by calling on drawing code functions
    {
        this.update();
        if(this.inc == 1)
            {
                enemyRight(this.currentX, this.y);
            }
        if(this.inc == -1)
            {
                enemyLeft(this.currentX, this.y);
            }
        if(this.inc == 0)
            {
                enemyLeft(this.currentX, this.y);
            }
        
    };
    this.checkContact = function(gc_x, gc_y) //checks in the game character has made contact with an enemy
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y);
        if(d < 50)
            {
                return true;
            }
        return false;
    }
    
}

//drawing code for enemy moving left
function enemyLeft(Enemy_x, Enemy_y)
{
    //body
    stroke(3);
    fill(175, 175, 200);
    rect(Enemy_x, Enemy_y - 55, 20, 30);

    //head
    fill(175,175,200);
    rect(Enemy_x - 3, Enemy_y - 75, 25, 20);
    fill(225,225,0);
    rect(Enemy_x - 3, Enemy_y - 71, 9, 6);

    line(Enemy_x - 0.5, Enemy_y - 55, Enemy_x - 0.5, Enemy_y - 65);
    line(Enemy_x + 2, Enemy_y - 55, Enemy_x + 2, Enemy_y - 65);
    
    //right hand
    fill(175, 175, 200);
    rect(Enemy_x - 8, Enemy_y - 45, 20, 5)
    
    //drill
    fill(200)
    triangle(Enemy_x - 30, Enemy_y - 43.5, Enemy_x - 7, Enemy_y - 35, Enemy_x - 7, Enemy_y - 50);

    //rocket
    fill(175, 175, 200);
    rect(Enemy_x + 7, Enemy_y - 25, 5, 6);
    fill(175,175, 200);
    ellipse(Enemy_x + 9.5, Enemy_y - 17, 8, 8)
    
    fill(0, 75, 220, 60);
    noStroke();
    ellipse(Enemy_x + 9.5, Enemy_y - 1, 14, 6);
    ellipse(Enemy_x + 9.5, Enemy_y - 6, 11, 4.5);
    ellipse(Enemy_x + 9.5, Enemy_y - 9.5, 8, 3);
    noStroke();
}

//drawing code for enemy moving right
function enemyRight(Enemy_x, Enemy_y)
{
    //body
    stroke(3);
    fill(175, 175, 200);
    rect(Enemy_x - 20, Enemy_y - 55, 20, 30);

    //head
    fill(175,175,200);
    rect(Enemy_x - 22, Enemy_y - 75, 25, 20);
    fill(225,225,0);
    rect(Enemy_x - 6, Enemy_y - 71, 9, 6);

    line(Enemy_x + 0.5, Enemy_y - 55, Enemy_x + 0.5, Enemy_y - 65);
    line(Enemy_x - 2, Enemy_y - 55, Enemy_x - 2, Enemy_y - 65);
    
    //right hand
    fill(175, 175, 200);
    rect(Enemy_x - 12, Enemy_y - 45, 20, 5)
    
    //drill
    fill(200)
    triangle(Enemy_x + 30, Enemy_y - 43.5, Enemy_x + 7, Enemy_y - 35, Enemy_x + 7, Enemy_y - 50);

    //rocket
    fill(175, 175, 200);
    rect(Enemy_x - 12, Enemy_y - 25, 5, 6);
    fill(175,175, 200);
    ellipse(Enemy_x - 9.5, Enemy_y - 17, 8, 8)
    
    fill(0, 75, 220, 60);
    noStroke();
    ellipse(Enemy_x - 9.5, Enemy_y - 1, 14, 6);
    ellipse(Enemy_x - 9.5, Enemy_y - 6, 11, 4.5);
    ellipse(Enemy_x - 9.5, Enemy_y - 9.5, 8, 3);
    noStroke();
}

//draws enemies to canvas 
function drawEnemies()
{
    for(var i = 0; i < enemies.length; i++)
        {
            enemies[i].draw();
            var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);
            
            if(isContact)
                {
                    backgroundMusic.stop();
                    
                    livesArray.pop();
                    
                    if(livesArray.length >= 1)
                        {
                            deathSound.play()
                            startGame();
                            
                        }
                    if(livesArray.length < 1)
                        {
                            gameOverSound.play();
                            gameChar_x = 0;
                            return gameOver();
                        }
                    break;                        
                }
        }
}


//constructor function to generate star particles
function Star_Particle(x, y, xSpeed, ySpeed, size, colour)
{
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.size = size;
    this.colour = colour;
    this.age = 0;
    
    this.drawParticle = function() //drawing code for stars
    {
        stroke(this.colour);
        point(this.x, this.y)        
    }
    
    this.updateParticle = function()
    {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.age++;
    }
}

//constructor function that creates the stars emitter
function Star_Emitter(x, y, xSpeed, ySpeed, size, colour)
{
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.size = size;
    this.colour = colour;
    
    this.startParticles = 0;
    this.lifetime = 0;
    
    this.particles = [];
    
    this.addParticle = function()
    {
         var p = new Star_Particle(random(this.x, this.x + 400), random(this.y - 50, this.y + 200),  
                                     this.xSpeed, 
                                     this.ySpeed, 
                                     this.size, 
                                     this.colour);
        
        return p;
    }
    
    this.startEmitter = function(startParticles, lifetime)
    {
        this.startParticles = startParticles;
        this.lifetime = lifetime;
        
        //start emitter with initial particles
        for(var i = 0; i < startParticles; i++)
            {
                
                this.particles.push(this.addParticle());
            }
    }
    
    this.updateParticles = function()    
    {
        var deadParticles = 0;
        //iterate through particles and draw to screen
        for(var i = this.particles.length - 1; i >= 0; i--)
            {
                this.particles[i].drawParticle();
                this.particles[i].updateParticle();
                if(this.particles[i].age > random(0, this.lifetime))
                    {
                        this.particles.splice(i, 1);
                        deadParticles++;
                    }
            }
        if(deadParticles > 0)
            {
                for(var i = 0; i < deadParticles; i++)
                    {
                        this.particles.push(this.addParticle());
                    }
            }
    }
}
