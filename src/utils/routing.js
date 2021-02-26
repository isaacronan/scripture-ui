import Home from '../screens/Home.svelte';
import Books from '../screens/Books.svelte';
import Book from '../screens/Book.svelte';
import Chapter from '../screens/Chapter.svelte';
import NotFound from '../screens/NotFound.svelte';
import CreateAccount from '../screens/CreateAccount.svelte';
import Login from '../screens/Login.svelte';
import Dashboard from '../screens/Dashboard.svelte';
import CreateSubscription from '../screens/CreateSubscription.svelte';
import EditSubscription from '../screens/EditSubscription.svelte';
import Issue from '../screens/Issue.svelte';
import ResetPassword from '../screens/ResetPassword.svelte';
import DeleteAccount from '../screens/DeleteAccount.svelte';

const HashPattern = function(pattern) {
    this.pattern = pattern;
};

HashPattern.prototype.isMatch = function(defaultRoute = '') {
    return this.pattern.test(defaultRoute || window.location.pathname);
};

HashPattern.prototype.getParams = function(defaultRoute = '') {
    return this.pattern.exec(defaultRoute || window.location.pathname).slice(1);
};

export const homePattern = new HashPattern(/^\/scripture\/?$/);
export const booksPattern = new HashPattern(/^\/scripture\/books$/);
export const bookPattern = new HashPattern(/^\/scripture\/books\/(\d+)$/);
export const chapterPattern = new HashPattern(/^\/scripture\/books\/(\d+)\/chapters\/(\d+)$/);
export const createAccountPattern = new HashPattern(/^\/scripture\/create$/);
export const loginPattern = new HashPattern(/^\/scripture\/login$/);
export const dashboardPattern = new HashPattern(/^\/scripture\/dashboard$/);
export const createSubscriptionPattern = new HashPattern(/^\/scripture\/subscription\/create$/);
export const editSubscriptionPattern = new HashPattern(/^\/scripture\/subscription\/edit\/(\w{4})$/);
export const issuePattern = new HashPattern(/^\/scripture\/subscription\/(\w{4})$/);
export const resetPattern = new HashPattern(/^\/scripture\/reset$/);
export const deletePattern = new HashPattern(/^\/scripture\/delete$/);

export const homeHash = '/scripture';
export const booksHash = '/scripture/books';
export const bookHash = booknumber => `/scripture/books/${booknumber}`;
export const chapterHash = (booknumber, chapternumber) => `/scripture/books/${booknumber}/chapters/${chapternumber}`;
export const createAccountHash = '/scripture/create';
export const loginHash = '/scripture/login';
export const dashboardHash = '/scripture/dashboard';
export const createSubscriptionHash = '/scripture/subscription/create';
export const editSubscriptionHash = (id) => `/scripture/subscription/edit/${id}`;
export const issueHash = (id) => `/scripture/subscription/${id}`;
export const resetHash = '/scripture/reset';
export const deleteHash = '/scripture/delete';

export const routeChangeEvent = new Event('routechange');

export const getCurrentScreen = (defaultRoute = '') => {
    if (homePattern.isMatch(defaultRoute)) {
        return Home;
    } else if (booksPattern.isMatch(defaultRoute)) {
        return Books;
    } else if (bookPattern.isMatch(defaultRoute)) {
        return Book;
    } else if(chapterPattern.isMatch(defaultRoute)) {
        return Chapter;
    } else if(createAccountPattern.isMatch(defaultRoute)) {
        return CreateAccount;
    } else if(loginPattern.isMatch(defaultRoute)) {
        return Login;
    } else if(dashboardPattern.isMatch(defaultRoute)) {
        return Dashboard;
    } else if(createSubscriptionPattern.isMatch(defaultRoute)) {
        return CreateSubscription;
    } else if(editSubscriptionPattern.isMatch(defaultRoute)) {
        return EditSubscription;
    } else if(issuePattern.isMatch(defaultRoute)) {
        return Issue;
    } else if(resetPattern.isMatch(defaultRoute)) {
        return ResetPassword;
    } else if(deletePattern.isMatch(defaultRoute)) {
        return DeleteAccount;
    } else {
        return NotFound;
    }
};