const Category = require("../models/Category")

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" })
    }
    const CategorysDetails = await Category.create({
      name: name,
      description: description,
    })
    console.log(CategorysDetails)
    return res.status(200).json({
      success: true,
      message: "Categorys Created Successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    })
  }
}

exports.showAllCategories = async (req, res) => {
  try {
    let allCategories = await Category.find().lean()

    if (!allCategories || allCategories.length === 0) {
      const defaultCategories = [
        { name: "Python", description: "Python programming courses" },
        {
          name: "Web Development",
          description: "Frontend and backend web development courses",
        },
        {
          name: "JavaScript",
          description: "Modern JavaScript and React development courses",
        },
        {
          name: "Data Science",
          description: "Data analysis and machine learning courses",
        },
        {
          name: "Mobile Development",
          description: "Android and iOS app development courses",
        },
      ]

      allCategories = await Category.create(defaultCategories)
    }

    res.status(200).json({
      success: true,
      data: allCategories,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "categoryId is required",
      })
    }

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .lean()
      .exec()

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    }).lean()
    let differentCategory = null
    if (categoriesExceptSelected.length > 0) {
      const randomCategory =
        categoriesExceptSelected[
          getRandomInt(categoriesExceptSelected.length)
        ]
      differentCategory = await Category.findById(randomCategory._id)
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .lean()
        .exec()
    }

    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .lean()
      .exec()
    const allCourses = allCategories.flatMap((category) => category.courses || [])
    const mostSellingCourses = allCourses
      .slice()
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 10)

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
