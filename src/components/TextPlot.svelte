<script>
import { getShortName } from '../utils/store';
import { getBooksStats, getChaptersStats } from '../utils/http';
import WordCountPlot from './WordCountPlot.svelte';
import { onMount } from 'svelte';

export let booknumber = '';
let data = null;

onMount(() => {
    (!!booknumber ? getChaptersStats(booknumber) : getBooksStats()).then(rawData => {
        data = rawData;
    });
});
</script>
<WordCountPlot {data} getLabel={d => booknumber ? `${$getShortName(booknumber)} ${d.chapternumber}` : $getShortName(d.booknumber)} getValue={({ totalwords }) => totalwords} />