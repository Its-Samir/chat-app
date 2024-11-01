import { db } from "@/lib/db";
import { apiError, apiResponse } from "@/lib/responses/api-response";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
	let redirectUrl: string;

	const { password, username } = await req.json();
	try {
		``;
		if (!(password || username)) {
			return apiError("Missing required fields", 400);
		}

		const user = await db.user.findUnique({
			where: { username },
			select: { id: true, password: true },
		});

		if (!user) {
			return apiError("User doesn't exists", 404);
		}

		const isCorrectPassword = await bcrypt.compare(password, user.password);

		if (!isCorrectPassword) {
			return apiError("Invalid credentials", 403);
		}

		return apiResponse({ message: "Login successful" }, 200);
	} catch (error: any) {
		return apiError(error.message || "Something went wrong", 500);
	}

	try {
		redirectUrl = await signIn("credentials", {
			username,
			password,
			redirectTo: "/",
			redirect: false,
		});
	} catch (error) {
		return { error: "Failed to signed in, Try again later" };
	}
}
