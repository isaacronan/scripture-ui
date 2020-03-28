<script>
import { books } from '../utils/store';
import { homeHash, bookHash } from '../utils/routing';
import ItemList from '../components/ItemList.svelte';
import PatientContainer from '../components/PatientContainer.svelte';
import Breadcrumbs from '../components/Breadcrumbs.svelte';
</script>
<article>
    <section>
        <Breadcrumbs crumbs={[
            { label: 'Home', hash: homeHash }
        ]}/>
        <h1>Books</h1>
        <PatientContainer isWaiting={$books.length === 0}>
            <ItemList
                items={$books}
                getTitle={item => `${item.shortname}`}
                getDescription={item => item.bookdesc}
                getHref={item => bookHash(item.booknumber)}
            />
        </PatientContainer>
    </section>
</article>