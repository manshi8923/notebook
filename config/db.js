const mongoose=require('mongoose');
const mongoURI="mongodb+srv://manshimalik456:g1bwsiGR4e0l3TqT@cluster0.ltbcdov.mongodb.net/notebook";
const connectDB=async()=>{
    try{
        await mongoose.connect(mongoURI);
        console.log(`Connected to mongodb database ${mongoose.connection.host}`);
    }
    catch(err){
        console.log(`Mongo connect error ${err}`)
    }
};
module.exports=connectDB;