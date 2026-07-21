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
  instagramLink,
  followersRange,
  fullName,
  email,
  mobileNumber,
  whatsappNumber,
  gender,
  dob,
  preferredCategory,
  campaignTypes,
  reelRate,
  storyRate,
  postRate,
  ytVideoRate,
ytShortsRate,
  hasYoutube,
  youtubeName,
  youtubeLink,
  youtubeSubs,

  address1,
  address2,
  city,
  state,
  pincode,

  canReceiveProducts,
  addressType,

  brandNames,

  consent1,
  consent2,
  consent3,
    } = req.body;

    // VALIDATION
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;
const pincodeRegex = /^[1-9][0-9]{5}$/;
const urlRegex = /^(https?:\/\/)?(www\.)?(instagram\.com|youtube\.com|youtu\.be)/i;

// Instagram Username
if (!instagramUsername?.trim()) {
  return res.status(400).json({
    success: false,
    message: "Instagram username is required",
  });
}

// Instagram Link
if (!req.body.instagramLink?.trim()) {
  return res.status(400).json({
    success: false,
    message: "Instagram profile link is required",
  });
}

// Full Name
if (!fullName?.trim()) {
  return res.status(400).json({
    success: false,
    message: "Full name is required",
  });
}

// Email
if (!email?.trim()) {
  return res.status(400).json({
    success: false,
    message: "Email is required",
  });
}

if (!emailRegex.test(email)) {
  return res.status(400).json({
    success: false,
    message: "Please enter a valid email",
  });
}

// Mobile Number
if (!mobileNumber?.trim()) {
  return res.status(400).json({
    success: false,
    message: "Mobile number is required",
  });
}

if (!phoneRegex.test(mobileNumber)) {
  return res.status(400).json({
    success: false,
    message: "Please enter a valid mobile number",
  });
}

// WhatsApp Number
if (
  req.body.whatsappNumber &&
  !phoneRegex.test(req.body.whatsappNumber)
) {
  return res.status(400).json({
    success: false,
    message: "Please enter a valid WhatsApp number",
  });
}

// Gender
if (!gender) {
  return res.status(400).json({
    success: false,
    message: "Gender is required",
  });
}

// DOB
if (!req.body.dob) {
  return res.status(400).json({
    success: false,
    message: "Date of birth is required",
  });
}

// Followers
if (!req.body.followersRange) {
  return res.status(400).json({
    success: false,
    message: "Followers range is required",
  });
}

// Preferred Category
if (
  !req.body.preferredCategory ||
  req.body.preferredCategory.length === 0
) {
  return res.status(400).json({
    success: false,
    message: "Please select at least one category",
  });
}

// Campaign Types
if (
  !req.body.campaignTypes ||
  req.body.campaignTypes.length === 0
) {
  return res.status(400).json({
    success: false,
    message: "Please select at least one campaign type",
  });
}

// Rates
if (!req.body.reelRate) {
  return res.status(400).json({
    success: false,
    message: "Reel rate is required",
  });
}

if (!req.body.storyRate) {
  return res.status(400).json({
    success: false,
    message: "Story rate is required",
  });
}

// City
if (!city?.trim()) {
  return res.status(400).json({
    success: false,
    message: "City is required",
  });
}

// State
if (!state?.trim()) {
  return res.status(400).json({
    success: false,
    message: "State is required",
  });
}

// Pincode
if (!pincodeRegex.test(pincode)) {
  return res.status(400).json({
    success: false,
    message: "Please enter a valid pincode",
  });
}

// Address Type
if (!req.body.addressType) {
  return res.status(400).json({
    success: false,
    message: "Please select address type",
  });
}

// Can Receive Products
if (!req.body.canReceiveProducts) {
  return res.status(400).json({
    success: false,
    message: "Please select whether you can receive products",
  });
}

// Image
if (!req.file) {
  return res.status(400).json({
    success: false,
    message: "Please upload a profile image",
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
//    io.emit("new-creator", creator);
// io.emit("notification", {
//   message: "New Influencer Registered",
//   type: "creator",
// });

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
// ⭐ GET FEATURED CREATORS
// MOST FOLLOWERS + HIGHEST RATING
// =====================
export const getFeaturedCreators = async (req, res) => {
  try {
    const creators = await Creator.find()
      .sort({
        followersRange: -1,
        youtubeSubs: -1,
      })
      .limit(6);

    res.status(200).json({
      success: true,
      creators,
    });
  } catch (error) {
    res.status(500).json({
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

// io.emit("notification", {
//   message: "Influencer Profile Updated",
//   type: "creator",
// });

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