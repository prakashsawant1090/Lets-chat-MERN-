
const mongoose = require("mongoose");

const connectDB = async() =>{
    try{
    const connect = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    });
    console.log(`MongoDB Connected`);
    }catch (error) {
        console.log(`Error: ${error}`);
        process.exit();
    }
};
module.exports = connectDB;