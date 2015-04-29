$ ->
	# $('#Home a').addClass 'active'
	# $(document).on('click', '.tab a', (->
	# 	$(this).addClass 'active'
	# ))
	$(document).on('click', '.deleteButton', (->
		elementID = $(this).attr 'id'
		elementID = "#" + elementID.split "delete",2
		$(elementID).css('display', 'none')
		# console.log elementID
	))