<script>
import { books, getShortName } from '../utils/store';
import { getChapters } from '../utils/http';
import { chapterHash, bookHash } from '../utils/routing';
let searchInput = null;
let query = '';
let queryPattern = /^((\d*\s)?(\w+))(\s(\d+))?/;
let matchingBooks = [];
let selectedBooknumber = null;
let selectedChapternumber = null;
let chapterOptions = [];
let showSearchResults = false;
let focusedResultElementIndex = 0;

$: queryIsValid = queryPattern.test(query);
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
    setTimeout(() => updateMatchingBooks());
    showSearchResults = true;
    selectedChapternumber = null;
};

const updateMatchingBooks = () => {
    matchingBooks = queryIsValid ? $books.filter(book => new RegExp(query, 'i').test(book.shortname)).slice(0, 5) : [];
};

const setSelectedBook = (booknumber) => {
    if (booknumber !== selectedBooknumber) {
        selectedBooknumber = booknumber;
        chapterOptions = [];
        getChapters(selectedBooknumber).then(data => {
            chapterOptions = data;
        });
    }
    query = $getShortName(selectedBooknumber);
};

const hideSearchResults = () => {
    showSearchResults = false;
};

const handleBookSelect = (booknumber) => () => {
    hideSearchResults();
    searchInput.focus();
    setSelectedBook(booknumber);
};

const handleChapterSelect = (chapternumber) => {
    selectedChapternumber = chapternumber;
    query = [$getShortName(selectedBooknumber), selectedChapternumber].join(' ');
    searchInput.focus();
    updateMatchingBooks();
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
            updateMatchingBooks();
            focusedResultElementIndex = null;
            
    }
};
</script>
<div>
    <div class="container">
        <form on:submit|preventDefault={handleSubmit}>
            <input on:blur={hideSearchResults} on:keydown={handleKeyDown} class:with-results={showSearchResults && matchingBooks.length} bind:this={searchInput} on:input={handleInput} bind:value={query} type="text">
            <button tabindex="-1" disabled={!booknumberQuery} class:active={booknumberQuery} type="submit"><i class="fas fa-search"/></button>
        </form>
        {#if showSearchResults && matchingBooks.length}
            <ul class="search-results">
                {#each matchingBooks as { shortname, booknumber }, index}
                    <li>
                        <button tabindex="-1" class:focused={index === focusedResultElementIndex} on:click={handleBookSelect(booknumber)}>{shortname}</button>
                    </li>
                {/each}
            </ul>
        {/if}
        {#if chapterOptions.length && bookGuess && bookGuess.booknumber === selectedBooknumber}
            <ul class="chapter-options">
                {#each chapterOptions as { chapternumber }}
                    <li>
                        <button class="list-button small" class:selected={chapternumber === Number(chapternumberQuery)} on:click={handleChapterSelect(chapternumber)}>{chapternumber}</button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>
<style>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

form,   
ul {
    width: 80%;
}

form {
    position: relative;
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

.chapter-options {
    margin-top: var(--spacing-md);
}
</style>