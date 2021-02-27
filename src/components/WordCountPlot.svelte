<script>
import { select, local } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { max, min, } from 'd3-array';
import { formatNumber } from '../utils/misc';

export let data = null;
export let getLabel = d => d;
export let getValue = d => d;

const maxPoints = 1000;
$: points = (data || []).map((d, i) => ({ label: getLabel(d, i), value: getValue(d, i) }))
    .filter((_, index, arr) => index % Math.ceil(arr.length / maxPoints) === 0);

let svg = null;
const index = local();

$: if (points && svg) {
    plot();
}

const plot = () => {
    const HEIGHT = svg.clientHeight - 2;
    const WIDTH = svg.clientWidth;
    const BARWIDTH = min([WIDTH / points.length, 100]);
    const BARSPACE = 0.1 * BARWIDTH;
    const LABELSPACE = 2;
    const scale = scaleLinear([0, max(points, ({ value }) => value)], [0.1 * HEIGHT, HEIGHT]);

    const rectUpdate = select(svg).select('.bars').selectAll('rect').data(points);
    const rectEnter = rectUpdate.enter().append('rect').attr('class', 'chart-bar').attr('tabindex', '-1');
    rectUpdate.exit().remove();

    const textUpdate = select(svg).select('.labels').selectAll('g').data(points);
    const textEnter = textUpdate.enter().append('g').attr('class', `chart-label`);
    textEnter.append('text').attr('class', 'label');
    textEnter.append('text').attr('class', 'value');
    textEnter.select('.value').append('tspan').attr('class', 'count');
    textEnter.select('.value').append('tspan').attr('class', 'unit');
    textUpdate.exit().remove();

    rectEnter.merge(rectUpdate)
        .attr('x', (_, i) => i * BARWIDTH)
        .attr('y', ({ value }) => HEIGHT - scale(value))
        .attr('width', BARWIDTH - BARSPACE)
        .attr('height', ({ value }) => scale(value))
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
        .text(({ label }) => label)
        .attr('text-anchor', (_, i) => i * BARWIDTH < WIDTH / 2 ? 'start' : 'end')
        .attr('y', -20);
    textEnter.merge(textUpdate).select('.value')
        .attr('text-anchor', (_, i) => i * BARWIDTH < WIDTH / 2 ? 'start' : 'end');
    textEnter.merge(textUpdate).select('.count')
        .text(({ value }) => formatNumber(value));
    textEnter.merge(textUpdate).select('.unit')
        .text('words')
        .attr('dx', 2);
    textEnter.merge(textUpdate)
        .style('transform', (_, i) => {
            return `translate(${i * BARWIDTH + (i * BARWIDTH < WIDTH / 2 ? BARWIDTH - BARSPACE + LABELSPACE : -LABELSPACE)}px, ${HEIGHT}px`
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
    padding-bottom: var(--spacing-xs);
}

svg {
    height: 40px;
}
</style>