import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "@/auth.config";

const authOptions = NextAuth({
	adapter: PrismaAdapter(db),
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async session({ session, token }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
				session.user.username = token.username;
				session.user.avatar = token.avatar;
			}

			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const user = await db.user.findUnique({ where: { id: token.sub } });

			if (!user) {
				return token;
			}

			token.username = user.username;
			token.avatar = user.avatar || "";

			return token;
		},
	},
	session: { strategy: "jwt" },
	trustHost: true,
	...authConfig,
});

export const {
	auth,
	handlers: { GET, POST },
	signIn,
	signOut,
} = authOptions;

export type ExtendedUser = DefaultSession["user"] & {
	username: string;
	avatar: string;
};

declare module "next-auth" {
	interface Session {
		user: ExtendedUser;
	}
}

declare module "@auth/core/jwt" {
	interface JWT {
		username: string;
		avatar: string;
	}
}
