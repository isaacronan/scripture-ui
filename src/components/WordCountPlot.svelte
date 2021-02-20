<script>
import { select, local } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { max, min, } from 'd3-array';
import { getShortName } from '../utils/store';
import { getBooksStats, getChaptersStats } from '../utils/http';

export let booknumber = '';
let svg = null;
let data = null;
const index = local();

$: {
    booknumber;
    fetchData();
}

$: if (data) {
    plot();
}

const fetchData = () => {
    (!!booknumber ? getChaptersStats(booknumber) : getBooksStats()).then(rawData => {
        data = rawData;
    });
};

const plot = () => {
    const HEIGHT = svg.clientHeight
    const WIDTH = svg.clientWidth;
    const BARWIDTH = min([WIDTH / data.length, 100]);
    const BARSPACE = 0.1 * BARWIDTH;
    const LABELSPACE = 2;
    const scale = scaleLinear([0, max(data, ({ totalwords }) => totalwords)], [0.1 * HEIGHT, HEIGHT]);

    const rectUpdate = select(svg).select('.bars').selectAll('rect').data(data);
    const rectEnter = rectUpdate.enter().append('rect').attr('class', 'chart-bar').attr('tabindex', '-1');
    rectUpdate.exit().remove();

    const textUpdate = select(svg).select('.labels').selectAll('g').data(data);
    const textEnter = textUpdate.enter().append('g').attr('class', 'chart-label');
    textEnter.append('text').attr('class', 'label');
    textEnter.append('text').attr('class', 'value');
    textUpdate.exit().remove();

    rectEnter.merge(rectUpdate)
        .attr('x', (_, i) => i * BARWIDTH)
        .attr('y', ({ totalwords }) => HEIGHT - scale(totalwords))
        .attr('width', BARWIDTH - BARSPACE)
        .attr('height', ({ totalwords }) => scale(totalwords))
        .each((_, i, { [i]: element }) => {
            element.blur();
            index.set(element, i);
        })
        .on('mouseover', ({ target }) => {
            target.focus();
        })
        .on('mouseout', ({ target }) => {
            target.blur();
        })
        .on('focus', ({ target }) => {
            select(svg).select(`.labels g:nth-child(${index.get(target) + 1})`).style('visibility', 'visible');
        })
        .on('blur', ({ target }) => {
            select(svg).select(`.labels g:nth-child(${index.get(target) + 1})`).style('visibility', 'hidden');
        });

    textEnter.merge(textUpdate).select('.label')
        .text(d => {
            return booknumber ? `${$getShortName(booknumber)} ${d.chapternumber}` : $getShortName(d.booknumber);
        })
        .attr('text-anchor', (_, i) => i < data.length / 2 ? 'start' : 'end')
        .attr('y', -20);
    textEnter.merge(textUpdate).select('.value')
        .text(({ totalwords }) => {
            return totalwords;
        })
        .attr('text-anchor', (_, i) => i < data.length / 2 ? 'start' : 'end');
    textEnter.merge(textUpdate)
        .style('transform', (_, i) => {
            return `translate(${i * BARWIDTH + (i < data.length / 2 ? BARWIDTH - BARSPACE + LABELSPACE : -LABELSPACE)}px, ${HEIGHT}px`
        });
};
</script>
<svelte:window on:resize={plot} />
<div>
    <svg class="chart" bind:this={svg} width="100%">
        <g class="bars"></g>
        <g class="labels"></g>
    </svg>
</div>
<style>
div {
    line-height: 0;
    padding-bottom: var(--spacing-sm);
}

svg {
    height: 40px;
}
</style>