/*global $ */

(function () {
    "use strict";
 
    
    /* Generate timeline history in the index page */
    var articles = [];
    var TEMPLATE2 = '     <li>  ' +
        '                       <hr>  ' +
        '                       <span class="standard-span"></span>  ' +
        '                       <div class="container">  ' +
        '                           <div class="title">%ARTICLE_TITLE%</div>  ' +
        '                           <div class="info">%DESIGNED_BY%</div>  ' +
        '                           <div class="designers-images-for-small-devices">  ' +
        '                               <div class="row">  ' +
        '                                   <div class="col-xs-12 col-lg-6 col-xl-4"><img src="%01_image_location%" class="rounded-circle flex-history-images" alt="%ARTICLE_TITLE%"></div>  ' +
        '                                   <div class="col-xs-12 col-lg-6 col-xl-4"><img src="%02_image_location%" class="rounded-circle flex-history-images" alt="%ARTICLE_TITLE%"></div>  ' +
        '                                   <div class="col-xs-12 col-lg-6 col-xl-4"><img src="%03_image_location%" class="rounded-circle flex-history-images" alt="%ARTICLE_TITLE%"></div>  ' +
        '                               </div>  ' +
        '                           </div>  ' +
        '                           <div class="card-block">%ARTICLE_DESCRIPTION%</div>  ' +
        '                           <hr>  ' +
        '                       </div>  ' +
        '                       <span class="number">  ' +
        '                       <span class="standard-span">%START_YEAR%</span>  ' +
        '                       <span class="standard-span">%END_YEAR%</span>  ' +
        '                       </span>  ' +
        '                  </li>  ';


    $.getJSON("./db/timeline.json", function (json_data) {
        articles = json_data;

        articles.forEach(function (timeline_article) {
            timeline_article.html = TEMPLATE2
                .replace(/%ARTICLE_TITLE%/g, timeline_article.title)
                .replace(/%DESIGNED_BY%/g, timeline_article.designed_by)
                .replace(/%ARTICLE_DESCRIPTION%/g, timeline_article.description)
                .replace(/%01_image_location%/g, timeline_article.image_01)
                .replace(/%02_image_location%/g, timeline_article.image_02)
                .replace(/%03_image_location%/g, timeline_article.image_03)
                .replace(/%START_YEAR%/g, timeline_article.start_year)
                .replace(/%END_YEAR%/g, timeline_article.end_year);
        });
        displayArticles(articles);
    });

    function displayArticles(list) {
        var articles_container = $("#container-for-timeline-data");
        articles_container.empty();

        list.forEach(function (item) {
            articles_container.append(item.html);
        });
    }


})();
