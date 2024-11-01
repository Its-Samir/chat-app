import { auth } from "@/auth";

export default async function Home() {
	const session = await auth();

	if (!session) {
		return <div>Login to continue</div>;
	}

	return <h1>Hello, {session.user.username}</h1>;
}
