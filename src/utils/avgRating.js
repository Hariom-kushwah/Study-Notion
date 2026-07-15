export default function GetAvgRating(ratingArr) {
  if (!ratingArr || ratingArr.length === 0) return 0
  let totalReviewCount = 0
  let count = 0
  ratingArr.forEach((curr) => {
    if (curr && typeof curr === "object" && typeof curr.rating === "number") {
      totalReviewCount += curr.rating
      count++
    }
  })

  if (count === 0) return 0

  const multiplier = Math.pow(10, 1)
  const avgReviewCount =
    Math.round((totalReviewCount / count) * multiplier) / multiplier

  return avgReviewCount
}
