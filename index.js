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

app.get("/game/:game",async function(req,res,next){
    let data=await arcade.updateOne({game:req.params.game},{$inc:{timesPlayed:1}})
    console.log(data)
    next();
},function(req,res){
    res.render(req.params.game,{id:req.query.id});
})
app.post("/game/:game",async function(req,res){

    let gameName=req.params.game
    let newScore=req.body.finalScore;
    let object=req.body.userId;

    let data=await arcade.find({game:gameName});
    let bestScore=data[0].highScore;

    data=await user.findById(object);
    let highScore=data.gameName;
    if(highScore==null || newScore>highScore){
        await user.findByIdAndUpdate(object,{$set:{[gameName]:newScore}})
        highScore=newScore
    }
    if(newScore>bestScore){
        await arcade.updateOne({game:req.params.game},{$set:{highScore:newScore}})
        bestScore=newScore
    }      
    res.render("gameover",{data:{newScore:newScore, bestScore:bestScore, highScore:highScore}})
})


app.get("*",(req,res)=>{
    res.send("Page Not Found")
})

app.listen(3000,function(){
    console.log("Listening on port 3000")
})  