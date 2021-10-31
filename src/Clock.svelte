<script>
    import { ClockHub } from "./stores/clock.spindlyhubs";

    let { ClockFace, TimeZone } = ClockHub();

    export let Zone = "";
    if (Zone) {
        $TimeZone = Zone;
    }
</script>

<h1>[ {$ClockFace} ]</h1>

<select bind:value={$TimeZone}>
    <option>Local</option>
    <option>UTC</option>
    <option>America/New_York</option>
    <option>Asia/Colombo</option>
    <option>Asia/Singapore</option>
    <option>Asia/Tokyo</option>
    <option>Australia/Sydney</option>
    <option>Europe/Paris</option>
    <option>Europe/London</option>
    <option>Israel</option>
</select>

<br />
<br />

<style>
    h1 {
        color: rgb(0, 128, 68);
        font-family: "Comic Sans MS";
    }
</style>
