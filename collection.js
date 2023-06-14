const mongoose=require("mongoose")
const uri="mongodb+srv://admin-pranav:TestPassword@cluster0.y912n0q.mongodb.net/Arcade"
mongoose.connect(uri);
const consoleSchema=new mongoose.Schema({
    game:String,
    highScore: Number,
    timesPlayed: Number
})
let model=mongoose.model("consoles",consoleSchema)

module.exports=model