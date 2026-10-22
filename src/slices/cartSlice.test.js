import cartReducer, { addToCart, removeFromCart, resetCart } from "./cartSlice"

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe("cartSlice reducer", () => {
  const initialTestState = {
    cart: [],
    total: 0,
    totalItems: 0,
  }

  beforeEach(() => {
    localStorage.clear()
  })

  test("should handle initial state", () => {
    expect(cartReducer(undefined, { type: "unknown" })).toEqual({
      cart: [],
      total: 0,
      totalItems: 0,
    })
  })

  test("should add a course to cart", () => {
    const course = { _id: "course-1", courseName: "React Basics", price: 500 }
    const actual = cartReducer(initialTestState, addToCart(course))

    expect(actual.cart.length).toBe(1)
    expect(actual.totalItems).toBe(1)
    expect(actual.total).toBe(500)
    expect(actual.cart[0]._id).toBe("course-1")
  })

  test("should not add duplicate course to cart", () => {
    const course = { _id: "course-1", courseName: "React Basics", price: 500 }
    const stateWithItem = {
      cart: [course],
      total: 500,
      totalItems: 1,
    }

    const actual = cartReducer(stateWithItem, addToCart(course))
    expect(actual.cart.length).toBe(1)
    expect(actual.totalItems).toBe(1)
    expect(actual.total).toBe(500)
  })

  test("should remove course from cart", () => {
    const course1 = { _id: "course-1", price: 500 }
    const course2 = { _id: "course-2", price: 300 }
    const stateWithItems = {
      cart: [course1, course2],
      total: 800,
      totalItems: 2,
    }

    const actual = cartReducer(stateWithItems, removeFromCart("course-1"))
    expect(actual.cart.length).toBe(1)
    expect(actual.cart[0]._id).toBe("course-2")
    expect(actual.totalItems).toBe(1)
    expect(actual.total).toBe(300)
  })

  test("should reset cart completely", () => {
    const course = { _id: "course-1", price: 500 }
    const stateWithItem = {
      cart: [course],
      total: 500,
      totalItems: 1,
    }

    const actual = cartReducer(stateWithItem, resetCart())
    expect(actual.cart).toEqual([])
    expect(actual.total).toBe(0)
    expect(actual.totalItems).toBe(0)
  })
})
