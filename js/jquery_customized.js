(function($) {
  $.fn.extend({
    hasClasses: function (selectors, all) {
      var $self = $(this);
      var c = 0;
      for (var i in selectors) {
        if ($self.hasClass(selectors[i])) {
          if (!all || typeof all == "undefined") { return true; }
          c++;
        }
      }
      if (selectors.length == c) { return true; }
      return false;
    },
    hasAttr: function(attr) {
      if (typeof attr !== 'string') return false;
      return $(this).is('['+attr+']');
    }
  });

  (function() {
    var o = $.fn.addClass;
    $.fn.addClass = function() {
      var r = o.apply(this, arguments);
      $(this).trigger('addClass', arguments);
      return r;
    }
  }());

  (function() {
    var o = $.fn.removeClass;
    $.fn.removeClass = function() {
      var r = o.apply(this, arguments);
      $(this).trigger('removeClass', arguments);
      return r;
    }
  }());

}(jQuery));
