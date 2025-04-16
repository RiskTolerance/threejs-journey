import { tState } from '$lib/chapter_files/4.1/state.svelte';

export const fullscreen = () => {
	if (tState.container && !document.fullscreenElement) {
		tState.container.requestFullscreen().then(() => {
			tState.height = tState.container?.offsetHeight;
			tState.width = tState.container?.offsetWidth;
		});
	} else if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		console.log('No element!');
	}
};
