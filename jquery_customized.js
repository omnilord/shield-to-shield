$.fn.extend({
  hasClasses: function (selectors, all) {
    var $self = $(this);
    for (i in selectors) {
      if (!all && $self.hasClass(selectors[i])) {
        return true;
      } else {
        break;
      }
    }
    return false;
  }
});
