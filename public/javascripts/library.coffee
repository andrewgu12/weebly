# Contains the scripts for the front-end of the site
$ ->
	# console.log("dom is ready")
	pageCounter = 1
	# Create a new page on sidebar
	$('i.addPagePlus').click ->
		pageCounter++
		pageText = $('#addPage').val()
		pageID = "page"+pageCounter;
		buttonTag = "<div class='buttonLink' id='#{pageID}'>#{pageText}<i class='fa fa-times deletePage'></i><i class='fa fa-pencil editPage'></i></div>"
		buttonRowTag = "<div class='pageButton' id='#{pageID}Row'><p>#{pageText}</p></div>"
		$(buttonTag).insertBefore('#addPage')
		$("#rowOfButtons").append(buttonRowTag)
		$('#addPage').val('')
	# Change the opacity of the plus sign
	$('#addPage').hover \
		# $('i.addPagePlus').css('opacity',1)
		(=> $('i.addPagePlus').css('opacity', 1)), \
		(=> $('i.addPagePlus').css('opacity', 0))

	# Use mouseover/mouseout instead of hover b/c divs are dynamically generated
	# Make the pencil and cross icons appear in and out
	$(document).on('mouseover', '.buttonLink', (->
		$(this).children('i').css('opacity', 1)
	))
	$(document).on('mouseout', '.buttonLink', (->
		$(this).children('i').css('opacity', 0)
	))
	# Hover over the cross to make the page div change from blue to red
	$(document).on('mouseover','i.deletePage', ( ->
		$(this).parent().css('background', '#d86a65')
	))
	$(document).on('mouseout', 'i.deletePage', (->
		$(this).parent().css('background', '#518dca')
	))
	# Delete the page by making the div disappear
	# FUTURE: Change this to Angular and delete the record off the Angular records too
	$(document).on('click','i.deletePage', ( ->
		parentID = $(this).parent().attr('id')
		parentID = "#" + parentID + "Row"
		$(this).parent().css('display', 'none')
		$(parentID).css('display','none')
	))
	# Make the pencil icon on the edit page textbox appear in and out
	$(document).on('mouseover', '#editPage', (->
		$(this).children('i').css('opacity', 1)
	))
	$(document).on('mouseout', '#editPage', (->
		$(this).children('i').css('opacity', 0)
	))
	# click the edit page pencil to replace the page div with a text box
	$(document).on('click','i.editPage', (->
		pageID = $(this).parent()
		pageIDElement = $(this).parent().attr('id')
		iconID = pageIDElement + "Pencil"
		replaceWithElement = "<div id='editPage'><input type='text' class='editPageBox' id='#{pageIDElement}' value='#{$(pageID).text()}'><i class='fa fa-pencil editPagePencil' id='#{iconID}'></div>"
		$(pageID).replaceWith(replaceWithElement)
	))
	# Click the edit page pencil to replace the text box with a div containing the name of the new page
	$(document).on('click', 'i.editPagePencil', (->
		editPage = $(this).parent()
		editPageID = $(this).attr('id')
		editPageID = editPageID.split "Pencil", 1
		ReplaceEditPageID = "#" + editPageID
		buttonRowID = "#rowOfButtons " + ReplaceEditPageID + "Row" + " p"
		editPageText = $(ReplaceEditPageID).val()
		replaceWithElement = "<div class='buttonLink' id='#{editPageID}'>#{editPageText}<i class='fa fa-times deletePage'></i><i class='fa fa-pencil editPage'></i></div>"
		$(editPage).replaceWith(replaceWithElement)
		$(buttonRowID).text(editPageText)
	)) 

	# dragging the ui buttons
	$('.dragItem').draggable
		revert: true
		zIndex: 2500 #always stay above everything else
		# helper: "clone"
	# $('.dragItem').droppable()
	$('.sortable').droppable
		drop: (event, ui) ->
			console.log ui.draggable
			switch $(ui.draggable).attr 'id'
				when "text" then replaceElement = "<textarea id='textBlock' placeholder='Start typing here...'></textarea>"
				when "title" then replaceElement = "<div id='titleBlock' class='elementBlock'>TITLE</div>"
				when "image" then replaceElement = "<div id='imageBlock' class='elementBlock'>IMAGE</div>"
				when "nav" then replaceElement = "<div id='navBlock' class='elementBlock'>NAV</div>"
			draggedElement = $(ui.draggable)
			$('#mainWords').append(replaceElement)

	# Click on a p tag and change it into a textarea to edit the text inside the p tag
	$('#mainWords p').click ->
		currentText = $(this).text()
		$(this).replaceWith "<textarea>#{currentText}</textarea>"		

	# Change back from textarea to p, but something's wrong -> can't detect enter or lost of focus
	# $('#mainWords textarea').keydown (e) ->
	# 	currentText = $(this).val()
	# 	key = e.keyCode
	# 	if key == 13
	# 		console.log 'enter was pressed'
	# 		$(this).replaceWith "<p>#{currentText}</p>"
	$('#mainWords textarea').focusout ->
		console.log 'textarea is blurred'
	# $('#text').droppable 
	# 	drop: (event, ui) ->
	# 		$(ui.draggable).replaceWith("<input type='text'>")
	