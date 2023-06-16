const mongoose=require("mongoose")
const uri="mongodb+srv://admin-pranav:TestPassword@cluster0.y912n0q.mongodb.net/Arcade"
async function connect(){
    await mongoose.connect(uri);

    const consoleSchema=new mongoose.Schema({
        name:String,
        email: String,
        flappy: Number
    })

    let model=mongoose.model("users",consoleSchema)
    let data=await model.findByIdAndUpdate("648aff0c9d6380791bf928dd",{$set:{flappy:3}});
    console.log(String(data._id))

    // if(data[0].highScore<100){
    //     await model.updateOne({game:"galaxy"},{$set:{highScore:125}})
    // }
    // console.log(data[0].highScore)
    mongoose.connection.close();
}
connect();