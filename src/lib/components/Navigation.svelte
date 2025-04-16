<script lang="ts">
	import { page } from '$app/state';

	const navItems = [
		{
			href: '/threejs-journey/chapter-1',
			label: 'Chapter 1 - Introduction'
		},
		{
			href: '/threejs-journey/chapter-2.3',
			label: 'Chapter 2.3 - Haunted House'
		},
		{
			href: '/threejs-journey/chapter-2.4',
			label: 'Chapter 2.4 - Particles'
		},
		{
			href: '/threejs-journey/chapter-2.5',
			label: 'Chapter 2.5 - Galaxy Generator'
		},
		{
			href: '/threejs-journey/chapter-2.6',
			label: 'Chapter 2.6 - Scroll-Based Animation'
		},
		{
			href: '/threejs-journey/chapter-3.1',
			label: 'Chapter 3.1 - Physics'
		},
		{
			href: '/threejs-journey/chapter-3.2',
			label: 'Chapter 3.2 - Imported Models'
		},
		{
			href: '/threejs-journey/chapter-3.3',
			label: 'Chapter 3.3 - Raycaster & Mouse Events'
		},
		{
			href: '/threejs-journey/chapter-3.4',
			label: 'Chapter 3.4 - Custom Models With Blender'
		},
		{
			href: '/threejs-journey/chapter-3.5',
			label: 'Chapter 3.5 - Environment Map'
		},
		{
			href: '/threejs-journey/chapter-3.6',
			label: 'Chapter 3.6 - Realistic Render'
		},

		{
			href: '/threejs-journey/chapter-4.1',
			label: 'Chapter 4.1 - Shaders'
		}
	];
</script>

<nav class="bg-black">
	<div class="container mx-auto flex divide-x-[1px] py-4 text-white">
		<div class="group relative">
			<button class="px-4 hover:text-orange-400">Threejs Journey</button>
			<div
				class="absolute bottom-0 left-1/2 z-10 mt-12 hidden min-w-full translate-y-full pt-4 group-hover:block"
			>
				<ul
					class="flex flex-col gap-4 text-nowrap rounded-md border-2 border-white bg-black p-4 text-white"
				>
					{#each navItems as navItem}
						<li>
							<a
								class="{page.route.id === navItem.href
									? 'text-orange-400'
									: ''} hover:text-orange-400"
								href={navItem.href}>{navItem.label}</a
							>
						</li>
					{/each}
				</ul>
			</div>
		</div>
		<a class="px-4 hover:text-orange-400" href="/7guis">7guis</a>
		<a class="px-4 hover:text-orange-400" href="/calculator">Calculator</a>
	</div>
</nav>
