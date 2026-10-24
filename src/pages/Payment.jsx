import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { FaCreditCard, FaWallet, FaLock } from "react-icons/fa"

import ConfirmationModal from "../components/Common/ConfirmationModal"
import Footer from "../components/Common/Footer"
import { BuyCourse } from "../services/operations/studentFeaturesAPI"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"

export default function Payment() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const courseIdsParam = searchParams.get("courseIds") || ""
  const courseIds = courseIdsParam ? courseIdsParam.split(",").filter(Boolean) : []
  const courseId = courseIds[0]

  const [response, setResponse] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [saveCard, setSaveCard] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Course Details")
      }
    })()
  }, [courseId])

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    if (!matches) return v
    const parts = matches[0].match(/\d{1,4}/g)
    return parts ? parts.join(" ") : v
  }

  const handleBuyCourse = () => {
    if (!cardNumber.replace(/\s/g, "").match(/^\d{13,16}$/)) {
      setConfirmationModal({
        text1: "Invalid Card Number",
        text2: "Please enter a valid card number.",
        btn1Text: "OK",
        btn1Handler: () => setConfirmationModal(null),
      })
      return
    }
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
      setConfirmationModal({
        text1: "Invalid Expiry Date",
        text2: "Please use MM/YY format.",
        btn1Text: "OK",
        btn1Handler: () => setConfirmationModal(null),
      })
      return
    }
    if (!cvv.match(/^\d{3,4}$/)) {
      setConfirmationModal({
        text1: "Invalid CVV",
        text2: "Please enter a valid CVV.",
        btn1Text: "OK",
        btn1Handler: () => setConfirmationModal(null),
      })
      return
    }
    if (token) {
      BuyCourse(token, courseIds, user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!response.success) {
    return <div className="min-h-screen flex items-center justify-center">Course not found</div>
  }

  const { courseName, thumbnail, price } = response.data?.courseDetails

  return (
    <>
      <div className="relative w-full bg-richblack-800 min-h-screen">
        <div className="mx-auto box-content px-4 py-8 lg:w-[1260px]">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Course Summary */}
            <div className="flex-1 lg:w-1/2">
              <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-6 shadow-[0_4px_20px_0_rgba(0,0,0,0.3)]">
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={thumbnail}
                    alt={courseName}
                    className="w-24 h-24 rounded-lg object-cover shadow-[0_2px_10px_0_rgba(0,0,0,0.4)]"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-richblack-5 leading-tight">
                      {courseName}
                    </h2>
                    <p className="mt-1 text-sm text-richblack-300">
                      Secure payment via Razorpay
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="mb-2 text-sm font-medium text-richblack-300 uppercase tracking-wider">
                    Price Summary
                  </p>
                  <div className="flex justify-between text-xl font-bold text-richblack-5">
                    <span>Course Fee</span>
                    <span>₹{price}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Payment Form */}
            <div className="flex-1 lg:w-1/2">
              <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-6 shadow-[0_4px_20px_0_rgba(0,0,0,0.3)]">
                <h3 className="mb-6 text-xl font-bold text-richblack-5">Payment Options</h3>

                {/* Method Tabs */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                      paymentMethod === "card"
                        ? "bg-richblack-700 border border-richblack-500 text-richblack-5 shadow-[0_2px_6px_0_rgba(0,0,0,0.3)]"
                        : "border border-transparent text-richblack-400 hover:text-richblack-200"
                    }`}
                  >
                    <FaCreditCard className="mr-2" /> Cards
                  </button>
                  <button
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                      paymentMethod === "netbanking"
                        ? "bg-richblack-700 border border-richblack-500 text-richblack-5 shadow-[0_2px_6px_0_rgba(0,0,0,0.3)]"
                        : "border border-transparent text-richblack-400 hover:text-richblack-200"
                    }`}
                  >
                    Netbanking
                  </button>
                  <button
                    onClick={() => setPaymentMethod("wallet")}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                      paymentMethod === "wallet"
                        ? "bg-richblack-700 border border-richblack-500 text-richblack-5 shadow-[0_2px_6px_0_rgba(0,0,0,0.3)]"
                        : "border border-transparent text-richblack-400 hover:text-richblack-200"
                    }`}
                  >
                    <FaWallet className="mr-2" /> Wallet
                  </button>
                </div>

                {/* Card Form */}
                {paymentMethod === "card" && (
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-richblack-300">
                        Card Number
                      </label>
                      <input
                        type="tel"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className="w-full px-4 py-3 rounded-lg border border-richblack-600 bg-richblack-900 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all shadow-[0_2px_4px_0_rgba(0,0,0,0.2)]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-richblack-300">
                          MM / YY
                        </label>
                        <input
                          type="tel"
                          value={expiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, "")
                            if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2, 4)
                            setExpiry(v)
                          }}
                          placeholder="MM/YY"
                          maxLength="5"
                          className="w-full px-4 py-3 rounded-lg border border-richblack-600 bg-richblack-900 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all shadow-[0_2px_4px_0_rgba(0,0,0,0.2)]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-richblack-300">
                          CVV
                        </label>
                        <input
                          type="tel"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="123"
                          maxLength="4"
                          className="w-full px-4 py-3 rounded-lg border border-richblack-600 bg-richblack-900 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all shadow-[0_2px_4px_0_rgba(0,0,0,0.2)]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={() => setSaveCard(!saveCard)}
                        className="w-4 h-4 text-yellow-500 border-richblack-600 bg-richblack-900 rounded focus:ring-yellow-500 focus:ring-1"
                      />
                      <label className="text-sm text-richblack-300 cursor-pointer select-none">
                        Save this card as per RBI guidelines
                      </label>
                    </div>
                  </div>
                )}

                {/* Netbanking */}
                {paymentMethod === "netbanking" && (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-richblack-400">
                      Select your bank to proceed with netbanking payment.
                    </p>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <button key={i} className="flex-1 p-3 rounded-lg border border-richblack-600 bg-richblack-900 text-richblack-300 text-sm font-medium hover:border-yellow-500 hover:text-richblack-5 transition-all shadow-[0_2px_4px_0_rgba(0,0,0,0.2)]">
                          Bank {i}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wallet */}
                {paymentMethod === "wallet" && (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-richblack-400">
                      Pay using your digital wallet balance.
                    </p>
                    <div className="flex gap-3">
                      {["PhonePe", "Google Pay", "Paytm"].map((wallet) => (
                        <button key={wallet} className="flex-1 p-3 rounded-lg border border-richblack-600 bg-richblack-900 text-richblack-300 text-sm font-medium hover:border-yellow-500 hover:text-richblack-5 transition-all shadow-[0_2px_4px_0_rgba(0,0,0,0.2)]">
                          {wallet}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="mt-8 pt-6 border-t border-richblack-700">
                  <div className="flex justify-between mb-4">
                    <span className="text-lg font-medium text-richblack-300">Total Amount</span>
                    <span className="text-2xl font-bold text-richblack-5">₹{price}</span>
                  </div>

                  <button
                    onClick={handleBuyCourse}
                    disabled={paymentLoading}
                    className={`w-full py-4 rounded-lg font-bold text-richblack-800 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 ${
                      paymentLoading
                        ? "bg-richblack-600 text-richblack-300 cursor-not-allowed shadow-none"
                        : "bg-yellow-50 hover:bg-yellow-25 hover:shadow-none hover:scale-[1.02]"
                    }`}
                  >
                    {paymentLoading ? "Processing..." : "Pay Now"}
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-richblack-400">
                    <FaLock className="w-4 h-4" />
                    <span>Secured by Razorpay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
