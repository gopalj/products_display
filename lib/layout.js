$(document).ready(function(){

    var url="https://test-prod-api.herokuapp.com/products",shownPageid=0;
    window.shownPageid=0;
    var items ;
    var animating = false;
    
    function getProducts(){
        $.ajax({
        url: url,
        cache: true,
        success: function(data){
            setGlobalData(data.products);
            filterAndSortData();
        },
        complete: function(){
            $('#loading').hide();
        },
        error: function() {
            alert('An error has occurred, Please check your internet connection and try again!');
        }
    });

    }

    function showProducts(products){
        var $mdiv = $("<div>", {id: "products", "class": "products_list", "type":"none"}),
            $page,
            pageid=0;

            if($(window).width() < 400){
                imgHeight=($(window).height()-(60+200))/3;
            } else {
                imgHeight=($(window).height()-(60+190))/3;
            }
            

            $.each(products, function(id,item){
                if(id == 0 || (id % 9 == 0)){
                    $page = $("<span>",{id:"page"+pageid, "class": "page"});
                }
                
                var $pdiv = $("<div>",{id: id, "class": "product"});
                var $ptitle = $("<div>",{id: id, "class": "ptitle"});
                var $pimg = $("<span>",{id: id, "class": "pimg","style":"height:"+imgHeight+"px;background-image:url('"+item.img+"')"});
                var $prate = $("<div>",{id: id, "class": "prate"});
                var $pcat = $("<div>",{id: id, "class": "pcat"});
                var $pscore = $("<div>",{id: id, "class": "pscore"});


                $ptitle.html(item.name);
                
                if($(window).width() < 400){
                    $prate.html("₹"+(item.price).toFixed(2));
                    $pcat.html(item.cat);
                } else {
                    $prate.html("Price:₹"+(item.price).toFixed(2));
                    $pcat.html("Category:"+item.cat);
                }
                
                $pscore.html("Score:"+(item.score).toFixed(4));

                $($pdiv).append($pimg, $ptitle, $prate ,$pcat ,$pscore);
                $($page).append($pdiv);
                if(id == 0 || (id % 9 == 0)){
                    $($mdiv).append($page);
                    pageid+=1;
                }

                
            });

            $('#content').html($mdiv);
            $('#loading').hide();
            items = $(".page");
    }

    function setGlobalData(products){
        window.productsData=products;
    }

    function SortByRate(x,y) {
      return x.price - y.price; 
    }

    function SortByScore(x,y) {
      return x.score - y.score; 
    }

    
    $("input[id='filter[]']" ).change(function() {
        $('#loading').show();
        filterAndSortData();
        
    });

    function filterAndSortData(){

        var Filtvalues = new Array(),filteredData = productsData, filterby, filterResult = new Array(),newfilteredData;
        $.each($("input[id='filter[]']:checked"), function() {
            Filtvalues.push($(this).val());
        });

        if(Filtvalues && Filtvalues.length>0){
            $.each(Filtvalues,function(key,value){
                    var tempRes = $.grep(filteredData, function (element, index) {
                        return element.cat == value;
                    });

                    var sortKey=null;
                    if($("input[type=radio][name='sortby']:checked").length > 0){
                        sortKey = $("input[type=radio][name='sortby']:checked")[0].value;
                    }

                    if(sortKey=='price'){
                        tempRes.sort(SortByRate);
                    }else if(sortKey=='score'){
                        tempRes.sort(SortByScore);
                    }
                    filterResult.push(tempRes);
            });

            for(i=1;i<filterResult.length;i++){
                $.merge(filterResult[0],filterResult[i]);
            }
            filteredData=filterResult[0];
        } else {
            var sortKey=null;
            if($("input[type=radio][name='sortby']:checked").length > 0){
                sortKey = $("input[type=radio][name='sortby']:checked")[0].value;
            }

            if(sortKey=='price'){
                filteredData.sort(SortByRate);
            }else if(sortKey=='score'){
                filteredData.sort(SortByScore);
            }

        }
        
        showProducts(filteredData);
    }

    $("input[type=radio][name='sortby']").change(function() {
        $('#loading').show();
        filterAndSortData();
    });

    
   

    $(window).scroll(function() {
        clearTimeout($.data(this, 'scrollTimer'));
        if (!animating) {
            $.data(this, 'scrollTimer', setTimeout(function() {
                items.each(function(key, value) {
                    if ($(value).offset().top > $(window).scrollTop()) {
                        animating = true;
                        $('body').animate( { scrollTop: $(value).offset().top-60 + 'px' }, 250);
                        setTimeout(function() { animating = false; }, 300);
                        return false;
                    }
                });
            }, 200));
        }
    });

    $('#loading').show();    
    getProducts();

});