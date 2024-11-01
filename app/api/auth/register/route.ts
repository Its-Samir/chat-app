import { db } from "@/lib/db";
import { apiError, apiResponse } from "@/lib/responses/api-response";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
	try {
		const { password, username } = await req.json();

		if (!(password || username)) {
			return apiError("Required fields are missing", 400);
		}

		const user = await db.user.findUnique({ where: { username } });

		if (user) {
			return apiError("User already exists", 409);
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		await db.user.create({
			data: {
				username,
				password: hashedPassword,
				avatar:
					"https://images.freeimages.com/images/large-previews/7e8/man-avatar-1632965.jpg",
			},
		});

		return apiResponse({ message: "User created successfully" }, 201);

	} catch (error: any) {
		return apiError(error.message || "Something went wrong", 500);
	}
}
