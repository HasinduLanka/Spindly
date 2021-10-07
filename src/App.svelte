<script lang="ts">
	import { PrivateStore } from "./publicstore/private.store";
	export let name = "world";

	let { Message, TextBox1 } = PrivateStore();
	let { Message: Message2, TextBox2 } = PrivateStore();
</script>

<h1>Hello {name}!</h1>

<p>Private store 1 :</p>
<input type="text" bind:value={$Message} />
<br />
<pre>{$Message}</pre>
<br />
<br />
<p>Private store 2 :</p>
<input type="text" bind:value={$Message2} />
<br />
<pre>{$Message2}</pre>
<br />
<br />

<style>
	h1 {
		color: rgb(19, 0, 128);
		font-family: "Comic Sans MS", cursive;
	}
</style>
