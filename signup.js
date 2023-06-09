const mongoose=require("mongoose");
const express=require("express")
const app=express.Router()
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));
app.use(express.static("public-signup"));

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
    // res.sendFile(__dirname+"/public-signup/index.html")
    console.log("hi")
    res.sendFile(index.html)
})
app.post("/",async function(req,res){
    const userEmail=req.body.email
    const userName=req.body.name
    let data=new user({name:userName,email:userEmail})
    let result=await data.save()
    console.log(result)
    res.send("user added to db")
})
module.exports=app