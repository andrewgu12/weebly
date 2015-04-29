(function() {
  $(function() {
    var pageCounter;
    pageCounter = 1;
    $('i.addPagePlus').click(function() {
      var buttonRowTag, buttonTag, pageID, pageText;
      pageCounter++;
      pageText = $('#addPage').val();
      pageID = "page" + pageCounter;
      buttonTag = "<div class='buttonLink' id='" + pageID + "'>" + pageText + "<i class='fa fa-times deletePage'></i><i class='fa fa-pencil editPage'></i></div>";
      buttonRowTag = "<div class='pageButton' id='" + pageID + "Row'><p>" + pageText + "</p></div>";
      $(buttonTag).insertBefore('#addPage');
      $("#rowOfButtons").append(buttonRowTag);
      return $('#addPage').val('');
    });
    $('#addPage').hover(((function(_this) {
      return function() {
        return $('i.addPagePlus').css('opacity', 1);
      };
    })(this)), ((function(_this) {
      return function() {
        return $('i.addPagePlus').css('opacity', 0);
      };
    })(this)));
    $(document).on('mouseover', '.buttonLink', (function() {
      return $(this).children('i').css('opacity', 1);
    }));
    $(document).on('mouseout', '.buttonLink', (function() {
      return $(this).children('i').css('opacity', 0);
    }));
    $(document).on('mouseover', 'i.deletePage', (function() {
      return $(this).parent().css('background', '#d86a65');
    }));
    $(document).on('mouseout', 'i.deletePage', (function() {
      return $(this).parent().css('background', '#518dca');
    }));
    $(document).on('click', 'i.deletePage', (function() {
      var parentID;
      parentID = $(this).parent().attr('id');
      parentID = "#" + parentID + "Row";
      $(this).parent().css('display', 'none');
      return $(parentID).css('display', 'none');
    }));
    $(document).on('mouseover', '#editPage', (function() {
      return $(this).children('i').css('opacity', 1);
    }));
    $(document).on('mouseout', '#editPage', (function() {
      return $(this).children('i').css('opacity', 0);
    }));
    $(document).on('click', 'i.editPage', (function() {
      var iconID, pageID, pageIDElement, replaceWithElement;
      pageID = $(this).parent();
      pageIDElement = $(this).parent().attr('id');
      iconID = pageIDElement + "Pencil";
      replaceWithElement = "<div id='editPage'><input type='text' class='editPageBox' id='" + pageIDElement + "' value='" + ($(pageID).text()) + "'><i class='fa fa-pencil editPagePencil' id='" + iconID + "'></div>";
      return $(pageID).replaceWith(replaceWithElement);
    }));
    $(document).on('click', 'i.editPagePencil', (function() {
      var ReplaceEditPageID, buttonRowID, editPage, editPageID, editPageText, replaceWithElement;
      editPage = $(this).parent();
      editPageID = $(this).attr('id');
      editPageID = editPageID.split("Pencil", 1);
      ReplaceEditPageID = "#" + editPageID;
      buttonRowID = "#rowOfButtons " + ReplaceEditPageID + "Row" + " p";
      editPageText = $(ReplaceEditPageID).val();
      replaceWithElement = "<div class='buttonLink' id='" + editPageID + "'>" + editPageText + "<i class='fa fa-times deletePage'></i><i class='fa fa-pencil editPage'></i></div>";
      $(editPage).replaceWith(replaceWithElement);
      return $(buttonRowID).text(editPageText);
    }));
    $('.dragItem').draggable({
      revert: true,
      zIndex: 2500
    });
    $('.sortable').droppable({
      drop: function(event, ui) {
        var draggedElement, replaceElement;
        console.log(ui.draggable);
        switch ($(ui.draggable).attr('id')) {
          case "text":
            replaceElement = "<textarea id='textBlock' placeholder='Start typing here...'></textarea>";
            break;
          case "title":
            replaceElement = "<div id='titleBlock' class='elementBlock'>TITLE</div>";
            break;
          case "image":
            replaceElement = "<div id='imageBlock' class='elementBlock'>IMAGE</div>";
            break;
          case "nav":
            replaceElement = "<div id='navBlock' class='elementBlock'>NAV</div>";
        }
        draggedElement = $(ui.draggable);
        return $('#mainWords').append(replaceElement);
      }
    });
    $('#mainWords p').click(function() {
      var currentText;
      currentText = $(this).text();
      return $(this).replaceWith("<textarea>" + currentText + "</textarea>");
    });
    return $('#mainWords textarea').focusout(function() {
      return console.log('textarea is blurred');
    });
  });

}).call(this);
