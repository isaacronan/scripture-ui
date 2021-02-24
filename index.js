import App from './src/App.svelte';
import './src/styles/resets.css';
import './src/styles/base.css';
import './src/styles/typography.css';
import './src/styles/buttons.css';
import './src/styles/charts.css';

import '@fortawesome/fontawesome-free/css/all.css';

new App({
    target: document.body,
    hydrate: true
});