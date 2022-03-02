/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_SPOTIFY_SECRET: string;
	readonly VITE_SPOTIFY_ID: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
