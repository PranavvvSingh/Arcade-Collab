const mongoose=require("mongoose")
const uri="mongodb+srv://admin-pranav:TestPassword@cluster0.y912n0q.mongodb.net/Arcade"
async function connect(){
    await mongoose.connect(uri);

    const consoleSchema=new mongoose.Schema({
        game:String,
        highScore: Number,
        timesPlayed: Number
    })

    let model=mongoose.model("consoles",consoleSchema)
    let data=await model.updateOne({game:"flappy"},{$inc:{timesPlayed:1}})
    console.log(data)
    mongoose.connection.close();
}
connect();