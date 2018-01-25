/*
 Name: 		FlatBook Html Template
 Author: 	http://themeforest.net/user/eriktailor
 Version: 	2.0.0
--------------------------------------------------------------------------------------------------- */

$(document).ready(function(){

/* ---------------------------------------------------------------------

 # JS PLUGINS

--------------------------------------------------------------------- */

/* --------------------------------------------------
 ## Counterup init
-------------------------------------------------- */
if (jQuery().counterUp) {
	$('.counter-value').counterUp({
    	delay: 10,
    	time: 1500
	});
}

/* --------------------------------------------------
 ## Tinyscrollbar init
-------------------------------------------------- */
if (jQuery().tinyscrollbar) {
	var $scrollBar  = $('.tablet-scrollbar'),
    	$overview   = $scrollBar.find(".overview"),
    	$texts      = $(".sample-content");
      
    $scrollBar.tinyscrollbar({
    	wheel: true
    });

    $(".tablet-menu-btn").click(function(){
    	var typeUpdate  = $(this).attr("data-update") || "",
			textId      = $(this).attr("data-text") || 0,
			textNew     = $texts[textId].innerHTML,
			scrollBar   = $scrollBar.data("plugin_tinyscrollbar");
           
		$('.tablet-menu li').removeClass('active');
		$(this).parent('li').addClass('active');      

		$overview.html(textNew);
		scrollBar.update(typeUpdate);
		return false;
    }); 
}


/* --------------------------------------------------
 ## Countdown Init
-------------------------------------------------- */
if (jQuery().countdown) {
	$('[data-countdown]').countdown();
}


/* --------------------------------------------------
 ## Wow init
-------------------------------------------------- */
new WOW().init();






/* ---------------------------------------------------------------------

 # THEME ELEMENTS

--------------------------------------------------------------------- */

/* --------------------------------------------------
 ## Preloader
-------------------------------------------------- */
function preLoader() {
	$(window).on('load', function() {
	    var $preloader = $('#preloader'),
	        $spinner   = $preloader.find('.spinner');
	    $spinner.fadeOut();
	    $preloader.delay(250).fadeOut(800);
	});
} 
preLoader();

/* --------------------------------------------------
 ## Scrolltop
-------------------------------------------------- */
function scrollTop() {
	var scrollTopBtn = $('#scrollTop');
	$(window).on('load resize scroll', function () {
		if ($(this).scrollTop() > 600) {
			scrollTopBtn.addClass('upscaled');
		} else {
			scrollTopBtn.removeClass('upscaled');
		}
	});	
	scrollTopBtn.click(function(){
		$('body,html').animate({ 
			scrollTop: 0 
		}, 800);
		$('.navbar-nav li').removeClass('active');
		return false;
	});
}
scrollTop();

/* --------------------------------------------------
 ## Navigation
-------------------------------------------------- */
function onepageNav() {
	var $body     = $(document.body);
	var navHeight = $('.navbar').outerHeight(true) + 10;
	$body.scrollspy({
		target: '#onepage-nav',
		offset: navHeight
	});
	$('.navbar a[href*=#]:not([href=#])').click(function() {
		$('#onepage-nav').removeClass('in');
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		    if (target.length) {
				$('html,body').animate({
				scrollTop: target.offset().top - 50
				}, 1000);
				return false;
		    }
	  	}
	});
}
onepageNav();

/* --------------------------------------------------
 ## Form Validate 1
-------------------------------------------------- */
function formValidate() {
	var $form = $("#contactForm1");
    $form.on("submit", function(e){
      if( $form[0].checkValidity() ) {
        $.post("assets/php/mailer.php", $form.serialize(), function(response) {
          $('#successMsg').removeClass('hidden').fadeIn(500);
          e.preventDefault();
        });
      } else console.log("invalid");
      e.preventDefault();
    });
}
formValidate();

/* --------------------------------------------------
 ## Form Validate 2
-------------------------------------------------- */
function formValidate2() {
	var $form = $("#contactForm2");
    $form.on("submit", function(e){
      if( $form[0].checkValidity() ) {
        $.post("assets/php/contact.php", $form.serialize(), function(response) {
          $('#successMsg').removeClass('hidden').fadeIn(500);
          e.preventDefault();
        });
      } else console.log("invalid");
      e.preventDefault();
    });
}
formValidate2();
 
/* --------------------------------------------------
 ## Carousel Controls
-------------------------------------------------- */
function carouselControl() {
	var $prev = $('.carousel a[data-slide="prev"]'),
		$next = $('.carousel a[data-slide="next"]');		
	$prev.click(function() {
		$('.carousel').carousel('prev');
	});
	$next.click(function() {
		$('.carousel').carousel('next');
	});	
}
carouselControl();

/* --------------------------------------------------
 ## Tooltips
-------------------------------------------------- */
function toolTips() {
	$('[data-toggle="tooltip"]').tooltip();
}
toolTips();

/* --------------------------------------------------
 ## Flippers
-------------------------------------------------- */
function flipCard() {
    $('.flip-item').hover(function() {
        $(this).find('.card').toggleClass('flipped');
    });	
}
flipCard();

$('.tabs-nav a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})


});

