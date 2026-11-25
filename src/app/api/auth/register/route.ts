import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------
const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number")
    .optional()
    .or(z.literal("")),

  city: z.string().max(60).trim().optional().or(z.literal("")),
});

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // 1. Parse body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    // 2. Validate with Zod
    const result = RegisterSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field:   issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json(
        { success: false, message: "Validation failed.", errors },
        { status: 422 }
      );
    }

    const { name, email, password, phone, city } = result.data;

    // 3. Check email uniqueness
    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
          errors: [{ field: "email", message: "Email is already registered." }],
        },
        { status: 409 }
      );
    }

    // 4. Hash password (12 rounds — good balance of security vs. speed)
    const hashedPassword = await hash(password, 12);

    // 5. Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone:    phone || null,
        city:     city  || null,
        role:     "MEMBER",
      },
      select: {
        id:        true,
        name:      true,
        email:     true,
        phone:     true,
        city:      true,
        role:      true,
        createdAt: true,
      },
    });

    // 6. Return 201 Created (never return the hashed password)
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully! Please sign in.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Block all other HTTP methods
// ---------------------------------------------------------------------------
export async function GET() {
  return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
}
