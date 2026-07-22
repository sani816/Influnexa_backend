import Blog from "../models/Blog.js";


export const createBlog = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "Blog image is required"
      });
    }

    const blog = await Blog.create({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      content: req.body.content,
      author: req.body.author,
      status: req.body.status,
      image: req.file.filename,
    });

    res.status(201).json(blog);

  } catch (err) {

    console.log("Create Blog Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    blog.title = req.body.title;
    blog.category = req.body.category;
    blog.description = req.body.description;
    blog.content = req.body.content;
    blog.author = req.body.author;
    blog.status = req.body.status;

    if (req.file) {
      blog.image = req.file.filename;
    }

    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      status: "Published",
    }).sort({
      createdAt: -1,
    });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({
      createdAt: -1,
    });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const getSingleBlog = async (
  req,
  res
) => {
  try {
    const blog = await Blog.findById(
      req.params.id
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteBlog = async (
  req,
  res
) => {
  try {
    const blog = await Blog.findById(
      req.params.id
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    await Blog.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Blog deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};