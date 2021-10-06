<script>
    export let count = 0;

    function incrementCount() {
        count = Number(count) + 1;
    }
</script>

<button on:click={incrementCount}>
    Clicked {count}
    {count === 1 ? "time" : "times"}
</button>
