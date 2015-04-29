(function() {
  $(function() {
    return $(document).on('click', '.deleteButton', (function() {
      var elementID;
      elementID = $(this).attr('id');
      elementID = "#" + elementID.split("delete", 2);
      return $(elementID).css('display', 'none');
    }));
  });

}).call(this);
