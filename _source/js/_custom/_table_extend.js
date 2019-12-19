(function ($) {

    var tableExtend = function () {
      var table =  $('.user_mode .table-extend');
      table.each(function () {
        if ($(this).hasClass('1')) {
          var sibs = $(this).nextAll('.pageEl:lt(1)');
          $(sibs).appendTo($j(this));
        } else if ($(this).hasClass('2')) {
          var sibs = $(this).nextAll('.pageEl:lt(2)');
          $(sibs).appendTo($(this));
        } else if ($(this).hasClass('3')) {
          var sibs = $(this).nextAll('.pageEl:lt(3)');
          $(sibs).appendTo($(this));
        }
      });

    }


      $(document).ready(function () {
        tableExtend();
      });

    }(jQuery));
