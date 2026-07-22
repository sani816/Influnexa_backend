import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "InfluNexa/Blogs",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadBlog = multer({
  storage,
});

export default uploadBlog;