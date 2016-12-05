	$(".accordion > dt").click(function(){
		$('.active').removeClass('active');
        if(false == $(this).next().is(':visible')) {
			$('.accordion > dd').slideUp(600);
            $(this).addClass('active');
		}
		$(this).next().slideToggle(600);
	});