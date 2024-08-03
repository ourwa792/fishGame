const canvas = document.getElementById('canvas1') ;
const ctx = canvas.getContext('2d')
canvas.height = 500;
canvas.width = 800;
let gameSpeed = 1
let score = 0
let gameFrame = 0
let gameOver = false
ctx.font = '40px Georgia'

// mouse interactivity
let canvasPosition = canvas.getBoundingClientRect()
  // console.log(canvasPosition)

const mouse = {
    x : canvas.width/2 ,
    y : canvas.height/2 ,
    click : false
}

canvas.addEventListener('mousedown', function(ev){
    mouse.x = ev.x - canvasPosition.left
    mouse.y = ev.y - canvasPosition.top
    mouse.click = true
   // console.log(mouse.x , mouse.y)
})
canvas.addEventListener('mouseup', function(){
    mouse.click = false
})

// player
// ctx.drawImage(src,sourceالمقصوص_x,source_yالمقصوص,source_widthالمقصوص,source_heightالمقصوص,x_oncanvas,y_oncanvas,width_oncanvas,height_oncanvas)

class Player {
    constructor(){
        this.x = canvas.width ; //
        this.y = canvas.height/2 ; // الموضع الابتدائي للكرة (اللاعب)
        this.radius = 50 ;
        this.angel = 0;
        this.frameX = 0;
        this.frameY =0;
        this.frame =0;
        this.spriteWidth = 498;
        this.spriteHeight = 327
    }

    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        
        this.angel = Math.atan2(dy , dx)
        
        if(mouse.x != this.x){
            this.x -= dx  /20  // لتبطيء الحركة بين الماوس والسمكة
        }
        if(mouse.y != this.y){
            this.y -= dy   /20
        }
    }
    draw(){
        if(mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x , this.y)
            ctx.lineTo(mouse.x , mouse.y)
            ctx.stroke()
        }
        ctx.fillStyle = 'red'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
       // ctx.fill()
        ctx.closePath()
      //  ctx.fillRect(this.x, this.y, this.radius,10)
      ctx.save()  
      ctx.translate(this.x , this.y)
      ctx.rotate(this.angel)

        if(this.x >= mouse.x) {

            ctx.drawImage( playerLeft, this.spriteWidth * this.frameX,
                this.spriteHeight * this.frameY, 
                this.spriteWidth, this.spriteHeight, 0 - 60, 
                0 - 40, this.spriteWidth/4, this.spriteHeight/4  )
        }

        else {
    
            ctx.rotate(Math.PI)
            ctx.drawImage( playerRight, this.spriteWidth * this.frameX,
                this.spriteHeight * this.frameY, 
                this.spriteWidth, this.spriteHeight, 0 -60, 
                0 - 40, this.spriteWidth/4, this.spriteHeight/4  )
         
            }

        ctx.restore()  // بترجع احداثيات الكانفس حسب اخر save
    }
}


const playerLeft = new Image()
playerLeft.src = './leftfish.png'

const playerRight = new Image()
playerRight.src = './rightfish.png'

const player = new Player()

// bubbles
const bubblesArray = []
const bubbleImg = new Image()
bubbleImg.src = './bubble_pop_frame_01.png'

class Bubble{   
    constructor(){
        this.x = Math.random() * canvas.width
        this.y = canvas.height + 100 // مشان تطلع الفقاعات من تحت لفوق ضفنا لطول الكانفس قطر الفقاعة كامل 100 لو طرحنا جرب وشوف
        this.radius = 50
        this.speed = Math.random() * 5 + 1
        this.distance
        this.counted = false
        this.sound = './bubbles-loop1-amp.wav'
        this.text = [34,355]
    }

    update(){
        this.y -= this.speed;
       const dx = this.x - player.x
       const dy = this.y - player.y
        this.distance = Math.sqrt( dx * dx + dy * dy )
    }

    draw(){
       /*  ctx.fillStyle = 'blue'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0,Math.PI * 2)
        ctx.fill()
        ctx.closePath()
        ctx.stroke() */
        ctx.drawImage(bubbleImg, this.x-65, this.y-65, this.radius*2.6, this.radius*2.6) 
        ctx.fillStyle = 'black'
        ctx.font = '14px'
        ctx.fillText(this.text.toString(), this.x, this.y )
    }
    
}

const soundAdd = document.createElement('audio')


function handleBubble(){  // لحتى نضيف اكتر من فقاعة عالمشهد باستخدام غيم فريم كل حمسين مرة بينضاف فقاعة
    if(gameFrame %50 == 0){
        bubblesArray.push(new Bubble()) 
       // console.log(bubblesArray.length)
     }
       

    for (let i = 0; i < bubblesArray.length; i++) {
        bubblesArray[i].update();
        bubblesArray[i].draw();

        if(bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
            console.log('collision happened')
            if  ( ! bubblesArray[i].counted ) {
                soundAdd.src = bubblesArray[i].sound
               // soundAdd.play()
                score ++
                bubblesArray[i].counted = true
                bubblesArray.splice(i,1)  
            }
                
        }
    }
}

// background repeating
const background = new Image()
background.src = './background1.png'

const BG = {
    x1 : 0 ,
    x2 : canvas.width ,
    y : 0 ,
    width : canvas.width ,
    height : canvas.height
}

function handleBackground () {
    BG.x1 -- // تحريك الصورة لليسار
    if (BG.x1 < - BG.width) {   // اعادة الصورة مرة اخرى عند تجاوزها حدود الكانقس بالكامل
        BG.x1 = BG.width 
    }
    BG.x2 -- ;
    if(BG.x2 < -BG.width)  {
            BG.x2 = BG.width
    }
    ctx.drawImage( background, BG.x1, BG.y, BG.width, BG.height )
    ctx.drawImage( background, BG.x2, BG.y, BG.width, BG.height )

}

// Enemy images
const enemyImg = new Image()
enemyImg.src = './__cartoon_fish_06_green_swim.png'

// Enemy
class Enemy {
    constructor(){
        this.x = canvas.width + 200  // العدو موضعه بعد 200 بيكسل من الكانفس
        this.y = Math.random() * (canvas.height -150 ) 
        this.radius = 60
        this.speed = Math.random() * 3 +2
        this.frameX = 0;  // مشان دائما ناخد الصورة الاولى من اليسار باطارات الصور
        this.frameY = 0; //  مشان دائما ناخد الصورة الاولى من فوق باطارات الصور
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327
    }
    update(){
        this.x -= this.speed
        if (this.x < 0 - this.radius * 2) {  //العدو تجاوز الكانفس
            this.x = canvas.width + 200  // ببلش من قبل الكانفس ب200 مشان يبين بلتدريج
            this.y = Math.random() * (canvas.height -150)   //  مو متل الحركة تبع الكونستركترمكانو عشوائي ع محور الواي
            this.speed = Math.random() * 2 + 2  // سرعة عشوائية مشان المفاجئة
        }  // 10

        if (gameFrame % 5 == 0) {
            this.frame ++
            if (this.frame >= 12) this.frame = 0 // 12 عدد الصور
            if (this.frame == 3 || this.frame == 7 || this.frame == 11) { // الصور يلي باخر عمود مشان نرجع العداد لاول عمود
                this.frameX = 0
            } else {
                this.frameX ++
               
            }
             // console.log(this.frameX * this.spriteWidth)
             if (this.frame < 3) this.frameY = 0  // الصور
             else if (this.frame < 7) this.frameY = 1
             else if (this.frame < 11) this.frameY = 2
             else this.frameY = 0
        }
        // collision with player
        
        const dx = this.x - player.x
        const dy = this.y - player.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if(distance < this.radius + player.radius) {
            handleGameOver()
        }
    }
    draw(){
        ctx.fillStyle = 'green'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
       // ctx.fill()
        ctx.drawImage(enemyImg, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 75, this.y - 55, this.spriteWidth/3, this.spriteHeight/3)
    }
}


const enemy1 = new Enemy()
function handleEnemy() {
    enemy1.draw()
    enemy1.update()
}

function handleGameOver(){
    ctx.fillStyle = 'white'
    ctx.font = '10px'
    ctx.fillText(`GAME OVER, YOUR SCORE =${score} `,150, 150, 600)
    gameOver = true
}

// animation loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.update();
    player.draw();
    handleEnemy()
    gameFrame ++ ;
    handleBackground()
    ctx.fillStyle= 'black'
    ctx.fillText('Score :'+ score, 10, 50)
    handleBubble()
    
    if(!gameOver) requestAnimationFrame(animate)
}

animate()

window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect()
})