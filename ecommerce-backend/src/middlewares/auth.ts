import { TryCatch } from "./error.js";
import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/user.js";


// middleware tomake sure only admin is allowed
export const adminOnly = TryCatch( async (req, res, next)=> {

    const { id } = req.query;

    if(!id){
        return next(new ErrorHandler("Login Required", 401));
    }

    const user = await User.findById(id);
    
    if(!user){
        return next(new ErrorHandler("User not exist.", 401));
    }

    if(user.role !== "admin"){
        return next(new ErrorHandler("Admin access only", 401));
    }

    next();
});
