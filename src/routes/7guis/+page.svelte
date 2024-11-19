<script lang="ts">
	// Counter
	let counter = $state(0);

	// Temperature converter
	let celsius = $state(0);
	let fahrenheit = $state(32);

	// Flight Booker

	let flightOption: string = $state<'one-way flight' | 'two-way flight'>('one-way flight');

	let departDateDom: HTMLInputElement | undefined = $state();
	let departDate: string = $state('');
	let departDateError: Error[] = $state([]);

	let returnDateDom: HTMLInputElement | undefined = $state();
	let returnDate: string = $state('');
	let returnDateError: Error[] = $state([]);

	let validDeparture = $state([false, false]);
	let travelDates: [number, number] = $state([0, 0]);

	function setDepartDate() {
		const departure = parseDate(departDate, departDateError);
		validDeparture[0] = departure.isValid;
		travelDates[0] = Number(departure.dateArr?.reverse().join(''));
	}

	function setReturnDate() {
		const departure = parseDate(returnDate, returnDateError);
		validDeparture[1] = departure.isValid;
		travelDates[1] = Number(departure.dateArr?.reverse().join(''));
	}

	type DateArr = number[];
	type DateReturn = {
		isValid: boolean;
		dateArr: DateArr;
	};

	function parseDate(date: string, errorArr: Error[]): DateReturn {
		errorArr.length = 0;
		let res: DateReturn = { isValid: true, dateArr: [0, 0, 0] };
		const values: string[] = date.split('.');
		if (values.length !== 3 || values[2].length !== 4) {
			errorArr?.push(new Error('Date must be in mm.dd.yyyy format'));
			return { isValid: false, dateArr: [0, 0, 0] };
		} else {
			// loop throught the numbers and make sure they're valid numbers - if not, set a new error
			values.map((val, i) => {
				// check to see if the val can be parsed as a number
				let num = Number(val);
				if (!Number.isNaN(num)) {
					// check month
					if (i === 0 && num <= 12) {
						res.dateArr[0] = num;
					} else if (i === 0) {
						res.isValid = false;
						errorArr?.push(new Error('Month must be between 1 and 12!'));
					}
					// check day (technically this should check per month, but I can't be bothered)
					if (i === 1 && num <= 31) {
						res.dateArr[1] = num;
					} else if (i === 1) {
						res.isValid = false;
						errorArr?.push(new Error('Day must be between 1 and 31!'));
					}
					// check year
					const currentYear = new Date().getFullYear();
					if (i === 2 && (num === currentYear || num === currentYear + 1)) {
						res.dateArr[2] = num;
					} else if (i === 2) {
						res.isValid = false;
						errorArr?.push(new Error('Year error! Cannot schedule flight over one year out!'));
					}
				} else {
					res.isValid = false;
					errorArr?.push(new Error('Input was not numeric! Date must be in mm.dd.yyyy format.'));
				}
			});
		}
		return res;
	}
</script>

<!-- ---------------------------------------------------------------------------------- -->
<!-- COUNTER -->
<div class="p-4">
	<h1>Counter</h1>
	<div class="flex items-center gap-2">
		<p>{counter}</p>
		<button class="rounded bg-blue-300 px-4 py-2" onclick={() => counter++}>Count</button>
	</div>
</div>

<!-- ---------------------------------------------------------------------------------- -->
<!-- TEMPERATURE CONVERTER -->
<div class="p-4">
	<h1>Temperature Converter</h1>
	<div class="flex items-center gap-2">
		<input
			bind:value={fahrenheit}
			onkeyup={() => {
				celsius = (fahrenheit - 32) * (5 / 9);
			}}
			type="text"
		/>
		<p>Fahernheit =</p>
		<input
			bind:value={celsius}
			onkeyup={() => {
				fahrenheit = celsius * (9 / 5) + 32;
			}}
			type="text"
		/>
		<p>Celsius</p>
	</div>
</div>

<!-- ---------------------------------------------------------------------------------- -->
<!-- FLIGHT BOOKER -->

<div class="flex w-fit flex-col p-4">
	<h1>Flight Booker</h1>
	<label for="flight-options">Flight Type</label>
	<select name="Flight Options" id="flight-options" bind:value={flightOption}>
		<option selected value="one-way flight">one-way flight</option>
		<option value="two-way flight">two-way flight</option>
	</select>
	<label for="depart">Depart Date</label>
	{#if departDateError?.length}
		{#each departDateError as err}
			<p>{err}</p>
		{/each}
	{/if}
	<input
		bind:this={departDateDom}
		bind:value={departDate}
		onkeyup={() => {
			if (departDate) {
				setDepartDate();
			}
		}}
		id="depart"
		type="text"
	/>

	{#if flightOption === 'two-way flight'}
		<label for="return">Return Date</label>
		{#each returnDateError as err}
			<p>{err}</p>
		{/each}
		<input
			bind:this={returnDateDom}
			bind:value={returnDate}
			onkeyup={() => {
				setReturnDate();
			}}
			id="return"
			type="text"
		/>
	{/if}
	<!-- splitting up some button condidtionals -->
	{#if flightOption === 'one-way flight' && validDeparture[0]}
		<button>Book Flight!</button>
	{/if}
	{#if flightOption === 'two-way flight'}
		{#if validDeparture[0] && validDeparture[1]}
			{#if travelDates[0] < travelDates[1]}
				<button>Book Flight!</button>
			{/if}
		{/if}
	{/if}
</div>
