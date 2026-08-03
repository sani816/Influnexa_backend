import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

console.log("✅ Cloudinary uploadPayment middleware loaded");
const storage = new CloudinaryStorage({

  cloudinary,

  params: {

    folder: "payments",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp"
    ],

    transformation: [
      {
        width: 1000,
        height: 1000,
        crop: "limit"
      }
    ]

  }

});


const fileFilter = (req,file,cb)=>{

  const allowedTypes=[
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"
  ];


  if(allowedTypes.includes(file.mimetype)){
    cb(null,true);
  }
  else{
    cb(new Error("Only PNG, JPG, JPEG and WEBP images are allowed."));
  }

};



const uploadPayment = multer({

  storage,

  fileFilter,

  limits:{
    fileSize:5*1024*1024
  }

});


export default uploadPayment;