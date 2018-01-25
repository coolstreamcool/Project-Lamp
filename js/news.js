/*global $ */

(function () {
    "use strict";
    

    /* Generate news in the news section */
    var news = [];
    var TEMPLATE = '<div class="designers-images-for-small-devices">' +
        '             <img src="%IMG_SRC%" class="rounded-circle float-lg-left float-xl-left designers-images flex-images" alt="%TITLE%">' +
        '           </div>' +
        '           <div class="card-block">' +
        '             <hr>  ' +
        '             <strong>%TITLE%</strong><br><br>' +
        '             <strong>%SUBTITLE%</strong><br><br>' +
        '             <strong>%DATE%</strong><br><br>' +
        '             %DESCRIPTION%' +
        '             <hr>' +
        '           </div>';

    $.getJSON("./db/news.json", function (data) {
        news = data;

        news.forEach(function (article) {
            article.html = TEMPLATE
                .replace("%IMG_SRC%", article.image_location)
                .replace(/%TITLE%/g, article.title)
                .replace("%SUBTITLE%", article.subtitle)
                .replace("%DATE%", article.date)
                .replace("%DESCRIPTION%", article.description);
        });
        displayNews(news);
    });

    function displayNews(list) {
        var news_container = $("#news-container");
        news_container.empty();

        list.forEach(function (item) {
            news_container.append(item.html);
        });
    }

})();
