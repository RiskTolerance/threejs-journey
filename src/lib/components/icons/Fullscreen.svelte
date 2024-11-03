<script lang="ts">
	interface Props {
		width: number;
		height: number;
		stroke: string;
	}
	let { width, height, stroke }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{width}
	{height}
	viewBox="0 0 24 24"
	fill="none"
	{stroke}
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	class="stroke-slate-400 transition-transform duration-100 hover:scale-110 hover:stroke-white"
	><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path
		d="M3 16v3a2 2 0 0 0 2 2h3"
	/><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg
>
