import Rating from "../models/Rating.js";

export const createRating = async (
  req,
  res
) => {
  try {
    const rating = await Rating.create(
      req.body
    );

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRatings = async (
  req,
  res
) => {
  try {
    const ratings = await Rating.find();

    res.json(ratings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAverageRating = async (
  req,
  res
) => {
  try {
    const ratings = await Rating.find();

    const average =
      ratings.reduce(
        (sum, item) => sum + item.rating,
        0
      ) / (ratings.length || 1);

    res.json({
      totalRatings: ratings.length,
      averageRating:
        average.toFixed(1),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};