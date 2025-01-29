// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		declare module '*.hdr' {
			const value: string;
			export default value;
		}
		declare module '*.json' {
			import { FontData } from 'three/examples/jsm/Addons.js';
			const value: FontData;
			export default value;
		}
	}
}

export {};
