

var canvas=document.querySelector("canvas")
canvas.width=1024
canvas.height=576
var v=createImage("../img/platformHover.png")
var p=createImage("../img/projectileEnemy.png")
const backgroundMusic = document.getElementById("backgroundMusic");
const soundEffect = document.getElementById("soundEffect");

var c=canvas.getContext("2d");
var gameState = "menu"
var gravity=1.1
var jump=0;

class Projectile {
    constructor(x, y, velocityX, image) {
        this.position = { x, y };
        this.velocityX = velocityX;
        this.image = image;
        this.color = 'red'
        this.radius=5
        // Add any other properties or methods for your projectiles
    }

    update() {
        // Update the position of the projectile based on velocity
        this.position.x += this.velocityX;
        this.draw()
    }

    // draw() {
    //     // Draw the projectile on the canvas
    //     c.drawImage(this.image, this.position.x, this.position.y);
    // }

    draw() {
        // Draw the projectile as a circle
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fill();
        c.closePath();
    }
}
class ProjectileEnemy {
    constructor(x, y, velocityX, image) {
        this.position = { x, y };
        this.velocityX = velocityX;
        this.velocityY=0
        this.image = image;
        this.color = 'red'
        this.radius=5
        // Add any other properties or methods for your projectiles
    }

    update() {
        // Update the position of the projectile based on velocity
        this.position.x += this.velocityX;
        this.position.y += this.velocityY;
        this.velocityY+=gravity
        this.draw()
    }

    // draw() {
    //     // Draw the projectile on the canvas
    //     c.drawImage(this.image, this.position.x, this.position.y);
    // }

    draw() {
        // Draw the projectile as a circle
        // c.beginPath();
        // c.fillStyle = this.color;
        c.drawImage(createImage("../img/projectileEnemy.png"),this.position.x,this.position.y,15,15)
        // (this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        // c.fill();
        // c.closePath();
    }
}
function updateProjectiles() {
    for (let i = 0; i < player.projectiles.length; i++) {
        const projectile = player.projectiles[i];
        projectile.update();

        if (projectile.position.x > canvas.width) {
            // Remove the projectile if it goes off-screen
            player.projectiles.splice(i, 1);
            i--;
        }
        if (projectile.position.x+projectile.radius < 0) {
            // Remove the projectile if it goes off-screen
            player.projectiles.splice(i, 1);
            i--;
        }
    }
}

function updateEnemyProjectiles(enemy) {
    enemy.projectiles.forEach((projectile,i) => {
        projectile.update()
        if (projectile.position.x > canvas.width) {
            // Remove the projectile if it goes off-screen
            enemy.projectiles.splice(i, 1);
            i--;
        }
        if (projectile.position.x+projectile.width < 0) {
            // Remove the projectile if it goes off-screen
            enemy.projectiles.splice(i, 1);
            i--;
        }
        if(projectile.position.y+projectile.height >canvas.height){
            enemy.projectiles.splice(i, 1);
            i--;
        }
    });
        
        // for (let i = 0; i < enemy.projectiles.length; i++) {
            
        //     console.log(projectile)
        //     projectile.update();
    
        //     if (projectile.position.x > canvas.width) {
        //         // Remove the projectile if it goes off-screen
        //         enemy.projectiles.splice(i, 1);
        //         i--;
        //     }
        //     if (projectile.position.x+projectile.width < 0) {
        //         // Remove the projectile if it goes off-screen
        //         enemy.projectiles.splice(i, 1);
        //         i--;
        //     }if(projectile.position.y+projectile.position.y >canvas.height){
        //         enemy.projectiles.splice(i, 1);
        //         i--;
        //     }
        //     platforms.forEach(platform=>{
        //         if(projectile.position.y+projectile.height <= platform.position.y && projectile.position.y + projectile.height + projectile.velocity.y > platform.position.y && projectile.position.x<platform.position.x+platform.width && projectile.position.x+projectile.width>platform.position.x){
        //             enemy.projectiles.splice(i, 1);
        //         i--;
        //         }   
        //     })
        // }
    
}
class Enemy {
    constructor(x, y, width, height, speed, imageSrc) {
        this.position={
            x:x,
            y:y,
        }
        this.velocity={
            x:Math.random()<0.5?-1:1,
            y:0,
        }
        this.width=66;
        this.height=150;
        this.image= createImage("../img/Monster9Pack.png");
        this.frames=0;
        this.sprites={
            stand:{
                right:createImage("../img/Monster9Pack.png"),
                left:createImage("../img/Monster9Pack.png"),
                cropwidth:80,
                width:80
            },
            run:{
                right:createImage("../img/Monster9Pack.png"),
                left:createImage("../img/Monster9Pack.png"),
                cropwidth:32,
                width:32
            },
            
        }
        this.frameDelay = 0;
        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = this.sprites.stand.cropwidth;
        this.directionChangeTimer = Math.floor(Math.random() * 100);
        this.side=this.velocity.x==-1?"left":"right" // Initialize a random timer
        this.isJumping =false;
    }

    checkAndJumpOffPlatform(platform) {
        const fallingThreshold = 10;
      
        // Check if the enemy is about to fall off the platform
        if (
          (this.position.x + this.width <= platform.position.x + 10 || // The enemy is near the left edge of the platform
          this.position.x > platform.position.x + platform.width - 10) 
        //   && // The enemy is near the right edge of the platform
        //   this.position.y + this.height >= platform.position.y && // The enemy is at or below the platform's top
        //   this.position.y + this.height <= platform.position.y  // The enemy is close to falling off
        ) {
          if (!this.isJumping) {
            this.velocity.y = -20; // Make the enemy jump
            this.isJumping = true; // Mark the enemy as jumping
          }
        }
      }
      
  
    draw() {
      c.drawImage(createImage("../img/"+this.side+"/"+(Math.floor(this.frameDelay/15))+".png"),
            // 0,
            // 0,
            // createImage("../img/"+(Math.floor(this.framesdelay/7)+1)+".png"),
            // window.getComputedStyle(createImage("../img/"+(Math.floor(this.framesdelay/7)+1)+".png")).width,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    
    }
    
         
        
    
  
    update() {
        if(this.frameDelay<5*15){
            this.frameDelay++

        }else{
            this.frameDelay=0
        }
        if(this.frames>4 && (this.currentSprite==this.sprites.stand.right||this.currentSprite==this.sprites.stand.left)){
            this.frames=0
        }
        
        this.directionChangeTimer--;
        
    if (this.directionChangeTimer <= 0) {
        const randomValue = Math.random();
        if (randomValue < 0.5) {
            this.velocity.x = 1; 
            this.side="right"// Move right
        } else {
            this.velocity.x = -1;
            this.side="left" // Move left
        }
         // Randomly change the direction
        this.directionChangeTimer = Math.floor(Math.random() * 100); // Reset the timer
    }
        
        if(this.frames>29 && (this.currentSprite==this.sprites.run.right||this.currentSprite==this.sprites.run.left)){
            this.frames=0
        }
        this.draw()
        this.position.y+=this.velocity.y
        this.position.x+=this.velocity.x
        if(this.position.y+this.height+this.velocity.y<canvas.height){
            this.velocity.y+=gravity 
        }else{
            this.velocity.y=0
        }
    }
  }



  class EnemySoldier {
    constructor(x, y, width, height, speed, imageSrc) {
        this.position={
            x:x,
            y:y,
        }
        this.velocity={
            x:Math.random()<0.5?-1:1,
            y:0,
        }
        this.width=66;
        this.height=150;
        this.image= createImage("../img/Monster9Pack.png");
        this.frames=0;
        this.sprites={
            stand:{
                right:createImage("../img/Monster9Pack.png"),
                left:createImage("../img/Monster9Pack.png"),
                cropwidth:80,
                width:80
            },
            run:{
                right:createImage("../img/Monster9Pack.png"),
                left:createImage("../img/Monster9Pack.png"),
                cropwidth:32,
                width:32
            },
            
        }
        this.frameDelay = 0;
        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = this.sprites.stand.cropwidth;
        this.directionChangeTimer = Math.floor(Math.random() * 100); // Initialize a random timer
        this.side=this.velocity.x==-1?"left":"right"
        this.isJumping=false
    }
  
    draw() {
      c.drawImage(createImage("../img/"+this.side+"/b"+(Math.floor(this.frameDelay/8))+".png"),
            // 0,
            // 0,
            // createImage("../img/"+(Math.floor(this.framesdelay/7)+1)+".png"),
            // window.getComputedStyle(createImage("../img/"+(Math.floor(this.framesdelay/7)+1)+".png")).width,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    
    }
    
    checkAndJumpOffPlatform(platform) {
        const fallingThreshold = 10;
      
        // Check if the enemy is about to fall off the platform
        if (
          (this.position.x + this.width <= platform.position.x + 10 || // The enemy is near the left edge of the platform
          this.position.x > platform.position.x + platform.width - 10) 
        //   && // The enemy is near the right edge of the platform
        //   this.position.y + this.height >= platform.position.y && // The enemy is at or below the platform's top
        //   this.position.y + this.height <= platform.position.y  // The enemy is close to falling off
        ) {
          if (!this.isJumping) {
            this.velocity.y = -20; // Make the enemy jump
            this.isJumping = true; // Mark the enemy as jumping
          }
        }
      }
      
        
    
  
    update() {
        if(this.frameDelay<8*8){
            this.frameDelay++

        }else{
            this.frameDelay=0
        }
        if(this.frames>4 && (this.currentSprite==this.sprites.stand.right||this.currentSprite==this.sprites.stand.left)){
            this.frames=0
        }
        
        this.directionChangeTimer--;

    if (this.directionChangeTimer <= 0) {
        const randomValue = Math.random();
        if (randomValue < 0.5) {
            this.velocity.x = 1;
            this.side="right" // Move right
        } else {
            this.velocity.x = -1; // Move left
            this.side="left" // Move right
        }
         // Randomly change the direction
        this.directionChangeTimer = Math.floor(Math.random() * 100); // Reset the timer
    }
        
        if(this.frames>29 && (this.currentSprite==this.sprites.run.right||this.currentSprite==this.sprites.run.left)){
            this.frames=0
        }
        this.draw()
        this.position.y+=this.velocity.y
        this.position.x+=this.velocity.x
        if(this.position.y+this.height+this.velocity.y<canvas.height){
            this.velocity.y+=gravity 
        }else{
            this.velocity.y=0
        }
    }
  }

  var enemyShoot=true;


  class EnemyFlying {
    constructor(x, y, width, height, speed, imageSrc) {
        this.position={
            x:x,
            y:y,
        }
        this.velocity={
            x:Math.random()<0.5?-1:1,
            y:Math.random()<0.5?-1:1,
        }
        this.width=66;
        this.height=150;
        this.image= createImage("../img/Monster9Pack.png");
        this.frames=0;
        this.sprites={
            stand:{
                right:createImage("../img/Monster4PackRight2.png"),
                left:createImage("../img/Monster4Pack.png"),
                cropwidth:64,
                width:64
            },
            run:{
                right:createImage("../img/Monster4Pack.png"),
                left:createImage("../img/Monster4Pack.png"),
                cropwidth:32,
                width:32
            },
            
        }
        this.frameDelay = 0;
        this.currentSprite = this.velocity<0?this.sprites.stand.left:this.sprites.stand.right;
        this.currentCropWidth = this.sprites.stand.cropwidth;
        this.directionChangeTimer = Math.floor(Math.random() * 100); // Initialize a random timer
        this.heightChangeTimer = Math.floor(Math.random() * 50); // Initialize a random timer
        this.projectiles = [];
        this.projectileDirection=this.velocity.x>0?7:-7
    }
  
    draw() {
      c.drawImage(this.currentSprite,
        this.currentCropWidth * Math.floor(this.frameDelay/10),
            0,
            this.currentCropWidth,
            64,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    
    }
    
    shoot() {
        const projectile = new ProjectileEnemy(this.position.x+this.width/2, this.position.y + this.height / 2, this.velocity.x*9, "createImage('projectile.png')");
        this.projectiles.push(projectile);
    }
        
    
  
    update() {
        if(this.velocity.x<0){
            this.currentSprite = this.sprites.stand.left;
        }else{
            this.currentSprite = this.sprites.stand.right;
        }
        if(this.frameDelay<4*10){
            this.frameDelay++

        }else{
            this.frameDelay=0
        }
        if(this.frames>4 && (this.currentSprite==this.sprites.stand.right||this.currentSprite==this.sprites.stand.left)){
            this.frames=0
        }
        this.frames++
        
        this.directionChangeTimer--;

    if (this.directionChangeTimer <= 0) {
        const randomValue = Math.random();
        if (randomValue < 0.5) {
            this.velocity.x = 1; // Move right
        } else {
            this.velocity.x = -1; // Move left
        }
         // Randomly change the direction
        this.directionChangeTimer = Math.floor(Math.random() * 100); // Reset the timer
    }
        
        if(this.frames>29 && (this.currentSprite==this.sprites.run.right||this.currentSprite==this.sprites.run.left)){
            this.frames=0
        }
        this.draw()
        this.position.y+=this.velocity.y
        this.position.x+=this.velocity.x
           
        this.heightChangeTimer--

        if (this.heightChangeTimer <= 0) {
            
        
            // Check the upper bound (enemy is too close to the top)
            if (this.position.y < 20) {
                this.velocity.y = 10; // Move down
                console.log(this.velocity.y)
            } 
            // Check the lower bound (enemy is too close to the bottom)
            else if (this.position.y + this.height > canvas.height - 50) {
                this.velocity.y = -10; // Move up
            }else{
                const randomValue = Math.random();
                if (randomValue < 0.5) {
                    // Randomly change the direction
                    console.log(22222222)
                    this.velocity.y = Math.random() < 0.5 ? 1 : -1; // Move up or down
                } else {
                    this.velocity.y = 0; // Stop moving vertically
                }
            }
        
            // Randomly reset the timer between 0 and 100
            this.heightChangeTimer = Math.floor(Math.random() * 50);
        }
        this.projectileDirection=this.velocity.x>0?7:-7
        
        
    }
  }


  class EnemyFlying2 {
    constructor(x, y, width, height, speed, imageSrc) {
        this.position={
            x:x,
            y:y,
        }
        this.velocity={
            x:Math.random()<0.5?-1:1,
            y:Math.random()<0.5?-1:1,
        }
        this.width=150;
        this.height=66;
        this.image= createImage("../img/Monster9Pack.png");
        this.frames=0;
        this.sprites={
            stand:{
                right:createImage("../img/Monster4PackRight2.png"),
                left:createImage("../img/Monster4Pack.png"),
                cropwidth:64,
                width:64
            },
            run:{
                right:createImage("../img/Monster4Pack.png"),
                left:createImage("../img/Monster4Pack.png"),
                cropwidth:32,
                width:32
            },
            
        }
        this.frameDelay = 0;
        this.currentSprite = this.velocity<0?this.sprites.stand.left:this.sprites.stand.right;
        this.currentCropWidth = this.sprites.stand.cropwidth;
        this.directionChangeTimer = Math.floor(Math.random() * 100); // Initialize a random timer
        this.heightChangeTimer = Math.floor(Math.random() * 50); // Initialize a random timer
        this.projectiles = [];
        this.projectileDirection=this.velocity.x>0?7:-7
        this.side=this.velocity.x==-1?"left":"right"
    }
  
    draw() {
        c.drawImage(createImage("../img/"+this.side+"/f"+(Math.floor(this.frameDelay/15))+".png"),
              // 0,
              // 0,
              // createImage("../img/"+(Math.floor(this.framesdelay/7)+1)+".png"),
              // window.getComputedStyle(createImage("../img/"+(Math.floor(this.framesdelay/7)+1)+".png")).width,
              this.position.x,
              this.position.y,
              this.width,
              this.height)
      
      }
    
    shoot() {
        const projectile = new ProjectileEnemy(this.position.x+this.width/2, this.position.y + this.height / 2, this.velocity.x*9, "createImage('projectile.png')");
        this.projectiles.push(projectile);
        console.log(this.projectiles)
    }
        
    
  
    update() {
        if(this.frameDelay<6*15){
            this.frameDelay++

        }else{
            this.frameDelay=0
        }
        if(this.frames>4 && (this.currentSprite==this.sprites.stand.right||this.currentSprite==this.sprites.stand.left)){
            this.frames=0
        }
        
        if(this.velocity.x<0){
            this.currentSprite = this.sprites.stand.left;
        }else{
            this.currentSprite = this.sprites.stand.right;
        }
        if(this.frameDelay<4*10){
            this.frameDelay++

        }else{
            this.frameDelay=0
        }
        if(this.frames>4 && (this.currentSprite==this.sprites.stand.right||this.currentSprite==this.sprites.stand.left)){
            this.frames=0
        }
        this.frames++
        
        this.directionChangeTimer--;

    if (this.directionChangeTimer <= 0) {
        const randomValue = Math.random();
        if (randomValue < 0.5) {
            this.velocity.x = 1; // Move right
            this.side="right"
        } else {
            this.velocity.x = -1; // Move left
            this.side="left"
        }
         // Randomly change the direction
        this.directionChangeTimer = Math.floor(Math.random() * 100); // Reset the timer
    }
        
        if(this.frames>29 && (this.currentSprite==this.sprites.run.right||this.currentSprite==this.sprites.run.left)){
            this.frames=0
        }
        this.draw()
        this.position.y+=this.velocity.y
        this.position.x+=this.velocity.x
           
        this.heightChangeTimer--

        if (this.heightChangeTimer <= 0) {
            
        
            // Check the upper bound (enemy is too close to the top)
            if (this.position.y < 20) {
                this.velocity.y = 10; // Move down
                console.log(this.velocity.y)
            } 
            // Check the lower bound (enemy is too close to the bottom)
            else if (this.position.y + this.height > canvas.height - 50) {
                this.velocity.y = -10; // Move up
            }else{
                const randomValue = Math.random();
                if (randomValue < 0.5) {
                    // Randomly change the direction
                    console.log(22222222)
                    this.velocity.y = Math.random() < 0.5 ? 1 : -1; // Move up or down
                } else {
                    this.velocity.y = 0; // Stop moving vertically
                }
            }
        
            // Randomly reset the timer between 0 and 100
            this.heightChangeTimer = Math.floor(Math.random() * 50);
        }
        this.projectileDirection=this.velocity.x>0?7:-7
        
        
    }
  }
var projectileDirection =20

class Player{
    constructor(){
        this.position={
            x:100,
            y:100,
        }
        this.velocity={
            x:0,
            y:0,
        }
        this.width=66;
        this.height=150;
        this.image= createImage("../img/spriteStandRight.png");
        this.frames=0;
        this.sprites={
            stand:{
                right:createImage("../img/spriteStandRight.png"),
                left:createImage("../img/spriteStandLeft.png"),
                cropwidth:177,
                width:66
            },
            run:{
                right:createImage("../img/spriteRunRight.png"),
                left:createImage("../img/spriteRunLeft.png"),
                cropwidth:341,
                width:127.875
            },
            
        }
        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = this.sprites.stand.cropwidth;
        this.projectiles = [];
    }

    draw(){
        c.drawImage(this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height)
    }

    

    shoot() {
        const projectile = new Projectile(this.position.x+this.width, this.position.y + this.height / 2, projectileDirection, "createImage('projectile.png')");
        this.projectiles.push(projectile);
    }

    update(){
        this.frames++
        if(this.frames>59 && (this.currentSprite==this.sprites.stand.right||this.currentSprite==this.sprites.stand.left)){
            this.frames=0
        }
        
        if(this.frames>29 && (this.currentSprite==this.sprites.run.right||this.currentSprite==this.sprites.run.left)){
            this.frames=0
        }
        this.draw()
        this.position.y+=this.velocity.y
        this.position.x+=this.velocity.x
        if(this.position.y+this.height+this.velocity.y<canvas.height){
            this.velocity.y+=gravity 
        }else{
            this.velocity.y=0
        }
    }
}


var player=new Player();
var enemy=new Enemy(1100,200,200,200)
player.draw()
const keys={
    right:{
        pressed: false,
    },
    left:{
        pressed: false,
    }
}
let scrollOffset=0
let scrollOffsetOld=0
let biggestScroll=0


class InclinedPlatform {
    constructor(x, y, width, height, angle, speed) {
        this.position = { x, y };
        this.width = width;
        this.height = height;
        this.angle = angle; // Angle of inclination in radians
        this.speed = speed; // Horizontal speed
    }

    update() {
        // Move the platform horizontally
        this.position.x += this.speed;
    }

    draw() {
        // Draw the inclined platform
        c.fillStyle = 'blue';
        c.save(); // Save the canvas state
        c.translate(this.position.x, this.position.y);
        c.rotate(this.angle); // Rotate the canvas context
        c.fillRect(0, 0, this.width, this.height);
        c.restore(); // Restore the canvas state
    }
}




class Platform{
    constructor({x,y,image},width,height){
        this.position={
            x,
            y,
        }
        this.image=image
        this.width=this.image.width;
        this.height=this.image.height;
    }


    draw(){
        c.drawImage(this.image,this.position.x,this.position.y)
    }
}

class GenericObject{
    constructor({x,y,image},width,height){
        this.position={
            x,
            y,
        }
        this.image=image
        this.width=this.image.width;
        this.height=this.image.height;
    }


    draw(){
        c.drawImage(this.image,this.position.x,this.position.y)
    }
}
function createImage(src){
    img=new Image();
    img.src=src;
    return img
}
//  image=new Image()
// image.src="../img/platform.png"


var platforms=[]
var genericObjects=[]
platforms=[
    new Platform({x:0,y:470,image:createImage("../img/platform.png")},200,10,),
new Platform({x:createImage("../img/platform.png").width*3+150,y:370,image:createImage("../img/platformSmallTall.png")},100,20),
new Platform({x:widthBg*2+150,y:370,image:createImage("../img/platformSmallTall.png")},100,20),
new Platform({x:widthBg,y:470,image:createImage("../img/platform.png")},100,20),
new Platform({x:widthBg*2+100,y:470,image:createImage("../img/platform.png")},100,20),
new Platform({x:widthBg*4,y:470,image:createImage("../img/platform.png")},100,20),
]
genericObjects=[new GenericObject({x:0,y:0,image:createImage("../img/background.png")},200,10,),new GenericObject({x:0,y:0,image:createImage("../img/hills.png")},100,20)]



var enemys=[]
var bgst=3880
var bal=false
var widthBg=580;
var widthSbg=291
var widthFbg=createImage("../img/platformHover.png").width


function init(){
    bal=false
    bgst=3880
    scrollOffset=0
    scrollOffsetOld=0
    biggestScroll=0
     player=new Player();
     enemys=[new Enemy(500,200,200,200)];
player.draw()
enemys.forEach(enemy=>{enemy.draw()});

     
// image.src="../img/platform.png"

platforms=[
    new Platform({x:0,y:470,image:createImage("../img/platform.png")},200,10,),
new Platform({x:createImage("../img/platform.png").width*3+150,y:370,image:createImage("../img/platformSmallTall.png")},100,20),
new Platform({x:widthBg*2+150,y:370,image:createImage("../img/platformSmallTall.png")},100,20),
new Platform({x:widthBg,y:470,image:createImage("../img/platform.png")},100,20),
new Platform({x:widthBg*2+100,y:470,image:createImage("../img/platform.png")},100,20),
new Platform({x:widthBg*4,y:470,image:createImage("../img/platform.png")},100,20),
]
genericObjects=[new GenericObject({x:0,y:0,image:createImage("../img/background.png")},200,10,),new GenericObject({x:0,y:0,image:createImage("../img/hills.png")},100,20)]

}

function startGame() {
    gameState = "playing";
    // Initialize game objects and variables
    // Start the game loop
}
var shot = Math.floor(Math.random() * 100);

function animate(){
    requestAnimationFrame(animate)
    c.fillStyle="white"
    if (gameState === "menu") {
        drawMainMenu();
    } else if (gameState === "playing") {
        // Game logic and drawing while playing
        backgroundMusic.play()
    
    document.getElementById('score').innerHTML=scrollOffset
    c.fillRect(0,0,canvas.width,canvas.height)
    genericObjects.forEach(genericObject=>{
        genericObject.draw()
        
    })
    platforms.forEach(platform=>{
        platform.draw()
        
    })
    player.update();
    enemys.forEach(enemy=>{enemy.update();
        // if(!(enemy instanceof EnemyFlying)){

        //     platforms.forEach(platform=>{
        //         enemy.checkAndJumpOffPlatform(platform)
        //     })
        // }
    });
    if(keys.right.pressed && player.position.x<400){
        projectileDirection=20;
        player.velocity.x=5
    }
    else if(keys.left.pressed && player.position.x>100){
        
        projectileDirection=-20;
        player.velocity.x=-5
    }
    else{
        player.velocity.x=0
        if(keys.right.pressed){
            projectileDirection=20;
            scrollOffset+=5
            genericObjects.forEach(genericObject=>{
                genericObject.position.x-=6; 
                
            })
            enemys.forEach(enemy=>{enemy.position.x-=10});
            platforms.forEach(platform=>{
                
                platform.position.x-=10;
                
            })
            player.projectiles.forEach(platform=>{
                
                platform.position.x-=10;
                
            })
        }else {
            if(keys.left.pressed && scrollOffset>0){
                scrollOffset-=5
                genericObjects.forEach(genericObject=>{
                    genericObject.position.x+=6; 
                    projectileDirection=-20;
                    
                })
                enemys.forEach(enemy=>{
                    enemy.position.x+=10});
                    platforms.forEach(platform=>{
                        platform.position.x+=10;            
                    })
                }else{
                    if(keys.left.pressed && scrollOffset==0 && player.position.x>0){
                        player.velocity.x=-5
                        projectileDirection=-20;
                    }
                }
            }
            
        }
        enemys = enemys.filter(enemy => {
            // Keep enemies whose bottoms have not reached or crossed the canvas height
            return enemy.position.y + enemy.height < canvas.height;
    });
    
    if(player.position.y+player.height>=canvas.height){
        gameState = "death";
        backgroundMusic.pause()
    }
    platforms.forEach(platform=>{
        if(platform instanceof InclinedPlatform){
            // const platformHeightAtPlayer = platform.position.y + Math.tan(platform.angle) * (player.position.x - platform.position.x);

            const platformHeightAtPlayer = platform.position.y-platform.height + Math.tan(platform.angle) * (player.position.x - platform.position.x);


            if (player.position.x + player.width >= platform.position.x &&
                player.position.x <= platform.position.x + platform.width &&
                player.position.y + player.height >= platformHeightAtPlayer) {
                // Player is on the inclined platform
                player.velocity.y = 0;jump=0; // Stop player from falling
                player.position.y = platformHeightAtPlayer - player.height;
            }

            enemys.forEach(enemy=>{
                const platformHeightAtEnemy = platform.position.y-platform.height + Math.tan(platform.angle) * (enemy.position.x - platform.position.x);


                // const platformHeightAtEnemy = platform.position.y + Math.tan(platform.angle) * (enemy.position.x - platform.position.x);
                if (enemy.position.x + enemy.width >= platform.position.x &&
                    enemy.position.x <= platform.position.x + platform.width &&
                    enemy.position.y + enemy.height >= platformHeightAtEnemy) {
                    if(!(enemy instanceof EnemyFlying)&&!(enemy instanceof EnemyFlying2)){
                        enemy.velocity.y = 0; // Stop player from falling
                        enemy.position.y = platformHeightAtEnemy - enemy.height;
                        enemy.velocity.y =0;enemy.isJumping=false;
                        enemy.checkAndJumpOffPlatform(platform)
                    }
                } 
               });
        }else{
            if(player.position.y+player.height <= platform.position.y && player.position.y + player.height + player.velocity.y > platform.position.y && player.position.x<platform.position.x+platform.width && player.position.x+player.width>platform.position.x){
                player.velocity.y =0;jump=0;
            }      
            enemys.forEach(enemy=>{
            if(enemy.position.y+enemy.height <= platform.position.y && enemy.position.y + enemy.height + enemy.velocity.y > platform.position.y && enemy.position.x<platform.position.x+platform.width && enemy.position.x+enemy.width>platform.position.x){
                if(!(enemy instanceof EnemyFlying)&&!(enemy instanceof EnemyFlying2)){
                    enemy.velocity.y =0;enemy.isJumping=false;
                    enemy.checkAndJumpOffPlatform(platform)
                }
            } 
           });

        }
        
        enemys.forEach(enemy=>{
        if(player.position.x+player.width >= enemy.position.x  && player.position.x <= enemy.position.x+enemy.width && player.position.y+player.height > enemy.position.y-10 && player.position.y< enemy.position.y+enemy.height ){
            gameState = "death";
            backgroundMusic.pause()
        }else if(player.position.x+player.width >= enemy.position.x  && player.position.x <= enemy.position.x+enemy.width && player.position.y+player.height <= enemy.position.y && player.position.y+player.height >= enemy.position.y-40){
            
            enemys = enemys.filter(enemy => {
                // Define the condition to identify enemies that haven't touched the player
                return player.position.x + player.width < enemy.position.x || player.position.x == enemy.position.x;
            });
            player.velocity.y=0
            player.velocity.y-=10
        }
        else{
            // enemy.velocity.x =-1;
        }})
    })
    if(scrollOffset>=2000){
        console.log("win")
    }
    player.projectiles.forEach((projectile, pIndex) => {
        enemys.forEach((enemy, eIndex) => {
            if (
                projectile.position.x + projectile.radius >= enemy.position.x &&
                projectile.position.x <= enemy.position.x + enemy.width &&
                projectile.position.y + projectile.radius >= enemy.position.y &&
                projectile.position.y <= enemy.position.y + enemy.height
            ) {
                // Projectile has hit the enemy
                enemys.splice(eIndex, 1); // Remove the enemy from the enemys array
                player.projectiles.splice(pIndex, 1); // Remove the projectile from the player's projectiles array
            }
        });
    });
    
    
    
    if(bal==false){
        genericObjects.push( new GenericObject({x:createImage("../img/background.png").width,y:0,image:createImage("../img/background.png")},200,10,))
        genericObjects.push( new GenericObject({x:createImage("../img/hills.png").width,y:0,image:createImage("../img/hills.png")},200,10,))
        bal=true
    }
    if(( biggestScroll<scrollOffset && (scrollOffset)==(bgst))){
        bgst+=3880
       genericObjects.push( new GenericObject({x:createImage("../img/background.png").width,y:0,image:createImage("../img/background.png")},200,10,))
       
    }
    if(( biggestScroll<scrollOffset && (scrollOffset+400+5)%createImage("../img/hills.png").width==0)||scrollOffset==0){
        genericObjects.push( new GenericObject({x:createImage("../img/hills.png").width,y:0,image:createImage("../img/hills.png")},200,10,))
     }
    if(scrollOffset>400 && biggestScroll<scrollOffset && scrollOffset%700==0){
        // platforms.push(new Platform({x:(400)*(Math.random())+(1024),y:370,image:createImage("../img/platformSmallTall.png")},100,20))
        // platforms.push(new Platform({x:(200)*(Math.random())+(1024),y:470,image:createImage("../img/platform.png")},100,20))
        // platforms.push(new Platform({x:(200)*(Math.random())+(1024),y:370*(Math.random())+100,image:createImage("../img/platformHover.png")},100,20))
        generateRandomPlatforms(3).forEach(plat=>{
            platforms.push(plat)
        })
        addNewEnemies()
        
        
    }
    scrollOffsetOld=scrollOffset
    if(scrollOffsetOld>biggestScroll){
        biggestScroll=scrollOffsetOld
    }
    if(player.projectiles.length>0){
        updateProjectiles()
    }
    enemys.forEach(enemy => {
        if((enemy instanceof EnemyFlying)||(enemy instanceof EnemyFlying2)){
            if(enemy.projectiles.length>0  ){
                
                updateEnemyProjectiles(enemy)
                // enemy.projectiles.forEach(element => {
                //     element.update()
                // });
            }

        }
        
    });
    shot--
    enemys.forEach(enemy => {
        if((enemy instanceof EnemyFlying)||(enemy instanceof EnemyFlying2)){
            if(shot<0){
                if(enemy.projectiles.length<2){
                    if(Math.random()<0.3){
                        enemy.shoot()
                        console.log("shoot")

                    }
                }
                shot = Math.floor(Math.random() * 100);
            }
            enemy.projectiles.forEach((projectile, pIndex) => {
                    
                if (
                        projectile.position.x + 15 >= player.position.x &&
                        projectile.position.x <= player.position.x + player.width 
                        &&
                        projectile.position.y  >= player.position.y 
                        &&
                        projectile.position.y <= player.position.y + player.height
                    ) {
                        // Projectile has hit the enemy
                        gameState = "death"
                        console.log(gameState)
                    }
                
            });
        }
    });


}else if (gameState === "death") {
    // Draw the death menu
    
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "red"; // Set the color for the death menu
    c.fillRect(0, 0, canvas.width, canvas.height); // Background

    c.fillStyle = "white"; // Set the text color
    c.font = "30px Arial"; // Set the font size and family
    c.fillText("you died", canvas.width / 2 - 70, canvas.height / 2 - 15); // Display the death message
}
}

function randomX(min, max) {
    return Math.random() * (max - min) + min;
}

function randomY(min, max) {
    return Math.random() * (max - min) + min;
}


function generateRandomPlatforms(count) {
    const platforms = [];
    const xBounds = { min: 1024, max: 2048 }; // Adjust the x-range as needed
    const yBounds = { min: 370, max: 470 };   // Adjust the y-range as needed

    let prevX = xBounds.min;

    for (let i = 0; i < count; i++) {
        const isFlyingPlatform = Math.random() < 0.6; // 20% chance of flying platform

        let x;
        let y;
        let image;

        if (isFlyingPlatform) {
            x = prevX + randomX(150, 350); // Flying platforms are spaced apart
            y = randomY(yBounds.min, yBounds.max);
            // if(Math.random()>0.5){
                image = createImage("../img/platformHover.png");

            // }else{
                // image = new InclinedPlatform(x, y, 500, 20, -Math.PI / 6, 2); // Example values

            // }


        } else {
            const smallTall = Math.random() < 0.7; // 20% chance of small-tall platform
            x = prevX + randomX(150, 300); // Regular platforms
            y = smallTall ? randomY(300, 470) : yBounds.max;
            image = createImage(smallTall ? "../img/platformSmallTall.png" : "../img/platform.png");
        }

        prevX = x;
        if(image instanceof InclinedPlatform){
            platforms.push(image);
        }else{
            platforms.push(new Platform({
                x: x,
                y: y,
                image: image
            }, 100, 20));
        }
    }
    
    return platforms;
}


function generateRandomEnemies(count) {
    const generatedEnemies = [];
    const startX = canvas.width + 200; // Initial x-coordinate for new enemies
    const minY = 100; // Minimum y-coordinate for new enemies
    const maxY = 400; // Maximum y-coordinate for new enemies
    var rand= Math.random()
    for (let i = 0; i < count; i++) {
        const randomY = Math.random() * (maxY - minY) + minY;
        if(rand<0.5){
            rand= Math.random()
            if(rand>0.5){
                generatedEnemies.push(new Enemy(startX + i * 300, randomY, 200, 200));
            }else{
                generatedEnemies.push(new EnemySoldier(startX + i * 300, randomY, 200, 200));
            }
        }else{
            rand= Math.random()
            if(rand>0.5){
                generatedEnemies.push(new EnemyFlying2(startX + i * 300, randomY, 200, 200));
            }else{
            
                generatedEnemies.push(new EnemyFlying(startX + i * 300, randomY, 200, 200));
            }
        }
    }

    return generatedEnemies;
}

function addNewEnemies() {
    const newEnemies = generateRandomEnemies(3); // Generate 3 new enemies
    enemys = enemys.concat(newEnemies); // Add the new enemies to the existing array
}

setTimeout(() => {
    init()

animate()
}, 500);


function drawMainMenu() {
    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw menu elements, including a start button
    c.fillStyle = "blue";
    c.fillRect(0,0,canvas.width,canvas.height); // Example button coordinates and size
    c.fillStyle = "white";
    c.fillText("Start Game", (canvas.width/2)-35, canvas.height/2); // Example button text
}



canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (gameState === "menu") {
        if (x >= (canvas.width/2)-35 && x <= (canvas.width/2)-35+70 && y >= canvas.height/2-20 && y <= (canvas.height/2)) {
            // The click occurred within the button area
            startGame(); // Call the function to start the game
            backgroundMusic.currentTime=0
            backgroundMusic.play()
        }
    }
    if(gameState === "death"){
        backgroundMusic.currentTime=0
            backgroundMusic.play()
        init()
        startGame();
    }
});





var shoot=true

document.addEventListener('keydown',function(event){
    switch(event.key){
        case "a": keys.left.pressed=true;player.currentSprite=player.sprites.run.left;
        player.currentCropWidth=player.sprites.run.cropwidth;
        player.width=player.sprites.run.width;break;
        case "w":if(jump<2){soundEffect.currentTime=0;soundEffect.play(); player.velocity.y=0;player.velocity.y-=20;jump++};break;
        case "s": ;break;
        case "d": keys.right.pressed=true;
        player.currentSprite=player.sprites.run.right;
        player.currentCropWidth=player.sprites.run.cropwidth;
        player.width=player.sprites.run.width;break;
        case " ":if(shoot){player.shoot();shoot=false;setTimeout(() => {
           shoot=true 
        }, 500);};break;
    }


})

document.addEventListener('keyup',function(event){
    switch(event.key){
        case "a": keys.left.pressed=false;
        player.currentSprite=player.sprites.stand.left;
        player.currentCropWidth=player.sprites.stand.cropwidth;
        player.width=player.sprites.stand.width;break;
        // case "w": player.velocity.y-=20;break;
        case "s": ;
        player.currentSprite=player.sprites.stand.right;
        player.currentCropWidth=player.sprites.stand.cropwidth;
        player.width=player.sprites.stand.width;break;
        case "d": keys.right.pressed=false;
        player.currentSprite=player.sprites.stand.right;
        player.currentCropWidth=player.sprites.stand.cropwidth;
        player.width=player.sprites.stand.width;break;
        case "q":;break;
    }


})

