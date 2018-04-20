$(document).ready(function() {
    $(function() {
        setNavigation();
    });

    /*$('.swipebox').swipebox();*/
    $('#security').show();
    $('#community').hide();
    $('#corporate').hide();
    $('#transcor').hide();
    $('#medical').hide();
    $('#facility').hide();

    var default_url = true;
    $('.navbar-toggle').click(function() {
        $('.collapse').toggleClass("in");
    });


    function setNavigation() {
        var path = window.location.pathname;
        path = path.replace(/\/$/, "");
        path = decodeURIComponent(path);

        $(".nav li a").each(function() {
            //$('.start-link').removeClass('active-link');
            var href = $(this).attr('href');
            //alert(href);
            /*if (href = "/ListJobs/All/"){//
              $('.start-link').addClass('active-link');
            } else*/
            if (path.substring(0, href.length) === href) {
                $('.start-link').removeClass('active-link');
                $(this).closest('li').addClass('active-link');
            }
        });
    }
    // button click on search bar
    $('#btnSearch').click(function() {

        if (default_url) {
            var Url = "/listjobs/All/search/";
            var stateUrl = $('#StateList option:selected').val();
            var catUrl = $('#by-Category option:selected').val();
            var keyword = $('#keyword').val();
            catUrl = catUrl.replace("by-Category", "CC-JobField"); //REPLACE THIS WITH THE FIELD NAME YOU ARE USING

            stateUrl = stateUrl.replace("by-Location", "CC-Organization");
            //All  sselected
            if (stateUrl.length > 0 && catUrl.length > 0 && keyword.length > 0) {
                stateUrl = stateUrl.replace("/ListJobs/ByState/", "State/");
                stateUrl = stateUrl.replace("Keyword-", "");
                stateUrl = stateUrl.replace("Country-US/", "");
                catUrl = catUrl.replace("ListJobs/ByCustom/", "");
                catUrl = catUrl.replace("Keyword-", "");
                fullUrl = Url + catUrl + stateUrl + "keyword/" + keyword;

            }
            //Category Only
            else if (stateUrl.length == 0 && catUrl.length > 0 && keyword.length == 0) {
                catUrl = catUrl.replace("ListJobs/ByCustom/", "");
                catUrl = catUrl.replace("Keyword-", "");
                fullUrl = Url + catUrl;
            }
            //State Only
            else if (stateUrl.length > 0 && catUrl.length == 0 && keyword.length == 0) {
                fullUrl = stateUrl;
            }
            //State and Category
            else if (stateUrl.length > 0 && catUrl.length > 0 && keyword.length == 0) {
                stateUrl = stateUrl.replace("/ListJobs/ByState/", "State/");
                stateUrl = stateUrl.replace("Keyword-", "");
                stateUrl = stateUrl.replace("Country-US/", "");
                catUrl = catUrl.replace("/ListJobs/ByCustom/", "");
                catUrl = catUrl.replace("Keyword-", "");
                fullUrl = Url + catUrl + stateUrl;

            }
            //Keyword Only
            else if (stateUrl.length == 0 && catUrl.length == 0 && keyword.length > 0) {
                fullUrl = "/ListJobs/ByKeyword/" + keyword;
            }
            //Keyword and State
            else if (stateUrl.length > 0 && catUrl.length == 0 && keyword.length > 0) {
                stateUrl = stateUrl.replace("/ListJobs/ByState/", "State/");
                stateUrl = stateUrl.replace("Keyword-", "");
                stateUrl = stateUrl.replace("Country-US/", "");
                fullUrl = Url + stateUrl + "keyword/" + keyword;

            }
            //Keyword and Category
            else if (stateUrl.length == 0 && catUrl.length > 0 && keyword.length > 0) {
                str = catUrl.slice(19);
                catUrl = str.replace("Keyword-", "");
                fullUrl = Url + catUrl + "keyword-" + keyword;
            }
            //None selected
            else if (stateUrl.length == 0 && catUrl.length == 0 && keyword.length == 0) {
                fullUrl = "/listjobs/All/";
            } else {
                fullUrl = Url;
            }
            $('#btnSearch').attr('href', fullUrl);
        };
    });


    // Remove 'more' on search form dropdowns
    $("select option:contains('More...')").remove();

    /* menus section to show active items*/

    function removeActive() {
        $('.tab-border').removeClass('active clicked');
        $('.menu-show div').removeClass('active-menu');
    }

    function hideMenu() {
        $('#security').hide();
        $('#community').hide();
        $('#corporate').hide();
        $('#transcor').hide();
        $('#medical').hide();
        $('#facility').hide();
    }
    $('.tab-border').click(function() {
        hideMenu();

        var href = $(this).find('h2').attr('id');
        removeActive();
        $(this).addClass('active clicked');
        $(href).show().addClass('active-menu');

    });
    $('.tab-border').hover(
        function() {
            var href = $(this).find('h2').attr('id');
            $('.tab-border').removeClass('active');
            $('.menu-show div').removeClass('active-menu');
            $(this).addClass('active');
            hideMenu();
            $('.menu-show div').removeClass('active-menu');
            $(href).show().addClass('active-menu');
        },
        function() {
            if (!$(this).hasClass('clicked')) {
                $(this).removeClass('active');
                $('.clicked').addClass('active');
                $('.menu-show div').removeClass('active-menu');
                hideMenu();
                var href1 = $('.clicked').find('h2').attr('id');
                $(href1).show().addClass('active-menu');
            }
        }
    );

    // Get the tnf modal
    var modalA = document.getElementById('tnf-modal');

    // Get the button that opens the modal
    var btnA = document.getElementById("tnf-link");

    // Get the <span> element that closes the modal
    var spanA = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal 
    btnA.onclick = function() {
        modalA.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    spanA.onclick = function() {
        modalA.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
            if (event.target == modalA) {
                modalA.style.display = "none";
            }
        }
        // Get the eoe modal
    var modalB = document.getElementById('eoe');

    // Get the button that opens the modal
    var btnB = document.getElementById("eoe-link");

    // Get the <span> element that closes the modal
    var spanB = document.getElementsByClassName("close2")[0];

    // When the user clicks on the button, open the modal 
    btnB.onclick = function() {
        modalB.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    spanB.onclick = function() {
        modalB.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modalB) {
            modalB.style.display = "none";
        }
    }

    // Get the accomodation modal
    var modalC = document.getElementById('accom');

    // Get the button that opens the modal
    var btnC = document.getElementById("accom-link");

    // Get the <span> element that closes the modal
    var spanC = document.getElementsByClassName("close1")[0];

    // When the user clicks on the button, open the modal 
    btnC.onclick = function() {
        modalC.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    spanC.onclick = function() {
        modalC.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modalC) {
            modalC.style.display = "none";
        }
    }

    /******************************************************
            SLIDESHOW
    ******************************************************/
    /*var slideIndex = 1;
    showSlides(slideIndex);

    function plusSlides(n) {
      showSlides(slideIndex += n);
    }

    function currentSlide(n) {
      showSlides(slideIndex = n);
    }

    function showSlides(n) {
      var i;
      var slides = document.getElementsByClassName("mySlides");
      var dots = document.getElementsByClassName("dot");
      if (n > slides.length) {slideIndex = 1} 
      if (n < 1) {slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none"; 
      }
      for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace(" active", "");
      }
      slides[slideIndex-1].style.display = "block"; 
      dots[slideIndex-1].className += " active";
    }*/

});
jQuery(document).ready(function() {
    function IndSort(a, b) {
        if (a.innerHTML == 'by Category') {
            return 1;
        } else if (b.innerHTML == 'by Category') {
            return -1;
        }
        return (a.innerHTML > b.innerHTML) ? 1 : -1;
    };
    $('#by-Category').each(function(index) {
        $(this).find('option').sort(IndSort).appendTo($(this));
    });
    $('#by-Category option:selected').prependTo('#by-Category');
});
jQuery(document).ready(function() {
    function IndSort(a, b) {
        if (a.innerHTML == 'StateList') {
            return 1;
        } else if (b.innerHTML == 'StateList') {
            return -1;
        }
        return (a.innerHTML > b.innerHTML) ? 1 : -1;
    };
    $('#StateList').each(function(index) {
        $(this).find('option').sort(IndSort).appendTo($(this));
    });
    $('#StateList option:selected').prependTo('#StateList');
    $('#StateList option[selected="selected"]').text("by Location");
});
//@prepros-append modal.js
//@prepros-append flexslider.js
//@prepros-append jquery.swipebox.js