const express=require("express")
const signup=require("./signup.js")
const app=express()
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.set("view engine","ejs")
app.use("/",express.static("public"))
app.use("/flappy",express.static("public-flappy"))
app.use("/galaxy",express.static("public-galaxy"))
app.use("/pacman",express.static("public-pacman"))

app.use("/signup",signup)
// do you want to serve signup page directly?

// app.use("/midflappy",express.static("public-signup"))
// app.use("/midgalaxy",express.static("public-signup"))
// app.use("/midpacman",express.static("public-signup"))

app.get("/",function(req,res){
    // res.sendFile(__dirname+"/public/index.html");
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

app.get("/flappy",function(req,res){
    // res.sendFile(__dirname+"/public-flappy/index.html");
    res.sendFile(index.html);
})
app.get("/galaxy",function(req,res){
    // res.sendFile(__dirname+"/public-galaxy/index.html");
    res.sendFile(index.html);
})
app.get("/pacman",function(req,res){
    // res.sendFile(__dirname+"/public-pacman/index.html");
    res.sendFile(index.html);
})


app.get("*",(req,res)=>{
    res.send("Page Not Found")
})

app.listen(3000,function(){
    console.log("Listening on port 3000")
})  