$('.accordion').click(function(){
    

  if( $(this).hasClass('active') ){
    $(this).removeClass('active');
    $(this).next().removeClass('show');
  }
    if($(this).hasClass('active')){
        e.preventDefault();
        e.stopPropagation();
    }
    
    else{
    $('.accordion').removeClass('active');
    $('.panel').removeClass('show');
      
    $(this).addClass('active');
    $(this).next().addClass('show');
  }

})
