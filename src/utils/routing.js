const HashPattern = function(pattern) {
    this.pattern = pattern;
};

HashPattern.prototype.isMatch = function() {
    return this.pattern.test(window.location.hash);
};

HashPattern.prototype.getParams = function() {
    return this.pattern.exec(window.location.hash).slice(1);
};

export const homePattern = new HashPattern(/^#?\/?$/);
export const booksPattern = new HashPattern(/^#\/books$/);
export const bookPattern = new HashPattern(/^#\/books\/(\d+)$/);
export const chapterPattern = new HashPattern(/^#\/books\/(\d+)\/chapters\/(\d+)$/);
export const createAccountPattern = new HashPattern(/^#\/create$/);
export const loginPattern = new HashPattern(/^#\/login$/);
export const dashboardPattern = new HashPattern(/^#\/dashboard$/);
export const createSubscriptionPattern = new HashPattern(/^#\/subscription\/create$/);
export const editSubscriptionPattern = new HashPattern(/^#\/subscription\/edit\/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})$/);
export const issuePattern = new HashPattern(/^#\/subscription\/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})$/);
export const resetPattern = new HashPattern(/^#\/reset$/);
export const deletePattern = new HashPattern(/^#\/delete$/);

export const homeHash = '#/';
export const booksHash = '#/books';
export const bookHash = booknumber => `#/books/${booknumber}`;
export const chapterHash = (booknumber, chapternumber) => `#/books/${booknumber}/chapters/${chapternumber}`;
export const createAccountHash = '#/create';
export const loginHash = '#/login';
export const dashboardHash = '#/dashboard';
export const createSubscriptionHash = '#/subscription/create';
export const editSubscriptionHash = (id) => `#/subscription/edit/${id}`;
export const issueHash = (id) => `#/subscription/${id}`;
export const resetHash = '#/reset';
export const deleteHash = '#/delete';