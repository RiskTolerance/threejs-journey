<!-- SkeuomorphicButton.svelte -->
<script>
	// Using runes for reactivity
	// Props with default values
	let { text = 'Click Me', toggleable = true, isToggled = $bindable(false) } = $props();

	// State management with runes
	let isPressed = $state(false);

	// Computed state
	let buttonActive = $derived(isPressed || isToggled);

	// Handle mouse events
	function handleMouseDown() {
		isPressed = true;
	}

	function handleMouseUp() {
		// Only release if not in toggled state
		if (!isToggled) {
			isPressed = false;
		}
	}

	function handleMouseLeave() {
		// Only release if not in toggled state
		if (!isToggled) {
			isPressed = false;
		}
	}

	function toggleState() {
		if (toggleable) {
			isToggled = !isToggled;
			isPressed = isToggled;
		}
	}
</script>

<div class="flex h-56 w-56 flex-col items-center justify-center">
	<button
		class="skeuomorphic-button relative cursor-pointer overflow-clip rounded-xl border-none px-4 py-2 text-lg font-semibold text-slate-500 outline-none transition-all duration-200 ease-in-out dark:bg-slate-800 dark:text-slate-300"
		class:pressed={buttonActive}
		onmousedown={handleMouseDown}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseLeave}
		onclick={toggleState}
	>
		{#if toggleable}
			{isToggled ? 'toggled on' : 'toggled off'}
		{:else}
			{text}
		{/if}
	</button>
</div>

<style>
	/* Light mode advanced skeuomorphic effect */
	.skeuomorphic-button {
		/* Outset style (default/unpressed state) with multiple layered shadows */
		box-shadow:
      /* Distant soft shadow for depth */
			4px 4px 12px 0px rgba(136, 165, 191, 0.35),
			/* Close sharp shadow for edge definition */ 2px 2px 4px 0px rgba(136, 165, 191, 0.25),
			/* Distant highlight */ -4px -4px 12px 0px rgba(255, 255, 255, 0.8),
			/* Close highlight for edge definition */ -2px -2px 4px 0px rgba(255, 255, 255, 0.9),
			/* Subtle inner shadow for better depth */ inset 0px 1px 1px 0px rgba(255, 255, 255, 0.7),
			/* Bottom edge shadow */ 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
		@apply bg-gradient-to-br from-slate-50 to-slate-200;
		border: 1px solid rgba(255, 255, 255, 0.7);
	}

	.skeuomorphic-button.pressed {
		/* Inset style (pressed state) with multiple layered shadows */
		box-shadow:
      /* Inner shadow at top-left */
			inset 2px 2px 5px 0px rgba(136, 165, 191, 0.5),
			/* Deeper inner shadow */ inset 1px 1px 2px 0px rgba(136, 165, 191, 0.4),
			/* Inner highlight at bottom-right */ inset -2px -2px 5px 0px rgba(255, 255, 255, 0.5),
			/* Subtle outer highlight when pressed */ 0px 0px 2px 0px rgba(255, 255, 255, 0.7);

		/* Optional: slightly scale down button for additional effect */
		transform: scale(0.98);
		@apply bg-gradient-to-br from-green-100 to-green-200 text-slate-700;
		border: 1px solid rgba(255, 255, 255, 0.4);
	}

	/* Dark mode advanced skeuomorphic effect */
	:global(.dark) .skeuomorphic-button {
		/* Outset style for dark mode (default/unpressed state) */
		box-shadow:
      /* Distant soft shadow */
			4px 4px 12px 0px rgba(0, 0, 0, 0.5),
			/* Close sharp shadow */ 2px 2px 4px 0px rgba(0, 0, 0, 0.4),
			/* Distant highlight */ -4px -4px 12px 0px rgba(90, 130, 170, 0.25),
			/* Close highlight */ -2px -2px 4px 0px rgba(90, 130, 170, 0.3),
			/* Subtle inner glow */ inset 0px 1px 1px 0px rgba(90, 130, 170, 0.2),
			/* Bottom edge definition */ 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
		@apply bg-gradient-to-br from-slate-600 to-slate-700;
		border: 1px solid rgba(90, 130, 170, 0.2);
	}

	:global(.dark) .skeuomorphic-button.pressed {
		/* Inset style for dark mode (pressed state) */
		box-shadow:
      /* Inner shadow at top-left */
			inset 3px 3px 6px 0px rgba(0, 0, 0, 0.6),
			/* Deeper inner shadow */ inset 1px 1px 3px 0px rgba(0, 0, 0, 0.5),
			/* Inner highlight at bottom-right */ inset -2px -2px 5px 0px rgba(90, 130, 170, 0.25),
			/* Subtle outer glow when pressed */ 0px 0px 3px 0px rgba(90, 130, 170, 0.15);

		/* Color change for pressed state in dark mode */
		@apply bg-gradient-to-br from-emerald-800 to-emerald-700 text-slate-200;
		border: 1px solid rgba(90, 130, 170, 0.1);
	}
</style>
