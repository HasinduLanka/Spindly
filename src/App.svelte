<script>
  import { Global } from "./stores/global.spindlyhubs.js";
  import { ExampleHub } from "./stores/example.spindlyhubs.js";
  import Clock from "./Clock.svelte";

  export let name = "world";

  let { Message, Greating } = ExampleHub("example1");
  let { Message: Message2, Greating: Greating2 } = ExampleHub("example2");

  let { AppName, Version, HelloMessage, SaidHello } = Global;
</script>

<h1>Hello {name}!</h1>

<p>Global</p>
<input type="text" bind:value={$AppName} />
<br />
<pre>AppName : {$AppName}</pre>
<br />
<pre>Version : {$Version}</pre>

<br />

<input type="button" value="Say Hello" on:click={SaidHello} />
<p>{$HelloMessage}</p>

<p>Private store instance 1 :</p>
<input type="text" bind:value={$Message} />
<br />
<pre>{$Greating}</pre>
<br />
<br />

<p>Private store 2 :</p>
<input type="text" bind:value={$Message2} />
<br />
<pre>{$Greating2}</pre>

<br />
<br />
<p>These clocks run in the Go Host</p>

<Clock />
<Clock Zone="UTC" />
<Clock Zone="Europe/Paris" />
<Clock Zone="Asia/Singapore" />
