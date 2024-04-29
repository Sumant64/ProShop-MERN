import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.set("strictQuery", false);
    
    mongoose.connect('mongodb://127.0.0.1:27017/pro-shop').then(() => {
        console.log('connection successfull to db')
    }).catch((err) => {
        console.log(err);
    })   
}

export default connectDB;