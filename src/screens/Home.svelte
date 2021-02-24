<script>
import { books, accessToken, TOKEN_DNE } from '../utils/store';
import { booksHash, bookHash, createAccountHash, loginHash } from '../utils/routing';
import PatientContainer from '../components/PatientContainer.svelte';
import QuickSearch from '../components/QuickSearch.svelte';
import Link from '../components/Link.svelte';
</script>
<article>
    <h1>Scripture</h1>
    <h3>A digital transcription of the <span>Douay-Rheims</span> translation</h3>
    <p class:visible={$accessToken === TOKEN_DNE}><Link><a class="link" href={loginHash}>Login</a></Link> or <Link><a class="link" href={createAccountHash}>create an account</a></Link> to make a customized reading plan.</p>
    <section>
        <h2>Quick Search</h2>
        <QuickSearch />
    </section>
    <section>
        <h2>Books</h2>
        <div>
            <Link><a class="link" href={booksHash}>Detail View</a></Link>
        </div>
        <PatientContainer isDark={true} isWaiting={$books.length === 0}>
            <ul>
                {#each $books as { shortname, booknumber }}
                    <li>
                        <Link><a class="list-button" href={bookHash(booknumber)}>{shortname}</a></Link>
                    </li>
                {/each}
            </ul>
        </PatientContainer>
    </section>
</article>
<style>
h1, h3 {
    color: var(--cyan);
    text-align: center;
}

p {
    color: var(--light);
    margin-bottom: var(--spacing-md);
    text-align: center;
    visibility: hidden;
}

p .link {
    color: var(--white);
}

.visible {
    visibility: visible;
}

h1 {
    margin-bottom: var(--spacing-md);
}

h3 {
    margin-bottom: var(--spacing-sm);
}

h3 span {
    white-space: nowrap;
}

section {
    background-color: var(--beige);
    border-radius: var(--radius);
    color: var(--dark);
    padding: var(--spacing-lg);
    text-align: center;
}

section + section {
    margin-top: var(--spacing-md);
}

section .link {
    color: var(--blue);
    margin-bottom: var(--spacing-md);
}
</style>