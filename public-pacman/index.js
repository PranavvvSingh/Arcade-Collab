const canvas=document.querySelector("canvas")
const c=canvas.getContext("2d")
canvas.width=window.innerWidth*0.47
canvas.height=window.innerHeight*0.93
const bordervalue=40
const pacmanRadius=17
const pelletRadius=2
const pacSpeed=4 // pacman speed
const ghostSpeed=2
var score=0;
class Boundary{
    static height=bordervalue
    static width=bordervalue
    constructor({position}){
        this.position=position
        this.width=bordervalue
        this.height=bordervalue
    }
    draw(){
        c.fillStyle='blue'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
}
class Player{
    constructor({position,velocity}){
        this.position=position
        this.velocity=velocity
        this.radius=pacmanRadius
        this.radians=0.6
        this.openRate=0.1
        this.rotation=0
    }
    draw(){
        c.save()
        c.translate(this.position.x,this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x,-this.position.y)

        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius, this.radians, 2*Math.PI-this.radians)
        c.lineTo(this.position.x,this.position.y)
        c.fillStyle='yellow'
        c.fill()
        c.closePath()
        c.restore()
    }
    update(){
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        this.radians+=this.openRate
        if(this.radians <0 || this.radians>0.6) this.openRate=-this.openRate
    }
}
class Ghost{
    constructor({position,velocity,color}){
        this.position=position
        this.velocity=velocity
        this.color=color
        this.radius=pacmanRadius-1
        this.prevCollisions=[]
        this.scared=false
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius, 0, 2*Math.PI)
        c.fillStyle=this.scared?"blue":this.color
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
    }
}
class Pellet{
    constructor({position}){
        this.position=position
        this.radius=pelletRadius
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0, 2*Math.PI)
        c.fillStyle='white'
        c.fill()
        c.closePath()
    }
}
class PowerUp{
    constructor({position}){
        this.position=position
        this.radius=pelletRadius+2
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0, 2*Math.PI)
        c.fillStyle='yellow'
        c.fill()
        c.closePath()
    }
}

//declaration area
const keys={
    w:{pressed:false},
    a:{pressed:false},
    s:{pressed:false},
    d:{pressed:false}
}
var lastKey; 
// const map=[
//     ['-','-','-','-','-','-','-','-','-','-','-'],
//     ['-','X',' ',' ',' ',' ',' ',' ',' ',' ','-'],
//     ['-',' ','-',' ','-','-','-',' ','-',' ','-'],
//     ['-',' ',' ',' ',' ','-',' ',' ',' ',' ','-'],
//     ['-',' ','-','-',' ',' ',' ','-','-',' ','-'],
//     ['-',' ',' ',' ',' ','-',' ',' ',' ',' ','-'],
//     ['-',' ','-',' ','-','-','-',' ','-',' ','-'],
//     ['-',' ',' ',' ',' ','-',' ',' ',' ',' ','-'],
//     ['-',' ','-','-',' ',' ',' ','-','-',' ','-'],
//     ['-',' ',' ',' ',' ','-',' ',' ',' ',' ','-'],
//     ['-',' ','-',' ','-','-','-',' ','-',' ','-'],
//     ['-',' ',' ',' ',' ',' ',' ',' ',' ','.','-'],
//     ['-','-','-','-','-','-','-','-','-','-','-'],
// ]
// x to remove pellet and set score to 0
const map=[
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
    ['-','X',' ',' ',' ',' ',' ','-',' ',' ',' ',' ',' ',' ','-'],
    ['-',' ','-','-','-','-',' ','-',' ','-','-','-','-',' ','-'],
    ['-',' ','-',' ',' ',' ',' ','-',' ',' ',' ',' ',' ',' ','-'],
    ['-',' ',' ',' ','-','-',' ',' ',' ','-','-','-','-',' ','-'],
    ['-','-','-',' ',' ',' ',' ','-',' ',' ',' ',' ','-',' ','-'],
    ['-',' ',' ',' ','-',' ','-','-','-',' ','-',' ','-',' ','-'],
    ['-',' ','-',' ',' ',' ',' ','-',' ',' ',' ',' ','-',' ','-'],
    ['-',' ','-','-','-','-',' ',' ',' ','-','-',' ',' ',' ','-'],
    ['-',' ','-',' ',' ',' ',' ','-',' ',' ','-',' ','-',' ','-'],
    ['-',' ','-',' ','-',' ','-','-','-',' ','-',' ','-',' ','-'],
    ['-',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','.',' ',' ','-'],
    ['-','-','-','-','-','-','-','-','-','-','-','-','-','-','-'],
]
const pellets=[]
const powerups=[]
const boundaries=[]
const ghosts=[
    new Ghost({
        position:{x:Boundary.width/2+Boundary.width*13,y:Boundary.height*3/2},
        velocity: {x:-ghostSpeed,y:0},
        color: "red"
    }),
    new Ghost({
        position:{x:Boundary.width/2+Boundary.width,y:Boundary.height/2+Boundary.height*11},
        velocity: {x:0,y:-ghostSpeed},
        color: "red"
    })
]
const player=new Player({
    position:{x:Boundary.width*3/2,y:Boundary.height*3/2},
    velocity: {x:0,y:0}
})
map.forEach(function(row,i){
    row.forEach(function(symbol,j){
        switch(symbol){
            case '-': boundaries.push(new Boundary({position:{
                x:Boundary.width*j, y:Boundary.height*i
            }}))
            break
            case ' ': pellets.push(new Pellet({position:{
                x: Boundary.width*j+Boundary.width/2, y:Boundary.height*i+Boundary.width/2
            }}))
            break
            case '.':powerups.push(new PowerUp({position:{
                x: Boundary.width*j+Boundary.width/2, y:Boundary.height*i+Boundary.width/2
            }}))
            break
        }
    })
})


function collisionDetection({player,boundary}){
    const padding=Boundary.width/2-player.radius-1;
    return ((player.position.y-player.radius+player.velocity.y)<=(boundary.position.y+boundary.height+padding) &&
    (player.position.y+player.radius+player.velocity.y)>=(boundary.position.y-padding) &&
    (player.position.x+player.radius+player.velocity.x)>=(boundary.position.x-padding) &&
    (player.position.x-player.radius+player.velocity.x)<=(boundary.position.x+boundary.width+padding))
}
var annimationId;
function animate(){
    c.clearRect(0,0,canvas.width, canvas.height)
    annimationId=requestAnimationFrame(animate)
    
    if(keys.w.pressed && lastKey=='w'){
        for(var x=0;x<boundaries.length;x++){
            if(collisionDetection({player:{...player, velocity: {x:0,y:-pacSpeed}},boundary:boundaries[x]})){
                player.velocity.y=0
                break
            }
            else{
                player.velocity.y=-pacSpeed
            }
        }
    } 
    else if(keys.a.pressed && lastKey=='a'){
        for(var x=0;x<boundaries.length;x++){
            if(collisionDetection({player:{...player, velocity: {x:-pacSpeed,y:0}},boundary:boundaries[x]})){
                player.velocity.x=0
                break
            }
            else{
                player.velocity.x=-pacSpeed
            }
        }
    } 
    else if(keys.s.pressed && lastKey=='s'){
        for(var x=0;x<boundaries.length;x++){
            if(collisionDetection({player:{...player, velocity: {x:0,y:pacSpeed}},boundary:boundaries[x]})){
                player.velocity.y=0
                break
            }
            else{
                player.velocity.y=pacSpeed
            }
        }
    } 
    else if(keys.d.pressed && lastKey=='d'){
        for(var x=0;x<boundaries.length;x++){
            if(collisionDetection({player:{...player, velocity: {x:pacSpeed,y:0}},boundary:boundaries[x]})){
                player.velocity.x=0
                break
            }
            else{
                player.velocity.x=pacSpeed
            }
        }
    }
    boundaries.forEach(boundary=>{
        boundary.draw()
        if(collisionDetection({player:player,boundary:boundary})){
            player.velocity.x=0;
            player.velocity.y=0;
        }
    })
    for(var x=pellets.length-1;x>=0;x--){
        const pellet=pellets[x]
        pellet.draw()
        if(Math.hypot(player.position.x-pellet.position.x,player.position.y-pellet.position.y)<(player.radius+pellet.radius)){
            score++;
            pellets.splice(x,1)
        }
        if(pellets.length==0){
            document.querySelector("p").innerText="You Win!";
            cancelAnimationFrame(annimationId)
        }
        else document.querySelector("#score").innerText=score;
    }
    for(var x=powerups.length-1;x>=0;x--){
        element=powerups[x]
        element.draw()
        if(Math.hypot(player.position.x-element.position.x,player.position.y-element.position.y)<=(player.radius+element.radius)){
            powerups.splice(x,1)
            console.log("eaten")
            ghosts.forEach(function(ghost){
                ghost.scared=true
                setTimeout(()=>{
                    ghost.scared=false
                },8000)
            })
        }
    }
    player.update();
    for(var x=ghosts.length-1;x>=0;x--){
        var ghost=ghosts[x]
        var collisions=[]
        ghost.update()
        if(Math.hypot(player.position.x-ghost.position.x,player.position.y-ghost.position.y)<(player.radius+ghost.radius)){
            if(!ghost.scared){
                document.querySelector("p").innerHTML="Game Over"
                cancelAnimationFrame(annimationId)
            }
            else ghosts.splice(x,1)
        }
        boundaries.forEach(wall=>{
            if(!collisions.includes("up") && collisionDetection({player:{...ghost, velocity: {x:0,y:-ghostSpeed}},boundary:wall})){
                collisions.push("up")
            }
            if(!collisions.includes("left") && collisionDetection({player:{...ghost, velocity: {x:-ghostSpeed,y:0}},boundary:wall})){
                collisions.push("left")
            }
            if(!collisions.includes("down") && collisionDetection({player:{...ghost, velocity: {x:0,y:ghostSpeed}},boundary:wall})){
                collisions.push("down")
            }
            if(!collisions.includes("right") && collisionDetection({player:{...ghost, velocity: {x:ghostSpeed,y:0}},boundary:wall})){
                collisions.push("right")
            }
        })
        if(collisions.length>ghost.prevCollisions.length)
            ghost.prevCollisions=collisions
        if(JSON.stringify(collisions)!==JSON.stringify(ghost.prevCollisions)){
            if(ghost.velocity.x>0) ghost.prevCollisions.push("right")
            if(ghost.velocity.x<0) ghost.prevCollisions.push("left")
            if(ghost.velocity.y>0) ghost.prevCollisions.push("down")
            if(ghost.velocity.y<0) ghost.prevCollisions.push("up")
            const pathways=ghost.prevCollisions.filter(collision=>{
                return !collisions.includes(collision)
            })
            const direction=pathways[Math.floor(Math.random()*pathways.length)]
            switch(direction){
                case "up": ghost.velocity.x=0
                    ghost.velocity.y=-ghostSpeed
                    break
                case "down":
                    ghost.velocity.x=0
                    ghost.velocity.y=ghostSpeed
                    break
                case "right":
                    ghost.velocity.y=0
                    ghost.velocity.x=ghostSpeed
                    break
                case "left":
                    ghost.velocity.y=0
                    ghost.velocity.x=-ghostSpeed
                    break
            }
            ghost.prevCollisions=[]
        }
    }
    if(player.velocity.x>0)player.rotation=0
    else if(player.velocity.x<0)player.rotation=Math.PI
    else if(player.velocity.y<0)player.rotation=Math.PI*1.5
    else if(player.velocity.y>0)player.rotation=Math.PI/2

}   
animate();


window.addEventListener('keydown',(event)=>{
    switch(event.key){
        case 'w': keys.w.pressed=true
        lastKey='w'
        break
        case 'a': keys.a.pressed=true
        lastKey='a'
        break
        case 's': keys.s.pressed=true
        lastKey='s'
        break
        case 'd': keys.d.pressed=true      
        lastKey='d'
        break
    }
})
window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'w': keys.w.pressed=false
        break
        case 'a': keys.a.pressed=false
        break
        case 's': keys.s.pressed=false
        break
        case 'd': keys.d.pressed=false     
        break
    }
})
