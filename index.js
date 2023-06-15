const express=require("express")
const signupPage=require("./signup.js")
const arcade=require("./collection.js")

let {signup, user}=signupPage

const app=express()
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.set("view engine","ejs")
app.use("/",express.static("public"))

app.use("/signup",signup)

app.get("/",function(req,res){
    res.sendFile(index.html)
})

app.get("/midflappy",function(req,res){
    res.render("signup",{game:"flappy"})
})
app.get("/midgalaxy",function(req,res){
    res.render("signup",{game:"galaxy"})
})
app.get("/midpacman",function(req,res){
    res.render("signup",{game:"pacman"})
})



app.use("/flappy",async function(req,res,next){
    let data=await arcade.updateOne({game:"flappy"},{$inc:{timesPlayed:1}}) 
    console.log(data)
    next();
}, function(req,res){
    res.render("flappy");
})

app.get("/galaxy",async function(req,res,next){
    let data=await arcade.updateOne({game:"galaxy"},{$inc:{timesPlayed:1}})
    console.log(data)
    next();
},function(req,res){
    res.render("galaxy");
})
app.post("/galaxy",async function(req,res){
    let newScore=req.body.finalScore;
    let data=await arcade.find({game:"galaxy"});
    let oldScore=data[0].highScore;
    if(newScore>oldScore){
        await arcade.updateOne({game:"galaxy"},{$set:{highScore:newScore}})
    }
    res.render("gameover",{data:{newScore:newScore, oldScore:oldScore}})
})

app.get("/pacman",async function(req,res,next){
    let data=await arcade.updateOne({game:"pacman"},{$inc:{timesPlayed:1}})
    console.log(data)
    next();
},function(req,res){
    res.render("pacman");
})


app.get("*",(req,res)=>{
    res.send("Page Not Found")
})

app.listen(3000,function(){
    console.log("Listening on port 3000")
})  