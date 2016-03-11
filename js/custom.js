/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//to show loader during Ajax calls
function showLoader()
{
	var img = new Image();
	img.src = $('#preloader img').attr('src');
	img.onload = function() 
	{
		$("#preloader").fadeIn('fast','swing');
	};
}

function hideLoader()
{
	$("#preloader").fadeOut('fast','swing');
}


function loadMenu()
{
    var categories = [];
	var category_desc = [];
    $.getJSON('menu.json', function(result) 
    {
        result = result.menu;
        
        var ITEMID = '', ITEM = '', CATEGORY = '', CATEGORY_DESC = '', PRICE = '', html = '';
        
        for(var key in result)
        {
            if(result.hasOwnProperty(key))
            {
                ITEMID = ''; ITEM = ''; CATEGORY = ''; PRICE = ''; html = '';
                
                ITEMID = result[key].itemId;
                ITEM = result[key].item;
                CATEGORY_DESC = result[key].category;
                PRICE = result[key].pricePerItem;
                
                //replacing space and converting to lowercase
                CATEGORY = CATEGORY_DESC.replace(/\s+/g, '-').toLowerCase();
                
                if( $.inArray(CATEGORY, categories) < 0 )
				{
					categories.push(CATEGORY);
					category_desc.push(CATEGORY_DESC);
				}
                    

                html =  
                 '<figure class="product-figure" data-name="' + ITEM + '" data-category="' + CATEGORY + '">'
                +'    <img src="img/menu/id_' + ITEMID + '.jpg" class="img-responsive" alt="img-' + ITEMID + '">'
                +'     <div class="product-detail">'
                +'        <h3>' + ITEM + '</h3>'
                +'         <h3>&#x20B9; ' + PRICE + '</h3>'
                +'     </div>'
                +'     <div class="row">'
                +'         <div class="col-xs-6">'
                +'             <a class="btn add-to-cart" data-item_id="' + ITEMID + '">Add to cart</a>'
                +'         </div>'
                +'         <div class="col-xs-6">'
                +'             <div class="btn-group" role="group">'
                +'                 <button class="btn btn-qty btn-minus" type="button" data-item_id="' + ITEMID + '"> <i class="fa fa-minus"></i> </button>'
                +'                 <button class="btn btn-qty btn-disp" type="button" data-item_id="' + ITEMID + '"> 1 </button>'
                +'                 <input type="hidden" name="qty" class="form-control" value="1" data-item_id="' + ITEMID + '">'
                +'                 <input type="hidden" name="price" class="form-control" value="' + PRICE + '" data-item_id="' + ITEMID + '">'
                +'                 <button class="btn btn-qty btn-plus" type="button" data-item_id="' + ITEMID + '"> <i class="fa fa-plus"></i> </button>'
                +'             </div>'
                +'         </div>'
                +'     </div>'
                +' </figure>';
        
                $('div#grid').append(html);
            }
        }
		
		for(var i = 0; i < categories.length; i++)
        {
			CATEGORY = categories[i];
			CATEGORY_DESC = category_desc[i];
			
			html =  
			 '<label class="btn btn-cat-filter">'
			+'       <input type="radio" name="cat-filter" data-category="' + CATEGORY + '"> ' + CATEGORY_DESC
			+'</label>';

			$('div#cat-select').append(html);
			
        }

        
    });
}






$(document).ready(function()
{
	var current_path = window.location.pathname.split('/').pop();
	//if not logged in, redirect to index.html
	if(!$.session.get('userid') && current_path !== 'index.html' )
		window.location.replace('index.html');
	else if($.session.get('userid') && current_path === 'index.html' )
		window.location.replace('menu.html');

/*--------------------------- highlight current link --------------------------- */
	$('.nav a[href="' + current_path + '"]').addClass('active');
	
/*--------------------------- display session info --------------------------- */
	if($.session.get('userid'))
	{
		$('span#username').html('Welcome <b>' + $.session.get('username') + '</b>');
		
		var num_items = 0;
		
		if($.session.get('num_items'))
			num_items = $.session.get('num_items');
		
		$('span#num_items').html(' ' + num_items + ' ');
	}
	
/*----------------------------------- SIGN-IN ------------------------------ */
	$('#form-signin').submit(function()
	{
		$.session.clear();
		
		var username = $('input[name=username]').val();
		var password = $('input[name=password]').val();
		var password_md5 = $.md5(password);
		
		var found = false;
		
		$.getJSON('users.json', function(result) 
		{
			result = result.users;
			//alert(result);
			for (var key in result)
			{
				if (result.hasOwnProperty(key))
				{
					if(
                        result[key].username === username 
                        && result[key].password === password_md5
                    )
					{
						found = true;
						$.session.set('userid', result[key].userid);
						$.session.set('username', result[key].username);
						break;
					}
				}
			}
			
			if(found)
				window.location.replace('menu.html');
			else
			{
				$.notify({
					title: '<strong>Invalid Login!</strong>',
					message: 'The username-password provided by you is incorrect.'
				},{
					type: 'danger',
					placement: {
						from: 'top',
						align: 'center'
					},
					delay:3000
				});

				$('input[name=username]').val('');
				$('input[name=password]').val('');

				$('input[name=username]').focus();
			}
		});
		
		return false;
	});
	
    
/*----------------------------------- display menu ------------------------------ */    
    if(current_path === 'menu.html') 
        loadMenu();
    
/*----------------------------------- SEARCH ------------------------------ */
	var cat_filter = '%', search_key = '';
	
	$('#search-input').keyup(function()
	{
		search_key = $(this).val().toLowerCase();
		if(search_key.length > 0)
		{
			$('a#search-clear').removeClass('hidden');
			$('.product-figure').filter( function(index)
			{
				var found = 
				$(this).data('name').toLowerCase().indexOf(search_key) === 0 //|| $(this).data('category').toLowerCase().indexOf(search_key) >= 0
					;
				return !found;
			}).hide('slow');
		}
		else
		{
			if(cat_filter === '%')
				$('.product-figure').show('slow');
			else
				$('.product-figure[data-category=' + cat_filter + ']').show('slow');
		}
	});
	
	
	$('a#search-clear').click(function()
	{
		if(cat_filter === '%')
			$('.product-figure').show('slow');
		else
			$('.product-figure[data-category=' + cat_filter + ']').show('slow');
		
		$('#search-input').val('');
		$(this).addClass('hidden');
		$('#search-input').focus();
		
		return false;
	});
	
	
	$('body').on('change', 'input[name=cat-filter]', function()
	{
		$('.product-figure').show();
        
		cat_filter = $(this).data('category');
        
		if(cat_filter !== '%')
			$('.product-figure[data-category!=' + cat_filter + ']').hide();
		
		return false;
	});
    

	

/*----------------------------------- CHANGE QUANTITY ------------------------------ */
	
    $('body').on('click', 'button.btn-minus', function()
	{
        var item_id = $(this).data('item_id');
        var input = $('input[name=qty][data-item_id='+item_id+']');
        var disp = $('button.btn-disp[data-item_id='+item_id+']');
        var qty = input.val();
        
        qty--;
        
        if(qty < 1) qty = 1;
        
        input.val(qty);
        disp.html(qty);
		
		return false;
	});
    
    $('body').on('click', 'button.btn-plus', function()
	{
        var item_id = $(this).data('item_id');
        var input = $('input[name=qty][data-item_id='+item_id+']');
        var disp = $('button.btn-disp[data-item_id='+item_id+']');
        var qty = input.val();
        
        qty++;
        
        if(qty > 10) qty = 10;
        
        input.val(qty);
        disp.html(qty);
		
		return false;
	});
    
	//cart structure:
	/**
	 * CART STRUCTURE:
	 *  num_items
	 *  [ {item_id, qty, price} ]
	 *  tot_price
	 *  order_no
	 */
	

/*----------------------------------- CHECK-OUT ------------------------------ */
	
	
});

