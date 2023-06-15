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
    let data=await model.find({game:"galaxy"});
    console.log(data)

    // if(data[0].highScore<100){
    //     await model.updateOne({game:"galaxy"},{$set:{highScore:125}})
    // }
    // console.log(data[0].highScore)
    mongoose.connection.close();
}
connect();