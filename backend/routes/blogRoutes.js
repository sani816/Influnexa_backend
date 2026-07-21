import express from "express";
import upload from "../middleware/uploadBlog.js";

import {
  createBlog,
  getBlogs,
  getSingleBlog,
  deleteBlog,
  updateBlog,
  getAllBlogsAdmin,
} from "../controllers/blogController.js";

const router = express.Router();

router.get("/", getBlogs);

router.get("/admin", getAllBlogsAdmin);

router.get("/:id", getSingleBlog);

router.post("/", upload.single("image"), createBlog);

router.put("/:id", upload.single("image"), updateBlog);

router.delete("/:id", deleteBlog);

export default router;