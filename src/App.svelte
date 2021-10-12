<script>
	import { Global, Global2 } from "./stores/global.spindlyhubs.js";
	import { ExampleHub } from "./stores/example.spindlyhubs.js";
	export let name = "world";

	let { Message, TextBox1 } = ExampleHub("example1");
	let { Message: Message2, TextBox1: TextBox2 } = ExampleHub("example2");

	let { AppName, Version } = Global;
</script>

<h1>Hello {name}!</h1>

<p>Global</p>
<input type="text" bind:value={$AppName} />
<br />
<pre>AppName : {$AppName}</pre>
<br />
<pre>Version : {$Version}</pre>

<br />

<p>Private store instance 1 :</p>
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
