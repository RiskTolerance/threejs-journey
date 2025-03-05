<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import Navigation from '$lib/components/Navigation.svelte';
	import { s } from '$lib/globalState.svelte';
</script>

<div class={s.darkMode ? 'dark' : ''}>
	<Navigation></Navigation>
	{@render children()}
</div>
