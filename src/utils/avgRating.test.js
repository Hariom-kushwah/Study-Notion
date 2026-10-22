import GetAvgRating from "./avgRating"

describe("GetAvgRating Utility", () => {
  test("returns 0 for empty array or undefined", () => {
    expect(GetAvgRating([])).toBe(0)
    expect(GetAvgRating(null)).toBe(0)
    expect(GetAvgRating(undefined)).toBe(0)
  })

  test("calculates single rating correctly", () => {
    const ratings = [{ rating: 5 }]
    expect(GetAvgRating(ratings)).toBe(5)
  })

  test("calculates average and rounds to 1 decimal place", () => {
    const ratings = [{ rating: 4 }, { rating: 5 }, { rating: 4 }]
    // (4 + 5 + 4) / 3 = 13 / 3 = 4.333... -> 4.3
    expect(GetAvgRating(ratings)).toBe(4.3)
  })

  test("filters out invalid rating objects gracefully", () => {
    const ratings = [{ rating: 5 }, null, { notRating: 3 }, { rating: 3 }]
    // (5 + 3) / 2 = 4
    expect(GetAvgRating(ratings)).toBe(4)
  })
})
