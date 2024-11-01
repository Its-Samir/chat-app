import { NextAuthConfig } from "next-auth";
import Credentials from "@auth/core/providers/credentials";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
	providers: [
		Credentials({
			async authorize(
				credentials: Partial<{ username: string; password: string }>
			) {
				if (!credentials.username || !credentials.password) {
					return null;
				}

				const user = await db.user.findUnique({
					where: { username: credentials.username },
					select: { id: true, password: true },
				});

				if (!user) {
					return null;
				}

				const isCorrectPassword = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!isCorrectPassword) {
					return null;
				}

				return user;
			},
		}),
	],
};
