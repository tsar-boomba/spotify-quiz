<script lang="ts">
	import { onMount } from 'svelte';

	import { scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';

	let ready = false;
	onMount(() => (ready = true));
</script>

{#if ready}
	<h1 in:scale={{ easing: backOut }} class="title">Welcome to <span>Spotify Quiz</span></h1>
{:else}
	<h1 class="title" style="color: #191414; user-select: none;">I love/hate svelete transition</h1>
{/if}

<p class="description">
	Test your knowledge of your listening habits. Get started by loging in to your spotify account
	below.
</p>

<style lang="scss">
	.title {
		background-color: $spotify-black;
		color: #ffffff;

		> span {
			color: $spotify-green;
		}
	}

	.description {
		font-size: 1.25rem;
	}
</style>
