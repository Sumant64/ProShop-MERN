import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';


//User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
    let token;

    //Read jwt from the 'jwt'cookie
    token = req.cookies.jwt;

    if(token) {
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userId).select('-password'); //it excludes password from the data

            //example query to exclude multiple fields
            // req.user = await User.findById(decoded.userId).select('-name -password');

            next();

        } catch (err) {
            console.log(err);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

//User must be an admin
const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

export {
    protect,
    admin
};