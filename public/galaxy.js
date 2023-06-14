console.log("js working");
const canvas=document.querySelector("canvas");
const c=canvas.getContext("2d");
canvas.width=window.innerWidth
canvas.height=window.innerHeight
// canvas.width=1024
// canvas.height=500
const playerSpeed=10
const projectileSpeed=15
const gridSpeed=5
const rotateAngle=0.1
class Player{
    constructor(){
        this.velocity={
            x:0,y:0
        }
        this.rotate=0
        const img=new Image()
        img.src="galaxyimages/spaceship.png"
        const scale=0.15
        img.onload=()=>{
            this.image=img
            this.height=img.height*scale
            this.width=img.width*scale
            this.position={
                x:canvas.width/2-this.width/2,y:canvas.height-this.height-20
            }
        }
        this.opacity=1
    }
    draw(){
        c.save()
        c.globalAlpha=this.opacity
        c.translate(this.position.x+this.width/2,this.position.y+this.height/2)
        c.rotate(this.rotate)
        c.translate(-this.position.x-this.width/2,-this.position.y-this.height/2)
        if(this.image)c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
        c.restore()
    }
    update(){
        if(this.image){ 
            this.draw()
            this.position.x+=this.velocity.x
        }
    }
}
class Projectile{
    constructor({position,velocity}){
        this.position=position
        this.velocity=velocity
        this.radius=4
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        c.fillStyle='white'
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
    }
}
class InvaderProjectile{
    constructor({position,velocity}){
        this.position=position,
        this.velocity=velocity
        this.width=6
        this.height=18
    }
    draw(){
        c.fillStyle='red'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
    update(){
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
    }
}
class Invader{
    constructor({position}){
        this.velocity={
            x:0,y:0
        }
        const img=new Image()
        img.src="galaxyimages/invader.png"
        const scale=1
        img.onload=()=>{
            this.image=img
            this.height=img.height*scale
            this.width=img.width*scale
            this.position={
                x:position.x,y:position.y
            }
        }
    }
    draw(){
        if(this.image)c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
    }
    update({velocity}){
        if(this.image){ 
            this.draw()
            this.position.x+=velocity.x
            this.position.y+=velocity.y
        }
    }
    shoot(InvaderProjectiles){
        InvaderProjectiles.push(new InvaderProjectile({
            position:{
                x:this.position.x+this.width/2, y:this.position.y+this.height
            },
            velocity:{
                x:0,y:projectileSpeed-10
            }
        }))
    }
}
class Grid{
    constructor(){
        this.position={
            x:0,y:0
        }
        this.velocity={
            x:gridSpeed,y:0
        }
        this.invaders=[]
        const rows=Math.floor(Math.random()*5+2)
        const columns=Math.floor(Math.random()*10+5)
        this.width=columns*30;
        for(let i=0;i<columns;i++){
            for(let j=0;j<rows;j++){
                this.invaders.push(new Invader({
                    position:{
                        x:i*30, y:j*30
                    }
                }))
            }
        }
    }
    update(){
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        this.velocity.y=0
        if(this.position.x+this.width>=canvas.width || this.position.x<=0){
            this.velocity.x=-this.velocity.x
            this.velocity.y+=30
        }
    }
}
class Particle{
    constructor({position,velocity,radius,color,fades}){
        this.position=position
        this.velocity=velocity
        this.radius=radius
        this.color=color
        this.opacity=1
        this.fades=fades
    }
    draw(){
        c.save()
        c.globalAlpha=this.opacity
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        c.fillStyle=this.color
        c.fill()
        c.closePath()
        c.restore()
    }
    update(){
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        if(this.fades)this.opacity-=0.01
    }
}

const grids=[]
const projectiles=[]
const player=new Player()
const invaderProjectiles=[]
const particles=[]
let score=0
const game={
    active:true, over:false
}
const keys={
    "a":false,"d":false,"space":false
}
let frames=0
let randomInterval=Math.floor(Math.random()*500+500)
// background stars
for(let m=0;m<100;m++){
    particles.push(new Particle({
        position:{
            x:Math.random()*canvas.width, y:Math.random()*canvas.height
        },
        velocity:{x:0,y:0.3},
        radius:Math.random()*2,
        color:"white",
    }))
}

function createParticles({object, color,fades}){
    for(let m=0;m<15;m++){
        particles.push(new Particle({
            position:{
                x:object.position.x+object.width/2, y:object.position.y+object.height/2
            },
            velocity:{x:(Math.random()-0.5)*2,y:(Math.random()-0.5)*2},
            radius:Math.random()*3,
            color:color || "#BAA0DE",
            fades: fades
        }))
    }
}
function animate(){
    if(!game.active) return
    var animationId=requestAnimationFrame(animate)
    c.fillStyle="black"
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    
    particles.forEach((particle,i)=>{
        if(particle.position.y-particle.radius>=canvas.height){
            particle.position.y=-particle.radius
            particle.position.x=Math.random()*canvas.width
        }
        if(particle.opacity<=0){
            setTimeout(()=>{
                particles.splice(i,1)
            },0)
        }
        else particle.update()
    })

    // invaderProjectiles
    invaderProjectiles.forEach((projectile,i)=>{
        if(projectile.position.y+projectile.height>=canvas.height){
            setTimeout(()=>{
                invaderProjectiles.splice(i,1)
            },0)
        }
        else projectile.update()
        //testing collision with player
        if(projectile.position.y+projectile.height>=player.position.y &&
            projectile.position.x+projectile.width>=player.position.x &&
            projectile.position.x<=player.position.x+player.width){
                setTimeout(()=>{
                    invaderProjectiles.splice(i,1)
                    game.over=true
                },0)
                setTimeout(()=>{
                    game.active=false
                },1000)
                createParticles({
                    object:player,color:"white",fades:true
                })
                player.opacity=0
                // cancelAnimationFrame(animationId)
            }
    })

    grids.forEach((grid,k)=>{
        grid.update()

        //selecting invader to shoot
        if(frames%100==0 && grid.invaders.length>0){
            grid.invaders[Math.floor(Math.random()*grid.invaders.length)].shoot(invaderProjectiles)
        }

        grid.invaders.forEach((invader,i)=>{
            invader.update({velocity: grid.velocity})

            // projectile hits eneemy
            projectiles.forEach((projectile,j)=>{
                if(projectile.position.y-projectile.radius<=invader.position.y+invader.height && 
                    projectile.position.y+projectile.radius>=invader.position.y&&
                    projectile.position.x+projectile.radius>=invader.position.x &&
                    projectile.position.x-projectile.radius<=invader.position.x+invader.width){
                        //particle
                        setTimeout(function(){
                            const invaderFound=grid.invaders.find(invader2=>invader2===invader)
                            const projectileFound=projectiles.find(projectile2=>projectile2===projectile)
                            if(invaderFound && projectileFound){
                                score+=5
                                document.querySelector("#score").innerText=score
                                createParticles({
                                    object: invader,fades:true
                                })
                                grid.invaders.splice(i,1)
                                projectiles.splice(j,1)
                            }
                            if(grid.invaders.length>0){
                                const firstInvader=grid.invaders[0]
                                const lastInvader=grid.invaders[grid.invaders.length-1]
                                grid.width=lastInvader.position.x-firstInvader.position.x+lastInvader.width
                                grid.position.x=firstInvader.position.x
                            }
                            else{
                                grids.splice(k,1)
                            }
                        },0)
                }
            })
        })
    })

    if(keys.a===true && player.position.x>=0){
        player.velocity.x=-playerSpeed
        player.rotate=-rotateAngle
    }
    else if(keys.d===true && player.position.x<=(canvas.width-player.width)) {
        player.velocity.x=playerSpeed
        player.rotate=rotateAngle
    }
    else{
        player.velocity.x=0
        player.rotate=0
    }
    projectiles.forEach((projectile,index)=>{
        projectile.update()
        if((projectile.position.y+projectile.radius)<=0){
            setTimeout(()=>{
                projectiles.splice(index,1)
            },0)
        }
    })

    if(frames%randomInterval==0){
        grids.push(new Grid())
        randomInterval=Math.floor(Math.random()*500+500)
        frames=0
    }
    frames++
} 
animate()

document.addEventListener("keydown",function({key}){
    if(game.over) return
    switch(key){
        case "a": keys.a=true
        break
        case "d": keys.d=true
        break
        case " ": keys.space=true
        projectiles.push(new Projectile({
            position:{
                x:player.position.x+player.width/2,y:player.position.y
            },
            velocity:{
                x:0,y:-projectileSpeed
            }
        }))
        break
    }
})
document.addEventListener("keyup",function({key}){
    switch(key){
        case "a": keys.a=false
        break
        case "d": keys.d=false
        break
        case " ": keys.space=false
        break
    }
})