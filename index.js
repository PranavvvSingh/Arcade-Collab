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



app.get("/flappy",async function(req,res,next){
    let data=await arcade.updateOne({game:"flappy"},{$inc:{timesPlayed:1}}) 
    console.log(data)
    next();
}, function(req,res){
    res.render("flappy",{id:req.query.id});
})
app.post("/flappy",async function(req,res){
    // newScore= live score from game
    // highScore= user's highest score in users collection
    // bestScore= highest score in consoles collection
    let newScore=req.body.finalScore;
    let object=req.body.userId;

    let data=await arcade.find({game:"flappy"});
    let bestScore=data[0].highScore;

    data=await user.findById(object);
    let highScore=data.flappy;
    if(highScore==null || newScore>highScore){
        await user.findByIdAndUpdate(object,{$set:{flappy:newScore}})
        highScore=newScore
    }
    if(newScore>bestScore){
        await arcade.updateOne({game:"flappy"},{$set:{highScore:newScore}})
        bestScore=newScore
    }      
    res.render("gameover",{data:{newScore:newScore, bestScore:bestScore, highScore:highScore}})
})

app.get("/galaxy",async function(req,res,next){
    let data=await arcade.updateOne({game:"galaxy"},{$inc:{timesPlayed:1}})
    console.log(data)
    next();
},function(req,res){
    res.render("galaxy",{id:req.query.id});
})
app.post("/galaxy",async function(req,res){
    let newScore=req.body.finalScore;
    let object=req.body.userId;

    let data=await arcade.find({game:"galaxy"});
    let bestScore=data[0].highScore;

    data=await user.findById(object);
    let highScore=data.galaxy;
    if(highScore==null || newScore>highScore){
        await user.findByIdAndUpdate(object,{$set:{galaxy:newScore}})
        highScore=newScore
    }
    if(newScore>bestScore){
        await arcade.updateOne({game:"galaxy"},{$set:{highScore:newScore}})
        bestScore=newScore
    }      
    res.render("gameover",{data:{newScore:newScore, bestScore:bestScore, highScore:highScore}})
})

app.get("/pacman",async function(req,res,next){
    let data=await arcade.updateOne({game:"pacman"},{$inc:{timesPlayed:1}})
    console.log(data)
    next();
},function(req,res){
    res.render("pacman",{id:req.query.id});
})
app.post("/pacman",async function(req,res){
    let newScore=req.body.finalScore;
    let object=req.body.userId;

    let data=await arcade.find({game:"pacman"});
    let bestScore=data[0].highScore;

    data=await user.findById(object);
    let highScore=data.pacman;
    if(highScore==null || newScore>highScore){
        await user.findByIdAndUpdate(object,{$set:{pacman:newScore}})
        highScore=newScore
    }
    if(newScore>bestScore){
        await arcade.updateOne({game:"pacman"},{$set:{highScore:newScore}})
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