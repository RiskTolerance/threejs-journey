<!-- App.svelte -->
<script lang="ts">
	import { s } from '$lib/globalState.svelte';
	import SButton from '$lib/components/SButton.svelte';

	// Example of using runes for controlling buttons in parent component
	let isDarkMode = $state(false);

	$effect(() => {
		if (isDarkMode) {
			console.log('switching to dark mode');
			s.darkMode = true;
		} else {
			console.log('switching to light mode');
			s.darkMode = false;
		}
	});
</script>

<main
	class="flex min-h-screen flex-col items-center bg-gray-50 p-5 font-sans transition-colors duration-300 dark:bg-gray-900"
>
	<h1 class="mb-10 text-3xl font-bold text-gray-700 dark:text-blue-50">Neato nav!</h1>

	<div class="my-12">
		<!-- place the first copy of the nav here -->
		<ul class="flex gap-8 text-2xl">
			<a href="/"><li class="skeuomorphic-button rounded-full px-4 py-2">Nav Item 1</li></a>
			<a href="/"><li class="skeuomorphic-button rounded-full px-4 py-2">Nav Item 2</li></a>
			<a href="/"><li class="skeuomorphic-button rounded-full px-4 py-2">Nav Item 3</li></a>
			<a href="/"><li class="skeuomorphic-button rounded-full px-4 py-2">Nav Item 4</li></a>
		</ul>
	</div>

	<h1 class="mb-10 text-3xl font-bold text-gray-700 dark:text-blue-50">
		Skeuomorphic Components && Dark Mode!
	</h1>

	<div class="flex flex-wrap justify-center gap-10">
		<div
			class="button-example flex flex-col items-center rounded-2xl bg-gray-100 p-8 outline outline-1 outline-white dark:bg-gray-700 dark:outline-gray-500"
		>
			<h2 class="mb-5 text-lg font-medium text-gray-700 dark:text-blue-50">Basic Button</h2>
			<SButton text="Click Me" toggleable={false} />
		</div>

		<div
			class="button-example flex flex-col items-center rounded-2xl bg-gray-100 p-8 outline outline-1 outline-white dark:bg-gray-700 dark:outline-gray-500"
		>
			<h2 class="mb-5 text-lg font-medium text-gray-700 dark:text-blue-50">Toggle Button</h2>
			<SButton toggleable={true} />
		</div>

		<div
			class="button-example flex flex-col items-center rounded-2xl bg-gray-100 p-8 outline outline-1 outline-white dark:bg-gray-700 dark:outline-gray-500"
		>
			<h2 class="mb-5 text-lg font-medium text-gray-700 dark:text-blue-50">Theme Switcher</h2>
			<SButton text="Switch Theme" toggleable={true} bind:isToggled={isDarkMode} />
		</div>
	</div>
</main>

<style>
	/* Only keeping the custom CSS needed for specific effects */

	.button-example {
		/* Soft shadow for each example container - keeping this as custom CSS */
		box-shadow:
			4px 4px 10px 0px rgba(160, 160, 160, 0.3),
			-4px -4px 10px 0px rgb(255, 255, 255);

		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	:global(.dark) .button-example {
		box-shadow:
			4px 4px 10px 0px rgb(0, 0, 0),
			-4px -4px 10px 0px rgba(230, 230, 230, 0.209);
	}
</style>
