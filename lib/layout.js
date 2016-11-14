$(document).ready(function(){

    var url="https://test-prod-api.herokuapp.com/products";
    
    function getProducts(){
        $.ajax({
        url: url,
        cache: true,
        success: function(data){
            var $mdiv = $("<div>", {id: "products", "class": "products_list", "type":"none"});

            $.each(data.products, function(id,item){
                var $pdiv = $("<div>",{id: id, "class": "product"});
                var $ptitle = $("<div>",{id: id, "class": "ptitle"});
                var $pimg = $("<span>",{id: id, "class": "pimg","style":"background-image:url('"+item.img+"')"});
                var $prate = $("<div>",{id: id, "class": "prate"});
                var $pcat = $("<div>",{id: id, "class": "pcat"});
                var $pscore = $("<div>",{id: id, "class": "pscore"});


                $ptitle.html(item.name);
                $prate.html("Price:₹"+(item.price).toFixed(2));
                $pcat.html("Category:"+item.cat);
                $pscore.html("Score:"+(item.score).toFixed(2));

                $($pdiv).append($pimg, $ptitle, $prate ,$pcat ,$pscore);
                $($mdiv).append($pdiv);
            });

            $('#content').append($mdiv);
        },
        complete: function(){
            $('#loading').hide();
        },
        error: function() {
            alert('An error has occurred, Please try again!');
        }
    });

    }
    $('#loading').show();    
    getProducts();
    
    



});