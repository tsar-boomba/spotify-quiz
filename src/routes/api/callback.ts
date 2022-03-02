import { variables } from '$lib/env';
import { queryParser } from '$lib/parsers';
import { redirect } from '$lib/redirection';
import { getToken, updateTokens } from '$lib/spotify';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ request: { url } }) => {
	const { code, state } = queryParser(url);

	if (!code || !state || state !== variables.spotifyState) return redirect('/auth');

	const tokens = await getToken(code);

	if (!tokens) return redirect('/auth');

	return {
		status: 302,
		headers: {
			location: '/',
			'set-cookie': updateTokens(tokens),
		},
	};
};
