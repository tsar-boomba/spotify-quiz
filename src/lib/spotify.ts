import { variables } from './env';

interface TokenRes {
	access_token: string;
	token_type: string;
	scope: string;
	expires_in: number;
	refresh_token: string;
}

export interface Tokens {
	access_token: string;
	refresh_token: string;
}

enum Scopes {
	READ_PRIVATE = 'user-read-private',
	MODIFY_FOLLOW = 'user-follow-modify',
	READ_FOLLOW = 'user-follow-read',
	MODIFY_LIBRARY = 'user-library-modify',
	READ_LIBRARY = 'user-library-read',
	STREAMING = 'streaming',
	READ_PLAYBACK_POSITION = 'user-read-playback-position',
	MODIFY_PLAYLIST_PRIVATE = 'playlist-modify-private',
	READ_COLLABORATIVE_PLAYLIST = 'playlist-read-collaborative',
	APP_REMOTE_CONTROL = 'app-remote-control',
	READ_EMAIL = 'user-read-email',
	READ_PLAYLIST_PRIVATE = 'playlist-read-private',
	READ_TOP = 'user-top-read',
	MODIFY_PLAYLIST_PUBLIC = 'playlist-modify-public',
	READ_CURRENTLY_PLAYING = 'user-read-currently-playing',
	READ_USER_RECENTLY_PLAYED = 'user-read-recently-played',
	IMAGE_UPLOAD = 'ugc-image-upload',
	READ_PLAYBACK_STATE = 'user-read-playback-state',
	MODIFY_PLAYBACK_STATE = 'user-modify-playback-state',
}

const useScopes = (...scopes: Scopes[]) => scopes.join(',');

const { spotifyId, spotifySecret, spotifyState, spotifyRedirectUri } = variables;
const scopes = useScopes(
	Scopes.READ_EMAIL,
	Scopes.READ_PRIVATE,
	Scopes.READ_PLAYLIST_PRIVATE,
	Scopes.READ_USER_RECENTLY_PLAYED,
);

const authHeader = `Basic ${Buffer.from(`${spotifyId}:${spotifySecret}`).toString('base64')}`;

const formEncode = (obj: Record<string, any>) => {
	const body = [];
	for (const key in obj) {
		const encKey = encodeURIComponent(key);
		const encVal = encodeURIComponent(obj[key]);
		body.push(`${encKey}=${encVal}`);
	}
	return body.join('&');
};

export const code = () => {
	return `https://accounts.spotify.com/authorize?response_type=code&client_id=${spotifyId}&state=${spotifyState}&scope=${scopes}&redirect_uri=${spotifyRedirectUri}&show_dialog=true`;
};

export const getToken = async (code: string) => {
	const headers = new Headers();
	headers.append('Authorization', authHeader);
	headers.append('Accept', 'application/json');
	headers.append('Content-Type', 'application/x-www-form-urlencoded');

	const tokenRes = await fetch(`https://accounts.spotify.com/api/token`, {
		method: 'POST',
		body: formEncode({ code, redirect_uri: spotifyRedirectUri, grant_type: 'authorization_code' }),
		headers,
	});

	if (!tokenRes.ok) {
		console.error(JSON.stringify(await tokenRes.json()));
		return undefined;
	}

	const tokens: TokenRes = await tokenRes.json();

	return tokens;
};

export const refresh = async (refresh_token: string) => {
	const headers = new Headers();
	headers.append('Authorization', authHeader);
	headers.append('Accept', 'application/json');
	headers.append('Content-Type', 'application/x-www-form-urlencoded');

	const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		body: formEncode({ grant_type: 'refresh_token', refresh_token }),
		headers,
	});

	if (!tokenRes.ok) {
		console.error(JSON.stringify(await tokenRes.json()));
		return undefined;
	}

	const tokens: Omit<TokenRes, 'refresh_token'> = await tokenRes.json();

	return tokens;
};

export const updateTokens = ({ refresh_token, access_token }: Tokens) => [
	`refresh_token=${refresh_token}; Secure; Path=/; SameSite=strict; Expires=${new Date(
		Date.now() + 1000 * 60 * 60 * 24 * 365, // 1 year
	).toUTCString()}`,
	`access_token=${access_token}; Secure; Path=/; HttpOnly; SameSite=strict; Expires=${new Date(
		Date.now() + (1000 * 60 * 60 - 1000), // 1 second less than an hour
	).toUTCString()};`,
];

export const spotifyRequest = async <T = any>(
	url: string,
	{ access_token, refresh_token }: Tokens,
	init?: RequestInit,
): Promise<{
	data?: T;
	error?: unknown;
	updatedTokens?: string[];
}> => {
	let newAccessToken = access_token;
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${access_token}`);

	let res = await fetch(`https://api.spotify.com/v1/${url[0] === '/' ? url.slice(1) : url}`, {
		...init,
		headers,
	});

	let json: any = await res.json();

	if (json.error?.status === 401) {
		const { access_token: generatedAccessToken } = await refresh(refresh_token);
		headers.set('Authorization', `Bearer ${generatedAccessToken}`);

		res = await fetch(`https://api.spotify.com/v1/${url[0] === '/' ? url.slice(1) : url}`, {
			...init,
			headers,
		});

		json = await res.json();

		if (json.error?.status !== 401) {
			newAccessToken = generatedAccessToken;
		}
	}

	return {
		data: res.ok ? json : undefined,
		error: res.ok ? undefined : json,
		updatedTokens: updateTokens({ refresh_token, access_token: newAccessToken }),
	};
};
