/*globals document, Cookies, window, $ */

(function () {
    "use strict";


    /* Cookie for log-in */
    var COOKIE_NAME = 'logged-user';
    var loggedUser = Cookies.get(COOKIE_NAME);

    if (loggedUser) {
        onLogIn(loggedUser);
    } else {
        onLogOut();
    }

    document.loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var username = this.username.value;
        Cookies.set(COOKIE_NAME, username, {
            expires: 20
        });
        $("#login-modal").modal("hide");
        onLogIn(username);
    });

    document.querySelector('.logout-btn').addEventListener("click", function (event) {
        event.preventDefault();
        Cookies.remove(COOKIE_NAME);
        onLogOut();
    });

    function onLogIn(username) {
        $(".not-logged-in").hide();
        $(".logged-in").show();
        $(".username-placeholder").text(username);
    }

    function onLogOut() {
        $(".not-logged-in").show();
        $(".logged-in").hide();
    }



    /* Carousel interval */
    $('.carousel').carousel({
        interval: 4000,
        pause: "false"
    });

    
    
    
    /*Shopping page*/
    var child;
    var check = false;

    function changeVal(el) {
        var qt = parseFloat(el.parent().children(".qt").html());
        var price = parseFloat(el.parent().children(".price").html());
        var eq = Math.round(price * qt * 100) / 100;

        el.parent().children(".full-price").html(eq + "€");

        changeTotal();
    }

    function changeTotal() {

        var price = 0;

        $(".full-price").each(function (index) {
            price += parseFloat($(".full-price").eq(index).html());
        });

        price = Math.round(price * 100) / 100;
        var tax = Math.round(price * 0.05 * 100) / 100;
        var shipping = parseFloat($(".shipping span").html());
        var fullPrice = Math.round((price + tax + shipping) * 100) / 100;

        if (price === 0) {
            fullPrice = 0;
        }

        $(".subtotal span").html(price);
        $(".tax span").html(tax);
        $(".total span").html(fullPrice);
    }

    $(document).ready(function () {

        $(".remove").click(function () {
            var element = $(this);
            element.parent().parent().parent().parent().parent().addClass("removed");
            window.setTimeout(
                function () {
                    element.parent().parent().parent().parent().parent().slideUp('fast', function () {
                        element.parent().parent().parent().parent().parent().remove();
                        if ($(".product").length === 0) {
                            if (check) {
                                $("#sorry-message").html("<h3>The shop does not function, yet!</h3>");
                            } else {
                                $("#sorry-message").html("<h3>No products!</h3>");
                            }
                        }
                        changeTotal();
                    });
                }, 200);
        });

        $(".qt-plus").click(function () {
            $(this).parent().children(".qt").html(parseInt($(this).parent().children(".qt").html()) + 1);

            $(this).parent().children(".full-price").addClass("added");

            var el = $(this);
            window.setTimeout(function () {
                el.parent().children(".full-price").removeClass("added");
                changeVal(el);
            }, 150);
        });

        $(".qt-minus").click(function () {

            child = $(this).parent().children(".qt");

            if (parseInt(child.html()) >= 1) {
                child.html(parseInt(child.html()) - 1);
            }

            $(this).parent().children(".full-price").addClass("minused");

            var el = $(this);
            window.setTimeout(function () {
                el.parent().children(".full-price").removeClass("minused");
                changeVal(el);
            }, 150);
        });

        window.setTimeout(function () {
            $(".is-open").removeClass("is-open");
        }, 1200);

        $(".shop-btn").click(function () {
            check = true;
            $(".remove").click();
            $("#filters").hide();
            $("#site-footer").hide();
        });
    });


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

    /* Generate shopping items data and filtered shopping items data */
    var shopItems = [];
    var TEMPLATE3 =
        '      <div id="common-div-for-products" class="container">  ' +
        '               <div class="row individual-item-cart">  ' +
        '                   <div class="col-md-3 push-md-9">  ' +
        '                       <section id="cart">  ' +
        '                           <article class="product">  ' +
        '                               <header>  ' +
        '                                   <a class="remove">  ' +
        '                   <img class="img-fluid img-shop" src="%PRODUCT_IMAGE_LOCATION%" alt="%PRODUCT_TITLE%">  ' +
        '                   <h3>Remove</h3>  ' +
        '               </a>  ' +
        '                               </header>  ' +
        '                           </article>  ' +
        '                       </section>  ' +
        '                   </div>  ' +
        '                   <div class="col-md-9 pull-md-3">  ' +
        '                       <section id="cart">  ' +
        '                           <article class="product">  ' +
        '                               <div class="content container ">  ' +
        '                                   <h1>%PRODUCT_TITLE%</h1>  ' +
        '                                   <h6>%PRODUCT_DESIGNED_BY%</h6>  ' +
        '                                   <h5>%PRODUCT_PRICE%€</h5>  ' +
        '                                   %PRODUCT_DESCRIPTION%  ' +
        '                               </div>  ' +
        '                               <footer class="content">  ' +
        '                                   <div class="container d-flex align-center">  ' +
        '                                       <span class="qt-minus">-</span>  ' +
        '                                       <span class="qt">0</span>  ' +
        '                                       <span class="qt-plus">+</span>  ' +
        '                                       <h2 class="full-price">  ' +
        '                                           0€  ' +
        '                                       </h2>  ' +
        '                                       <h2 class="price">  ' +
        '                                           %PRODUCT_PRICE%€  ' +
        '                                       </h2>  ' +
        '                                   </div>  ' +
        '                               </footer>  ' +
        '                           </article>  ' +
        '                       </section>  ' +
        '                       <!-- Button trigger modal -->  ' +
        '                       <button type="button" class="btn btn-info btn-block view-product-button" data-toggle="modal" data-target="#exampleModalCenter">  ' +
        '                   View product  ' +
        '               </button>  ' +
        '                       <!-- Modal -->  ' +
        '                       <div class="modal fade bd-example-modal-lg" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">  ' +
        '                           <div class="modal-dialog .modal-dialog-centered modal-lg" role="document">  ' +
        '                               <div class="modal-content">  ' +
        '                                   <div class="modal-header">  ' +
        '                                       <h5 class="modal-title" id="exampleModalLongTitle">%PRODUCT_TITLE%</h5>  ' +
        '                                       <button type="button" class="close" data-dismiss="modal" aria-label="Close">  ' +
        '                                   <span aria-hidden="true">&times;</span>  ' +
        '                               </button>  ' +
        '                                   </div>  ' +
        '                                   <div class="modal-body">  ' +
        '                                       <article class="product">  ' +
        '                                           <header>  ' +
        '                                              <div class="container d-flex align-center">  ' +
        '                                                  <img id="images-in-modal" class="rounded" src="%PRODUCT_IMAGE_LOCATION%" alt="%PRODUCT_TITLE%">  ' +
        '                                               </div>  ' +
        '                                           </header>  ' +
        '                                           <div class="content container">  ' +
        '                                               <h1>%PRODUCT_TITLE%</h1>  ' +
        '                                                  <strong> Item code: </strong>  ' +
        '                                                           %ITEM_CODE%  ' +
        '                                                       <br>' +
        '                                                  <strong> Category: </strong>  ' +
        '                                                           %CATEGORY%  ' +
        '                                                       <br>' +
        '                                                  <strong> Family: </strong>  ' +
        '                                                           %FAMILY%  ' +
        '                                                       <br>' +
        '                                                  <strong> Finish: </strong>  ' +
        '                                                           %FINISH%  ' +
        '                                                       <br>' +
        '                                                  <strong> Materials: </strong>  ' +
        '                                                           %MATERIAL%  ' +
        '                                                       <br>' +
        '                                                  <strong> Lamp base: </strong>  ' +
        '                                                           %LAMP_BASE%  ' +
        '                                                       <br>' +
        '                                                  <strong> Description: </strong>  ' +
        '                                                           %PRODUCT_DESCRIPTION%  ' +
        '                                           </div>  ' +
        '                                           <div class="container">  ' +
        '                                               <footer class="content">  ' +
        '                                                   <div class="container d-flex">  ' +
        '                                                  <strong> Price: </strong>  ' +
        '                                                           %PRODUCT_PRICE%€  ' +
        '                                                   </div>  ' +
        '                                               </footer>  ' +
        '                                           </div>  ' +
        '                                       </article>  ' +
        '                                   </div>  ' +
        '                                   <div class="modal-footer">  ' +
        '                                       <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>  ' +
        '                                   </div>  ' +
        '                               </div>  ' +
        '                           </div>  ' +
        '                       </div>  ' +
        '                   </div>  ' +
        '               </div>  ' +
        '          </div>  ';

    $.getJSON("./db/lamps.json", function (items_data) {
        shopItems = items_data;
        shopItems.forEach(function (shop_article) {
            shop_article.html = TEMPLATE3
                .replace(/%PRODUCT_TITLE%/g, shop_article.name)
                .replace(/%PRODUCT_PRICE%/g, shop_article.price)
                .replace(/%PRODUCT_DESIGNED_BY%/g, shop_article.designed_by)
                .replace(/%PRODUCT_DESCRIPTION%/g, shop_article.description)
                .replace(/%PRODUCT_IMAGE_LOCATION%/g, shop_article.image_path)
                .replace(/%ITEM_CODE%/g, shop_article.item_code)
                .replace(/%CATEGORY%/g, shop_article.category)
                .replace(/%FAMILY%/g, shop_article.family)
                .replace(/%FINISH%/g, shop_article.finish)
                .replace(/%MATERIAL%/g, shop_article.material)
                .replace(/%LAMP_BASE%/g, shop_article.lamp_base);
        });
        displayShopItems(shopItems);

    });

    document.shopItemsFiltersForm.sortByOption.addEventListener("change", function () {
        var key = this.value.split("-")[0],
            direction = this.value.split("-")[1];
        key = {
            name: "name",
            price: "price",
        }[key] || key;
        var sign = direction === "asc" ? 1 : -1;
        var sorted = shopItems.sort(function (itemA, itemB) {
            return compare(itemA, itemB, key) * sign;
        });
        displayShopItems(sorted);
    });


    document.shopItemsFiltersForm.category.addEventListener("change", function () {
        var item_category = this.value;
        var filtered = item_category.filter(function (item) {
            var regEx = new RegExp(item_category);
            return item.category.match(regEx);
        });

        displayShopItems(filtered);
    });

    document.shopItemsFiltersForm.keywords.addEventListener("keyup", function () {
        var keywords = this.value;
        var filtered = shopItems.filter(function (item) {
            var regEx = new RegExp(keywords, "i");
            return item.name.match(regEx) || item.designed_by.match(regEx) || item.description.match(regEx) || item.item_code.match(regEx) || item.category.match(regEx) || item.family.match(regEx) || item.material.match(regEx) || item.lamp_base.match(regEx);
        });
        displayShopItems(filtered);
    });

    function displayShopItems(list) {
        var items_container = $("#shop-items-container");
        items_container.empty();

        list.forEach(function (item) {
            items_container.append(item.html);
        });
    }

    function compare(obj1, obj2, key) {
        if (obj1[key] === obj2[key]) {
            return 0;
        }
        if (obj1[key] > obj2[key]) {
            return 1;
        }
        return -1;
    }


})();
