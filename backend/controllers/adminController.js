import Brand from "../models/Brand.js";
import Creator from "../models/Creator.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalBrands = await Brand.countDocuments();

    const totalCreators = await Creator.countDocuments();

    res.status(200).json({
      success: true,
      totalBrands,
      totalCreators,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};