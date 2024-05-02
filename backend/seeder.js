import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Order from './models/orderModel.js';
import Product from './models/productModel.js';
import User from './models/userModel.js';
import users from './data/users.js';
import products from './data/products.js';


dotenv.config();
connectDB();


const importData = async () => {
    try{
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return {...product, user: adminUser};
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();

    } catch (error) {
        console.log(`${error}`.trimEnd.inverse);
        process.exit(1);
    }
}

const destroyData = async () => {
    try{
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);

    }
}

console.log(process.argv)
if(process.argv[2] === '-i'){
    importData();
} else if(process.argv[2] === '-d') {
    destroyData();
}