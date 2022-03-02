import type { RequestHandler } from "@sveltejs/kit";

export const redirect = (url, status = 302, headers: Record<string, unknown> = {}): ReturnType<RequestHandler> => ({
	status: status,
	headers: {
		location: url,
		...headers
	}
})