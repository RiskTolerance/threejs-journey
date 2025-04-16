export interface ThreeState {
	loaded: boolean;
	container: HTMLDivElement | undefined;
	height: number | undefined;
	width: number | undefined;
}

export const tState: ThreeState = $state({
	loaded: false,
	container: undefined,
	height: undefined,
	width: undefined
});
