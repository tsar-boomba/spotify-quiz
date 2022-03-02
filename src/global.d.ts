/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SPOTIFY_SECRET: string;
	readonly VITE_SPOTIFY_ID: string;
	readonly VITE_SPOTIFY_STATE: string;
	readonly VITE_SPOTIFY_REDIRECT_URI: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
