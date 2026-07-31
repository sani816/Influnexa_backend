import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async(req,res)=>{

try{

const {name,email,password}=req.body;

if(!name || !email || !password){

return res.status(400).json({

success:false,

message:"All fields are required"

});

}

const existingUser=await User.findOne({

email:email.toLowerCase()

});

if(existingUser){

return res.status(400).json({

success:false,

message:"Email already exists"

});

}

const hashedPassword=await bcrypt.hash(password,10);

const user=await User.create({

name,

email:email.toLowerCase(),

password:hashedPassword

});

res.status(201).json({

success:true,

message:"Registration successful"

});

}
catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};

export const login=async(req,res)=>{

try{

const {email,password}=req.body;

const user=await User.findOne({

email:email.toLowerCase()

});

if(!user){

return res.status(400).json({

success:false,

message:"Invalid Email"

});

}

const isMatch=await bcrypt.compare(

password,

user.password

);

if(!isMatch){

return res.status(400).json({

success:false,

message:"Invalid Password"

});

}

const token=jwt.sign(

{

id:user._id

},

process.env.JWT_SECRET,

{

expiresIn:process.env.JWT_EXPIRE

}

);

res.json({

success:true,

token,

user:{

id:user._id,

name:user.name,

email:user.email

}

});

}
catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};