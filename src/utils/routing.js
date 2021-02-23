const HashPattern = function(pattern) {
    this.pattern = pattern;
};

HashPattern.prototype.isMatch = function() {
    return this.pattern.test(window.location.pathname);
};

HashPattern.prototype.getParams = function() {
    return this.pattern.exec(window.location.pathname).slice(1);
};

export const homePattern = new HashPattern(/^\/scripture\/?$/);
export const booksPattern = new HashPattern(/^\/scripture\/books$/);
export const bookPattern = new HashPattern(/^\/scripture\/books\/(\d+)$/);
export const chapterPattern = new HashPattern(/^\/scripture\/books\/(\d+)\/chapters\/(\d+)$/);
export const createAccountPattern = new HashPattern(/^\/scripture\/create$/);
export const loginPattern = new HashPattern(/^\/scripture\/login$/);
export const dashboardPattern = new HashPattern(/^\/scripture\/dashboard$/);
export const createSubscriptionPattern = new HashPattern(/^\/scripture\/subscription\/create$/);
export const editSubscriptionPattern = new HashPattern(/^\/scripture\/subscription\/edit\/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})$/);
export const issuePattern = new HashPattern(/^\/scripture\/subscription\/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})$/);
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