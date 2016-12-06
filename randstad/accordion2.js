$('.accordion').click(function(){

  if( $(this).hasClass('active') ){
    $(this).removeClass('active');
    $(this).next().removeClass('show');
  }else{
    $('.accordion').removeClass('active');
    $('.panel').removeClass('show');

    $(this).addClass('active');
    $(this).next().addClass('show');
  }

})