import Brand from "../models/Brand.js";
import { io } from "../server.js";
// import Notification from "../models/Notification.js";


// CREATE BRAND (LIVE)
export const createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);

    // 🔥 REAL-TIME EMIT
    io.emit("new-brand", brand);

io.emit("notification", {
  message: "New Brand Registration",
  type: "brand",
});

    return res.status(201).json({
      success: true,
      message: "Brand Registered Successfully",
      brand,
    });

  } catch (error) {
    console.log("CREATE BRAND ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// save brand


// GET ALL BRANDS
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      brands,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE BRAND (LIVE)
export const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

   io.emit("update-brand", brand);

io.emit("notification", {
  message: "Brand Profile Updated",
  type: "brand",
});

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      brand,
    });

  } catch (error) {
    console.log("UPDATE BRAND ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};