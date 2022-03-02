export const queryParser = (url: string) => {
	const query = url.split('?')[1];
	const obj: Record<string, string> = {};

	if (!query) return obj;

	const params = query.split('&');

	for (let i = 0; i < params.length; i++) {
		const pairs = params[i].split('=');
		const key = pairs[0];
		const value = decodeURIComponent(pairs[1]);

		if (!key) continue;
		if (key && !value) obj[key] = undefined;

		obj[key] = value;
	}

	return obj;
};

export const cookieParser = (cookies: string | undefined) => {
	const result: Record<string, string> = {};
	if (!cookies) return result;
	cookies.split(';').forEach((cookie) => {
		const separator = cookie.indexOf('=');
		const key = cookie.substring(0, separator).trim();
		const rawValue = cookie.substring(separator + 1);
		result[key] = rawValue;
	});
	return result;
};
