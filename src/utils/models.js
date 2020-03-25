export const ExpandableItem = function(item) {
    this.item = item;
    this.isExpanded = false;
};

ExpandableItem.prototype.toggleExpanded = function() {
    this.isExpanded = !this.isExpanded;
    return this;
};

ExpandableItem.prototype.setExpanded = function(isExpanded) {
    this.isExpanded = isExpanded;
    return this;
};