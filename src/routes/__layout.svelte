<script lang="ts">
	import NavBar from 'src/components/NavBar.svelte';
</script>

<div class="container">
	<NavBar />
	<main class="main">
		<slot />
	</main>
</div>

<style lang="scss">
	:global(body) {
		padding: 0;
		margin: 0;
		background-color: $spotify-black;
		color: #ffffff;
		font-size: 1rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}
</style>
