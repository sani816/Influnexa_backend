import Creator from "../models/Creator.js";
import { io } from "../server.js";
// import Notification from "../models/Notification.js";

// =====================
// CREATE CREATOR
// =====================
export const createInfluencer = async (req, res) => {
  try {
    const {
      instagramUsername,
      fullName,
      email,
      mobileNumber,
      gender,
      city,
      state,
      pincode,
    } = req.body;

    // VALIDATION
    if (
      !instagramUsername ||
      !fullName ||
      !email ||
      !mobileNumber ||
      !gender ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (req.body.preferredCategory) {
  req.body.preferredCategory = JSON.parse(
    req.body.preferredCategory
  );
}
if (req.body.campaignTypes) {
  req.body.campaignTypes = JSON.parse(
    req.body.campaignTypes
  );
}
    const creator = await Creator.create({
      ...req.body,
      image: req.file ? req.file.filename : "",
    });

    // 🔥 LIVE UPDATE
   io.emit("new-creator", creator);
io.emit("notification", {
  message: "New Influencer Registered",
  type: "creator",
});

    return res.status(201).json({
      success: true,
      message: "Creator Registered Successfully",
      creator,
    });

  } catch (error) {
    console.error("CREATE CREATOR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// GET ALL CREATORS
// =====================
export const getAllCreators = async (req, res) => {
  try {
    const creators = await Creator.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      creators,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// DELETE CREATOR
// =====================
export const deleteCreator = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Creator.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    // optional live update
    io.emit("delete-creator", id);

    return res.status(200).json({
      success: true,
      message: "Creator deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================
// UPDATE CREATOR
// =====================
export const updateCreator = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCreator = await Creator.findByIdAndUpdate(
      id,
      {
        ...req.body,
        image: req.file ? req.file.filename : req.body.image,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCreator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    // 🔥 LIVE UPDATE
   io.emit("update-creator", updatedCreator);

io.emit("notification", {
  message: "Influencer Profile Updated",
  type: "creator",
});

    return res.status(200).json({
      success: true,
      message: "Creator updated successfully",
      creator: updatedCreator,
    });

  } catch (error) {
    console.error("UPDATE CREATOR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};