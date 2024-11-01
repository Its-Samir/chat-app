"use client";

import { APP_URL } from "@/lib/utils";
import axios, { isAxiosError } from "axios";
import { createFormValidator, makeFormSchema } from "formaze";
import "formaze/dist/style.css";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { z } from "zod";

const schema = makeFormSchema({
	username: {
		type: "string",
		minLength: { value: 3, message: "Must be 3 character long" },
	},
	password: { type: "password" },
});

const Form = createFormValidator(schema);

export default function Login() {
	async function handleSubmit(data: z.infer<typeof schema>) {
		try {
			const result = schema.safeParse(data);

			if (!result.success) return;

			const res = await axios.post(`${APP_URL}/api/auth/login`, result.data);

			if (res.status !== 200) {
				toast.error(res.statusText);
				return;
			}

			toast.success(res.data.message);

			signIn("credentials", {
				username: result.data.username,
				password: result.data.password,
				redirectTo: "/",
			});
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(error.response?.data.error);
			}
		}
	}

	return (
		<div className="h-screen w-screen p-4 flex justify-center items-center">
			<div className="max-w-full w-[40rem]">
				<h1 className="text-3xl text-neutral-700 font-bold ml-4">Login</h1>
				<Form onSubmit={handleSubmit} className="mx-auto w-full">
					<Form.Input
						label="Username"
						name="username"
						placeholder="Enter username"
					/>
					<Form.Input
						label="Password"
						name="password"
						placeholder="Enter password"
						type="password"
					/>
					<button type="submit" className="text-white rounded-md p-2">
						Login
					</button>
				</Form>
			</div>
		</div>
	);
}
