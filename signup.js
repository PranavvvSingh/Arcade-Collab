const mongoose=require("mongoose");
const express=require("express")
const app=express()
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));
app.use(express.static("public-signup"));
app.set("view-engine","ejs")

const uri="mongodb+srv://admin-pranav:TestPassword@cluster0.y912n0q.mongodb.net/Arcade"
mongoose.connect(uri);
const userSchema=mongoose.Schema({
    name:String,
    email:String,
    flappy: Number,
    galaxy: Number,
    pacman: Number
})
let user=mongoose.model("users",userSchema)

// get method not required anymore since 
// signup.ejs is being rendered by index.js now
app.get("/",function(req,res){
    res.render("signup")
})

app.post("/",async function(req,res){
    const userEmail=req.body.email
    const userName=req.body.name
    const game=req.body.gameCalled
    let data=new user({name:userName,email:userEmail})
    let result=await data.save()
    console.log(result)
    console.log(game)
    res.redirect("/"+game)
})
module.exports=app