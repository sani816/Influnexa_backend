export const getFeaturedCreators = async (req, res) => {
  try {
    const creators = await Creator.find();

    const followerOrder = {
      "Under 2K": 1,
      "2K - 10K": 2,
      "10K - 50K": 3,
      "50K - 100K": 4,
      "100K - 500K": 5,
      "500K - 1M": 6,
      "1M - 5M": 7,
      "5M+": 8,
    };

    const featuredCreators = creators
      .filter((creator) => creator.followersRange)
      .sort(
        (a, b) =>
          (followerOrder[b.followersRange] || 0) -
          (followerOrder[a.followersRange] || 0)
      )
      .slice(0, 6);

    return res.status(200).json({
      success: true,
      creators: featuredCreators,
    });
  } catch (error) {
    console.error("FEATURED CREATOR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};