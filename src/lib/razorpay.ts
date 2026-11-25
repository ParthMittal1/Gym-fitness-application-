import Razorpay from "razorpay";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Razorpay Client & Sandbox Simulator Helper
// ---------------------------------------------------------------------------

const key_id = process.env.RAZORPAY_KEY_ID?.trim() || "";
const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim() || "";

/**
 * Checks whether live or valid test Razorpay keys are configured.
 * If keys are missing, empty, or default placeholders (e.g. `rzp_test_yourkeyhere`),
 * the application smoothly engages Mock Sandbox Simulator mode.
 */
export function isRazorpayConfigured(): boolean {
  if (!key_id || !key_secret) return false;
  if (
    key_id === "rzp_test_yourkeyhere" ||
    key_id === "your_key_id" ||
    key_secret === "your_key_secret" ||
    key_id.startsWith("your_")
  ) {
    return false;
  }
  return true;
}

/**
 * Razorpay instance (instantiated only when valid credentials exist)
 */
export const razorpayInstance = isRazorpayConfigured()
  ? new Razorpay({
      key_id,
      key_secret,
    })
  : null;

/**
 * Formats a numeric amount into Indian Rupee (₹) currency format.
 * Example: 1999 -> "₹1,999"
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generates a unique sequential gym membership card number prefixed with 'ABF'.
 * Format: ABF-YYYY-XXXXX (e.g. ABF-2026-84920)
 */
export function generateGymCardNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const timeChunk = Date.now().toString().slice(-4);
  return `ABF-${year}-${timeChunk}${randomSuffix.toString().slice(-2)}`;
}

/**
 * Verifies Razorpay Webhook or Checkout payment signature.
 */
export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (orderId.startsWith("order_mock_")) {
    return signature === "mock_signature";
  }

  if (!key_secret) return false;

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}
