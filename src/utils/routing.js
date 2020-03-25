const HashPattern = function(pattern) {
    this.pattern = pattern;
};

HashPattern.prototype.isMatch = function() {
    return this.pattern.test(window.location.hash);
};

HashPattern.prototype.getParams = function() {
    return this.pattern.exec(window.location.hash).slice(1);
};

export const homePattern = new HashPattern(/^#\/$/);
export const booksPattern = new HashPattern(/^#\/books$/);
export const bookPattern = new HashPattern(/^#\/books\/(\d+)$/);
export const chapterPattern = new HashPattern(/^#\/books\/(\d+)\/chapters\/(\d+)$/);