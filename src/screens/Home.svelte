<script>
import { books, accessToken, TOKEN_DNE } from '../utils/store';
import { booksHash, bookHash, createAccountHash, loginHash } from '../utils/routing';
import PatientContainer from '../components/PatientContainer.svelte';
import QuickSearch from '../components/QuickSearch.svelte';
</script>
<article>
    <h1>Scripture</h1>
    <h3>A digital transcription of the <span>Douay-Rheims</span> translation</h3>
    {#if $accessToken === TOKEN_DNE}
        <p><a class="link" href={loginHash}>Login</a> or <a class="link" href={createAccountHash}>create an account</a> to make a customized reading plan.</p>
    {/if}
    <section>
        <h2>Quick Search</h2>
        <QuickSearch />
    </section>
    <section>
        <h2>Books</h2>
        <div>
            <a class="link" href={booksHash}>Detail View</a>
        </div>
        <PatientContainer isDark={true} isWaiting={$books.length === 0}>
            <ul>
                {#each $books as { shortname, booknumber }}
                    <li>
                        <a class="list-button" href={bookHash(booknumber)}>{shortname}</a>
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
    text-align: center;
}

p .link {
    color: var(--white);
}

h1 {
    margin: var(--spacing-sm) 0;
}

h3, p {
    margin-bottom: var(--spacing-lg);
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