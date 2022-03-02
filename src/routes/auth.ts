import { cookieParser } from '$lib/parsers';
import { redirect } from '$lib/redirection';
import { code, refresh, updateTokens } from '$lib/spotify';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ request: { headers } }) => {
	const { access_token, refresh_token } = cookieParser(headers.get('cookie'));

	if (!refresh_token)
		return {
			status: 302,
			headers: {
				location: code(),
				'Access-Control-Allow-Origin': 'accounts.spotify.com',
			},
		};

	if (!access_token && refresh_token) {
		const { access_token: newToken } = await refresh(refresh_token);

		if (!newToken) return redirect('/auth');

		return {
			status: 302,
			headers: {
				location: '/',
				'set-cookie': updateTokens({ refresh_token, access_token: newToken }),
			},
		};
	}

	return redirect('/');
};
