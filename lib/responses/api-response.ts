import { NextResponse } from "next/server";

export const apiResponse = (payload: any, status: number) => {
	return NextResponse.json(payload, { status });
};

export const apiError = (message: string, status: number) => {
	return NextResponse.json({ error: message }, { status });
};
