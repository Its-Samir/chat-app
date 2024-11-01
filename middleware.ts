import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
	const { nextUrl, auth } = req;

	const isLoggedIn = !!auth;

	const isAuthRoutes = ["/login", "/register"].includes(nextUrl.pathname);
	const isProtectedRoutes = ["/"].includes(nextUrl.pathname);

	if (!isLoggedIn && isProtectedRoutes) {
		return NextResponse.redirect(new URL("/login", nextUrl));
	}

	if (isLoggedIn && isAuthRoutes) {
		return NextResponse.redirect(new URL("/", nextUrl));
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
