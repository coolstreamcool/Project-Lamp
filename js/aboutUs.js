/*global $ */

(function () {
    "use strict";

    
    /* Load aboutUs partial */ 
    $("#aboutUs-loaded").load("templates/_aboutus.html");
    
    /* Carousel interval */
    $('.carousel').carousel({
        interval: 4000,
        pause: "false"
    });


})();
