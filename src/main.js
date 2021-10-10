import RegisterComponents from './SvelteComponents.js';

import App from './App.svelte';
import Counter from './Counter.svelte';
import Counter2 from './Counter2.svelte';
import CounterHell from './CounterHell.svelte';

let Components = {
	"app": App,
	"counter": Counter,
	"counterhell": CounterHell,
};

RegisterComponents(Components);
