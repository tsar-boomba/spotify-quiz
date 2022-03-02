import { cookieParser } from '$lib/parsers';
import { spotifyRequest } from '$lib/spotify';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ request: { headers } }) => {
	const { access_token, refresh_token } = cookieParser(headers.get('cookie'));

	const { data, updatedTokens } = await spotifyRequest('/me', { access_token, refresh_token });

	if (!data)
		return {
			status: 500,
		};

	return {
		status: 200,
		body: { me: data },
		headers: {
			'set-cookie': updatedTokens
		}
	};
};
