<script>
import debounce from 'lodash/debounce';
import { TIMEOUT } from '../utils/constants';
import { books, getShortName } from '../utils/store';
import { getChapters } from '../utils/http';
import { chapterHash, bookHash } from '../utils/routing';

let query = '';
let queryPattern = /^((\d*\s)?(\w+))(\s(\d+))?/;
let matchingBooks = [];
let selectedBooknumber = null;
let selectedChapternumber = null;
let chapterOptions = [];
let chapterOptionsBooknumber = null;
let showSearchResults = false;
let focusedResultElementIndex = 0;

$: showChapterOptions = chapterOptions.length;
$: queryIsValid = queryPattern.test(query);
$: booknameGuess = queryIsValid ? queryPattern.exec(query)[1] : null;
$: chapternumberGuess = queryIsValid ? queryPattern.exec(query)[5] : null;
$: bookGuess = booknameGuess ? $books.find(book => new RegExp(booknameGuess, 'i').test(book.shortname)) : null;
$: bookGuessMatchesSelected = bookGuess && bookGuess.booknumber === selectedBooknumber;
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
    setTimeout(() => updateMatchingBooks());
    showSearchResults = true;
    selectedChapternumber = null;
};

const updateMatchingBooks = () => {
    matchingBooks = queryIsValid ? $books.filter(book => new RegExp(query, 'i').test(book.shortname)).slice(0, 5) : [];
};

const fetchChapters = debounce((booknumber) => {
    getChapters(booknumber, true).then(data => {
        chapterOptionsBooknumber = booknumber;
        chapterOptions = data;
    });
}, TIMEOUT);

const setSelectedBook = (booknumber) => {
    if (booknumber !== selectedBooknumber) {
        selectedBooknumber = booknumber;
        fetchChapters(selectedBooknumber);
    }
    query = $getShortName(selectedBooknumber);
};

const hideSearchResults = () => {
    showSearchResults = false;
};

const handleBookSelect = (booknumber) => () => {
    hideSearchResults();
    setSelectedBook(booknumber);
};

const handleSubmit = (event) => {
    if (booknumberQuery && chapternumberQuery) {
        window.location.hash = chapterHash(booknumberQuery, chapternumberQuery);
    } else if (booknumberQuery) {
        window.location.hash = bookHash(booknumberQuery);
    }
};

const handleKeyDown = (event) => {
    switch (event.code) {
        case 'ArrowUp':
            event.preventDefault();
            if (focusedResultElementIndex === null) {
                focusedResultElementIndex = matchingBooks.length - 1;
            } else {
                focusedResultElementIndex += matchingBooks.length - 1;
                focusedResultElementIndex = focusedResultElementIndex % matchingBooks.length;
            }
            if (matchingBooks[focusedResultElementIndex]) {
                query = matchingBooks[focusedResultElementIndex].shortname;
                setSelectedBook(matchingBooks[focusedResultElementIndex].booknumber);
            }
            break;
        case 'ArrowDown':
            event.preventDefault();
            if (focusedResultElementIndex === null) {
                focusedResultElementIndex = 0;
            } else {
                focusedResultElementIndex += 1;
                focusedResultElementIndex = focusedResultElementIndex % matchingBooks.length;
            }
            if (matchingBooks[focusedResultElementIndex]) {
                query = matchingBooks[focusedResultElementIndex].shortname;
                setSelectedBook(matchingBooks[focusedResultElementIndex].booknumber);
            }
            break;
        default:
            focusedResultElementIndex = null;
            
    }
};
</script>
<div>
    <div class:with-options={showChapterOptions} class="container">
        <div class="search-form">
            <form class="form-control" on:submit|preventDefault={handleSubmit}>
                <input on:keydown={handleKeyDown} class:with-results={showSearchResults && matchingBooks.length} on:input={handleInput} bind:value={query} type="text">
                <button tabindex="-1" disabled={!booknumberQuery} class:active={booknumberQuery} type="submit"><i class="fas fa-search"/></button>
            </form>
            {#if showSearchResults && matchingBooks.length}
                <ul class="search-results form-control">
                    {#each matchingBooks as { shortname, booknumber }, index}
                        <li>
                            <button tabindex="-1" class:focused={index === focusedResultElementIndex} on:click={handleBookSelect(booknumber)}>{shortname}</button>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
        {#if showChapterOptions}
            <div class="chapter-options">
                <small>{$getShortName(chapterOptionsBooknumber)}</small>
                <ul>
                    {#each chapterOptions as { chapternumber }}
                        <li>
                            <a href={chapterHash(chapterOptionsBooknumber, chapternumber)} class="list-button small" class:selected={chapternumber === Number(chapternumberQuery) && bookGuessMatchesSelected}>{chapternumber}</a>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
</div>
<style>
.container {
    align-items: center;
    display: flex;
    flex-direction: column;
}

.search-form {
    align-items: center;
    display: flex;
    flex-basis: 100%;
    flex-direction: column;
    max-width: 100%;
}

.chapter-options small {
    text-transform: uppercase;
}

form {
    position: relative;
}

form input {
    height: 100%;
    width: 100%;
}

form button {
    color: var(--light);
    font-size: 2rem;
    height: 100%;
    padding: 0 var(--spacing-md);
    position: absolute;
    right: 0;
    top: 0;
}

form .active {
    color: var(--cyan);
}

.search-results li {
    background-color: var(--white);
    display: block;
}

.search-results .focused {
    background-color: var(--lighter);
}

.search-results button {
    height: 100%;
    padding: var(--spacing-md);
    text-align: left;
    width: 100%;
}

.search-results li:last-of-type,
.search-results li:last-of-type button {
    border-radius: 0 0 var(--radius) var(--radius);
}

form {
    display: flex;
}

input {
    flex-grow: 1;
}

.with-results {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.chapter-options,
.search-form {
    margin-top: var(--spacing-md);
}

@media screen and (min-width: 768px) {
    .container.with-options {
        align-items: flex-start;
        display: flex;
        flex-direction: row;
    }

    .with-options .chapter-options,
    .with-options .search-form {
        flex-basis: 50%;
    }

    .with-options .chapter-options {
        margin-left: var(--spacing-sm);
        margin-top: 0;
    }

    .with-options .search-form {
        margin-right: var(--spacing-sm);
    }
}
</style>