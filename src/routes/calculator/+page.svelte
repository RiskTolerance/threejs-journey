<script lang="ts">
	// Reactive state variables
	let currentInput = $state('0');
	let previousInput = $state('');
	let operation = $state<'+' | '-' | '*' | '/' | null>(null);

	// Function to handle number input
	function appendNumber(number: string) {
		if (currentInput === '0') {
			currentInput = number;
		} else {
			currentInput += number;
		}
	}

	// Function to choose an operation
	function chooseOperation(op: '+' | '-' | '*' | '/') {
		if (currentInput === '') return;
		if (previousInput !== '') calculate();
		operation = op;
		previousInput = currentInput;
		currentInput = '0';
	}

	// Function to calculate the result
	function calculate() {
		if (previousInput === '' || operation === null) return;
		const prev = parseFloat(previousInput);
		const curr = parseFloat(currentInput);
		let result: number;

		switch (operation) {
			case '+':
				result = prev + curr;
				break;
			case '-':
				result = prev - curr;
				break;
			case '*':
				result = prev * curr;
				break;
			case '/':
				result = curr !== 0 ? prev / curr : NaN;
				break;
			default:
				return;
		}

		currentInput = result.toString();
		operation = null;
		previousInput = '';
	}

	// Function to clear inputs
	function clearAll() {
		currentInput = '0';
		previousInput = '';
		operation = null;
	}

	// Function to delete the last digit
	function deleteLast() {
		if (currentInput.length === 1) {
			currentInput = '0';
		} else {
			currentInput = currentInput.slice(0, -1);
		}
	}
</script>

<div class="calculator mx-auto w-80 rounded-lg bg-gray-100 p-4 shadow-lg">
	<div class="output mb-4 rounded bg-gray-200 p-4 text-right font-mono text-lg">
		<div class="previous text-gray-500">
			{previousInput}
			{operation}
		</div>
		<div class="current text-black">{currentInput}</div>
	</div>

	<div class="grid grid-cols-4 gap-2">
		<!-- Clear and Delete buttons -->
		<button class="col-span-2 rounded bg-red-500 p-2 text-white" onclick={clearAll}>AC</button>
		<button class="rounded bg-yellow-500 p-2 text-white" onclick={deleteLast}>DEL</button>
		<button class="rounded bg-blue-500 p-2 text-white" onclick={() => chooseOperation('/')}
			>÷</button
		>

		<!-- Number buttons -->
		{#each [7, 8, 9] as num}
			<button class="rounded bg-gray-300 p-2" onclick={() => appendNumber(num.toString())}>
				{num}
			</button>
		{/each}
		<button class="rounded bg-blue-500 p-2 text-white" onclick={() => chooseOperation('*')}
			>×</button
		>

		{#each [4, 5, 6] as num}
			<button class="rounded bg-gray-300 p-2" onclick={() => appendNumber(num.toString())}>
				{num}
			</button>
		{/each}
		<button class="rounded bg-blue-500 p-2 text-white" onclick={() => chooseOperation('-')}
			>−</button
		>

		{#each [1, 2, 3] as num}
			<button class="rounded bg-gray-300 p-2" onclick={() => appendNumber(num.toString())}>
				{num}
			</button>
		{/each}
		<button class="rounded bg-blue-500 p-2 text-white" onclick={() => chooseOperation('+')}
			>+</button
		>

		<!-- Zero, decimal, and equals buttons -->
		<button class="col-span-2 rounded bg-gray-300 p-2" onclick={() => appendNumber('0')}>0</button>
		<button class="rounded bg-gray-300 p-2" onclick={() => appendNumber('.')}>.</button>
		<button class="rounded bg-green-500 p-2 text-white" onclick={calculate}>=</button>
	</div>
</div>

<style lang="postcss">
	.calculator button {
		font-size: 1.25rem;
		font-weight: bold;
	}
</style>
