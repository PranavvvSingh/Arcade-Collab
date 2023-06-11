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

app.get("/",function(req,res){
    
  console.log("hi");  
    res.render("signup")
})
app.post("/",async function(req,res){
    const userEmail=req.body.email
    const userName=req.body.name
    let data=new user({name:userName,email:userEmail})
    let result=await data.save()
    console.log(result)
    // res.sendFile(__dirname+ '/public-flappy/index.html')
    // console.log(req.body);
    // res.redirect("/"+gameName);
    // res.sendFile(__dirname+" public-"+req.body.gameName+"\index.html");
})
module.exports=app