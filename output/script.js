$(document).ready(function() {
    // remove card
    $(".btn-danger").click(function() {
        const removeCard = $(this).closest(".card");
        $(this).attr("data-dismiss", "modal").attr("data-backdrop", "false");
        setTimeout( function(){ 
            removeCard.remove();
        }  , 500 );
    });
})