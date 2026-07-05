const Razorpay = require("razorpay");

if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
	console.warn("⚠️ WARNING: Razorpay API keys (RAZORPAY_KEY, RAZORPAY_SECRET) are missing in environment variables!");
}

exports.instance = new Razorpay({
	key_id: process.env.RAZORPAY_KEY || "PLACEHOLDER_KEY",
	key_secret: process.env.RAZORPAY_SECRET || "PLACEHOLDER_SECRET",
});
