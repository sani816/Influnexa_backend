import express from "express";

import {
  createBlog,
  getBlogs,
  getSingleBlog,
  deleteBlog,
} from "../controllers/blogController.js";

const router = express.Router();

router.post("/", createBlog);

router.get("/", getBlogs);

router.get("/:id", getSingleBlog);

router.delete("/:id", deleteBlog);

export default router;