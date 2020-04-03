<script>
import { books, getShortName } from '../utils/store';
import { getChapters } from '../utils/http';
import { chapterHash, bookHash } from '../utils/routing';
let searchInput = null;
let query = '';
let queryPattern = /^((\d*\s)?(\w+))(\s(\d+))?/;
let selectedBooknumber = null;
let selectedChapternumber = null;
let chapterOptions = [];
let showSearchResults = false;

$: queryIsValid = queryPattern.test(query);
$: matchingBooks = queryIsValid ? $books.filter(book => new RegExp(query, 'i').test(book.shortname)) : [];
$: booknameGuess = queryIsValid ? queryPattern.exec(query)[1] : null;
$: chapternumberGuess = queryIsValid ? queryPattern.exec(query)[5] : null;
$: bookGuess = booknameGuess ? $books.find(book => new RegExp(booknameGuess, 'i').test(book.shortname)) : null;
$: booknumberQuery = (() => {
    if (selectedBooknumber && new RegExp(`^${booknameGuess}`, 'i').test($getShortName(selectedBooknumber))) {
        return selectedBooknumber;
    }
    if (bookGuess) {
        return bookGuess.booknumber;
    }
    return null;
})();
$: chapternumberQuery = (() => {
    if (selectedChapternumber && new RegExp(`${chapternumberGuess}$`).test(selectedChapternumber)) {
        return selectedChapternumber;
    }
    if (chapternumberGuess) {
        return chapternumberGuess;
    }
    return null;
})();

const handleInput = () => {
    showSearchResults = true;
    selectedChapternumber = null;
};

const handleBookSelect = (booknumber) => () => {
    showSearchResults = false;
    selectedBooknumber = booknumber;
    query = $getShortName(selectedBooknumber);
    searchInput.focus();
    chapterOptions = [];
    getChapters(selectedBooknumber).then(data => {
        chapterOptions = data;
    });
};

const handleChapterSelect = (chapternumber) => {
    selectedChapternumber = chapternumber;
    query = [$getShortName(selectedBooknumber), selectedChapternumber].join(' ');
    searchInput.focus();
};

const handleSubmit = (event) => {
    event.preventDefault();
    if (booknumberQuery && chapternumberQuery) {
        window.location.hash = chapterHash(booknumberQuery, chapternumberQuery);
    } else if (booknumberQuery) {
        window.location.hash = bookHash(booknumberQuery);
    }
};
</script>
<div>
    <form on:submit={handleSubmit}>
        <input bind:this={searchInput} on:input={handleInput} bind:value={query} type="text">
        <button type="submit">Go</button>
    </form>
    {#if showSearchResults && matchingBooks.length}
        <ul>
            {#each matchingBooks as { shortname, booknumber }}
                <li>
                    <button on:click={handleBookSelect(booknumber)}>{shortname}</button>
                </li>
            {/each}
        </ul>
    {/if}
    {#if chapterOptions.length}
        <ul>
            {#each chapterOptions as { chapternumber }}
                <li>
                    <button on:click={handleChapterSelect(chapternumber)}>{chapternumber}</button>
                </li>
            {/each}
        </ul>
    {/if}
</div>