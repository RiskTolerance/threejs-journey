<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import Navigation from '$lib/components/Navigation.svelte';
</script>

<Navigation></Navigation>
{@render children()}
