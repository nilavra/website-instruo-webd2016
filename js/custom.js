
//to show loader during Ajax calls
function showLoader()
{
	var img = new Image();
	img.src = $('#ajaxload img').attr('src');
	img.onload = function() 
	{
		$("#ajaxload").fadeIn('fast','swing');
	};
}

function hideLoader()
{
	$("#ajaxload").fadeOut('fast','swing');
}




function getCurrentPath()
{
	return window.location.pathname.split('/').pop();
}

//----------- menu info ----------

var menu_all_category = [];
var menu_all_category_desc = [];

var menu_item_id = [];
var menu_item = [];
var menu_cateogry = [];
var menu_cateogry_desc = [];
var menu_price = [];

//-------- cart info --------
var cart_num_items = 0;
var cart_item_id = [];
var cart_qty = [];
var cart_order_no = '';
var cart_confirm_order = 'N';



function saveCart()
{
	if($.session.get('userid')) //store cart only if logged in
	{
		//clear data if prev data exists
		if($.session.get('cart_num_items'))
		{
			$.session.remove('cart_num_items');
			$.session.remove('cart_item_id');
			$.session.remove('cart_qty');
			$.session.remove('cart_order_no');
            $.session.remove('cart_confirm_order');
		}
		
		$.session.set('cart_num_items', cart_num_items);
		$.session.set('cart_item_id', JSON.stringify(cart_item_id));
		$.session.set('cart_qty', JSON.stringify(cart_qty));
		$.session.set('cart_order_no', cart_order_no);
        $.session.set('cart_confirm_order', cart_confirm_order);
	}
	else
	{
		$.notify({
			title: '<strong>Error!</strong>',
			message: 'Cart information could not be saved. User is not logged in.'
		},{
			type: 'danger',
			placement: {
				from: 'top',
				align: 'center'
			},
			delay:3000
		});
	}
}


function loadCart()
{
	if($.session.get('userid')) //retrieve cart only if logged in
	{
		if($.session.get('cart_num_items'))
		{
			cart_num_items = parseInt($.session.get('cart_num_items'));
			cart_item_id = JSON.parse($.session.get('cart_item_id'));
			cart_qty = JSON.parse($.session.get('cart_qty'));
			cart_order_no = $.session.get('cart_order_no');
            cart_confirm_order = $.session.get('cart_confirm_order');
		}
		
	}
	else
	{
		$.notify({
			title: '<strong>Error!</strong>',
			message: 'Cart information could not be retrieved. User is not logged in.'
		},{
			type: 'danger',
			placement: {
				from: 'top',
				align: 'center'
			},
			delay:3000
		});
	}
}


//also used for qty change
function addToCart(add_item_id, add_qty)
{
	if($.session.get('userid')) //add to cart only if logged in
	{
        if(cart_confirm_order === 'N')
        {
            var cart_index = cart_item_id.indexOf(add_item_id);
            var menu_index = menu_item_id.indexOf(add_item_id);

            if(menu_index > - 1)
            {
                if(add_qty < 1) add_qty = 1;
                if(add_qty > 10) add_qty = 10;

                if(cart_index > -1)
                {
                    cart_qty[cart_index] = add_qty;
                }
                else
                {
                    cart_num_items++;
                    cart_item_id.push(add_item_id);
                    cart_qty.push(add_qty);
                }

                saveCart();

                $.notify({
                    title: '<strong>Success!</strong>',
                    message: 'Cart updated with <b>' + add_qty + '</b> ' + menu_item[menu_index] + '.'
                },{
                    type: 'success',
                    placement: {
                        from: 'top',
                        align: 'center'
                    },
                    delay:3000
                });

                //update HTML
                if(getCurrentPath() === 'menu.html')
                {
                    $('.remove-from-cart[data-item_id=' + add_item_id + ']').show();
                    $('.btn-disp[data-item_id=' + add_item_id + ']').html(' ' + add_qty + ' ');
                    $('input[name=qty][data-item_id=' + add_item_id + ']').val(add_qty);
                }

                $('span#cart_num_items').html(' ' + cart_num_items + ' ');
            }
            else
            {
                $.notify({
                    title: '<strong>Error!</strong>',
                    message: 'Invalid menu item ordered.'
                },{
                    type: 'danger',
                    placement: {
                        from: 'top',
                        align: 'center'
                    },
                    delay:3000
                });
            }
        }
        else
        {
            $.notify({
                title: '<strong>Error!</strong>',
                message: 'Order is already placed. <br/> Order No: ' + cart_order_no
            },{
                type: 'danger',
                placement: {
                    from: 'top',
                    align: 'center'
                },
                delay:7000
            });
        }
	}
	else
	{
		$.notify({
			title: '<strong>Error!</strong>',
			message: 'Cart information could not be retrieved. User is not logged in.'
		},{
			type: 'danger',
			placement: {
				from: 'top',
				align: 'center'
			},
			delay:3000
		});
	}
}



function removeFromCart(remove_item_id)
{
	if($.session.get('userid')) //add to cart only if logged in
	{
        if(cart_confirm_order === 'N')
        {
            var index1 = cart_item_id.indexOf(remove_item_id); 
            var index2 = menu_item_id.indexOf(remove_item_id); 

            if(index1 > -1 && index2 > -1)
            {
                var remove_qty = cart_qty[index1];

                cart_item_id.splice(index1, 1);
                cart_qty.splice(index1, 1);
                cart_num_items--;

                saveCart();

                $.notify({
                    title: '<strong>Success!</strong>',
                    message: '<b>' + remove_qty + '</b> ' + menu_item[index2] + ' removed from cart.'
                },{
                    type: 'success',
                    placement: {
                        from: 'top',
                        align: 'center'
                    },
                    delay:3000
                });

                //update HTML
                if(getCurrentPath() === 'menu.html')
                {
                    $('.remove-from-cart[data-item_id=' + remove_item_id + ']').hide();
                    $('.btn-disp[data-item_id=' + remove_item_id + ']').html(' 1 ');
                    $('input[name=qty][data-item_id=' + remove_item_id + ']').val(1);
                }

                $('span#cart_num_items').html(' ' + cart_num_items + ' ');
            }
            else if(index1 < 0)
            {
                $.notify({
                    title: '<strong>Error!</strong>',
                    message: 'Item is not present in cart.'
                },{
                    type: 'danger',
                    placement: {
                        from: 'top',
                        align: 'center'
                    },
                    delay:3000
                });
            }
            else if(index2 < 0)
            {
                $.notify({
                    title: '<strong>Error!</strong>',
                    message: 'Invalid menu item.'
                },{
                    type: 'danger',
                    placement: {
                        from: 'top',
                        align: 'center'
                    },
                    delay:3000
                });
            }
        }
        else
        {
            $.notify({
                title: '<strong>Error!</strong>',
                message: 'Order is already placed. <br/> Order No: ' + cart_order_no
            },{
                type: 'danger',
                placement: {
                    from: 'top',
                    align: 'center'
                },
                delay:7000
            });
        }
	}
	else
	{
		$.notify({
			title: '<strong>Error!</strong>',
			message: 'Cart information could not be retrieved. User is not logged in.'
		},{
			type: 'danger',
			placement: {
				from: 'top',
				align: 'center'
			},
			delay:3000
		});
	}
}



function loadMenu(callback)
{
	showLoader();
	
    $.getJSON('menu.json', function(result) 
    {
        result = result.menu;
        
        var ITEMID = '', ITEM = '', CATEGORY = '', CATEGORY_DESC = '', PRICE = '', html = '';
		
		menu_all_category = [];
		menu_all_category_desc = [];
		menu_item_id = [];
		menu_item = [];
		menu_cateogry = [];
		menu_price = [];
        
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
                
                if( menu_all_category.indexOf(CATEGORY) < 0 )
				{
					menu_all_category.push(CATEGORY);
					menu_all_category_desc.push(CATEGORY_DESC);
				}
                
				menu_item_id.push(ITEMID);
				menu_item.push(ITEM);
				menu_cateogry.push(CATEGORY);
				menu_price.push(PRICE);
				
				if(getCurrentPath() === 'menu.html') //display meny only in menu.html
				{
					html =  
					'<figure class="product-figure" data-name="' + ITEM + '" data-category="' + CATEGORY + '">'
				   +'    <img src="img/menu/id_' + ITEMID + '.jpg" class="img-responsive" alt="img-' + ITEMID + '">'
				   +'     <div class="product-detail">'
				   +'        <h3>'
				   +				ITEM
				   +'              <span class="badge remove-from-cart" data-item_id="' + ITEMID + '" style="display:none;" title="Remove this item from cart">'
				   +'					<i class="fa fa-times"></i>'
				   +'              </span>'
				   +'        </h3>'
				   +'        <h3>&#x20B9; ' + PRICE + '</h3>'
				   +'     </div>'
				   +'     <div class="row">'
				   +'         <div class="col-xs-6">'
				   +'             <button class="btn add-to-cart" data-item_id="' + ITEMID + '">Add to cart</button>'
				   +'         </div>'
				   +'         <div class="col-xs-6">'
				   +'             <div class="btn-group" role="group">'
				   +'                 <button class="btn btn-qty btn-minus" type="button" data-item_id="' + ITEMID + '"> <i class="fa fa-minus"></i> </button>'
				   +'                 <button class="btn btn-qty btn-disp" type="button" data-item_id="' + ITEMID + '"> 1 </button>'
				   +'                 <input type="hidden" name="qty" class="form-control" value="1" data-item_id="' + ITEMID + '">'
				   //+'                 <input type="hidden" name="price" class="form-control" value="' + PRICE + '" data-item_id="' + ITEMID + '">'
				   +'                 <button class="btn btn-qty btn-plus" type="button" data-item_id="' + ITEMID + '"> <i class="fa fa-plus"></i> </button>'
				   +'             </div>'
				   +'         </div>'
				   +'     </div>'
				   +' </figure>';

				   $('div#grid').append(html);
				}
            }
        }
		
		if(getCurrentPath() === 'menu.html')
		{
			//create category filter buttons
			for(var i = 0; i < menu_all_category.length; i++)
			{
				CATEGORY = menu_all_category[i];
				CATEGORY_DESC = menu_all_category_desc[i];

				html =  
				 '<label class="btn btn-cat-filter">'
				+'       <input type="radio" name="cat-filter" data-category="' + CATEGORY + '"> ' + CATEGORY_DESC
				+'</label>';

				$('div#cat-select').append(html);
			}
			
			//update added to cart
			for(var i = 0; i < cart_item_id.length; i++)
			{
				var item_id = cart_item_id[i];
				var qty = cart_qty[i];
				
				$('span.remove-from-cart[data-item_id=' + item_id + ']').show();
				$('.btn-disp[data-item_id=' + item_id + ']').html(' ' + qty + ' ');
				$('input[name=qty][data-item_id=' + item_id + ']').val(qty);
			}
		}
		
		hideLoader();
		
		if(callback) callback();
    });
}




function search(_search_key, _cat_filter)
{
	$('.product-figure').show();
	

	if(_search_key === '')
	{
		if(_cat_filter !== '%')
			$('.product-figure[data-category!=' + _cat_filter + ']').hide();
	}
	else
	{
		if(_cat_filter === '%')
		{
			$('.product-figure').filter( function(index)
			{
				var found = $(this).data('name').toLowerCase().indexOf(_search_key) === 0
							;
				return !found;
			}).hide();
		}
		else
		{
			$('.product-figure').filter( function(index)
			{
				var found = $(this).data('name').toLowerCase().indexOf(_search_key) === 0 
							&& $(this).data('category') === _cat_filter
							;
				return !found;
			}).hide();
		}
	}
}



function loadOrderDetails()
{
	//showLoader();
	
	if($.session.get('userid')) //retrieve cart only if logged in
	{
		if($.session.get('cart_num_items'))
		{
			$('table.order-details tbody').empty();
			
			var html = '', ITEM = '', PRICE = '';
			var QTY = 0, PRICE = 0, TOT_PRICE = 0, GRAND_TOTAL = 0;
			var menu_index = 0;
			
			for(var i = 0; i < cart_num_items; i++)
			{
				menu_index = parseInt(menu_item_id.indexOf(cart_item_id[i]+''));
				
				ITEM = menu_item[ menu_index ];
				QTY = parseInt(cart_qty[i]);
				PRICE = parseInt( menu_price[menu_index] );
				TOT_PRICE = QTY * PRICE;
				
				GRAND_TOTAL = GRAND_TOTAL + TOT_PRICE;
				
				html =  
					 '<tr>'
					//+'	<td class="sl-no">' + (i+1) + '.</td>'
					+'	<td class="item">'
					+		(i+1) + '. ' + ITEM
					+'		&nbsp;'
					+'      <button class="btn btn-xs remove-from-cart" data-item_id="' + cart_item_id[i] + '" title="Remove this item from cart">'
					+'			Remove'
					+'      </button>'
					+'	</td>'
					+'	<td class="price">&#x20B9; ' + PRICE + '</td>'
					+'	<td class="qty">'
					+'	<select class="qty-select form-control" data-item_id="' + cart_item_id[i] + '">'
					+'	</select>'
					//+'      <button class="btn btn-qty btn-minus" data-item_id="' + cart_item_id[i] + '">'
					//+'			<i class="fa fa-minus"></i>'
					//+'      </button>'
					//+'		<br class="visible-xs"/>'
					//+'      <button class="btn btn-qty btn-disp">'
					//+			QTY
					//+'      </button>'
					//+'		<br class="visible-xs"/>'
					//+'      <button class="btn btn-qty btn-plus" data-item_id="' + cart_item_id[i] + '">'
					//+'			<i class="fa fa-plus"></i>'
					//+'      </button>'
					+'	</td>'
					+'	<td class="total-price">&#x20B9; ' + TOT_PRICE + '</td>'
					+'</tr>';
					
				$('table.order-details tbody').append(html);
				
				for(var j = 1; j <= 10; j++)
				{
					$('select[data-item_id=' + cart_item_id[i] + ']').append('<option>'+j+'</option>');
				}
				
				$('select[data-item_id=' + cart_item_id[i] + ']').val(QTY);
				
			}
			
			$('span#grand-total').html('&#x20B9; ' + GRAND_TOTAL);
			
		}
	}
	else
	{
		$.notify({
			title: '<strong>Error!</strong>',
			message: 'Cart information could not be retrieved. User is not logged in.'
		},{
			type: 'danger',
			placement: {
				from: 'top',
				align: 'center'
			},
			delay:3000
		});
	}
}



function confirmOrder()
{
    if(cart_confirm_order !== 'Y')
    {
        var d = new Date();
        var order_no = d.getFullYear() + '' + (d.getMonth() + 1) + '' + d.getDate() + '/'
                    + parseInt(Math.random() * 50 + 1);
            
        cart_order_no = order_no;
        cart_confirm_order = 'Y';
        saveCart();
    }
    else
    {
        $.notify({
            title: '<strong>Error!</strong>',
            message: 'Order is already confirmed. <br/> Order No: ' + cart_order_no
        },{
            type: 'danger',
            placement: {
                from: 'top',
                align: 'center'
            },
            delay:7000
        });
    }
    
}





$(document).ready(function()
{
	//if not logged in, redirect to index.html
	if(!$.session.get('userid') && getCurrentPath() !== 'index.html' )
		window.location.replace('index.html');
	else if($.session.get('userid') && getCurrentPath() === 'index.html' )
		window.location.replace('menu.html');
	

/*--------------------------- highlight current link --------------------------- */
	$('.nav a[href="' + getCurrentPath() + '"]').addClass('active');


/*--------------------------- display session info --------------------------- */
	if($.session.get('userid'))
	{
		$('span#username').html('Welcome <b>' + $.session.get('username') + '</b>');	
		
		if($.session.get('cart_num_items'))
			cart_num_items = $.session.get('cart_num_items');
		
		$('span#cart_num_items').html(' ' + cart_num_items + ' ');
	}


/*----------------------------------- SIGN-IN ------------------------------ */
	$('#form-signin').submit(function()
	{
		showLoader();
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
			
			hideLoader();
			
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
		
		hideLoader();
		return false;
	});
	
    


/*----------------------------------- load menu ------------------------------ */    
    if(getCurrentPath() === 'menu.html')
	{
		loadCart();
		
        loadMenu();
	}

	


/*----------------------------------- SEARCH ------------------------------ */
	var cat_filter = '%', search_key = '';
	
	$('#search-input').keyup(function()
	{
		search_key = $(this).val().toLowerCase();
		
		if(search_key.length > 0)
		{
			$('a#search-clear').removeClass('hidden');
			search(search_key, cat_filter);
		}
		else
		{
			$('a#search-clear').addClass('hidden');
			search(search_key, cat_filter);
		}
	});
	
	
	$('a#search-clear').click(function()
	{
		search_key = '';
		
		search(search_key, cat_filter);
		
		$('#search-input').val(search_key);
		$(this).addClass('hidden');
		$('#search-input').focus();
		
		return false;
	});
	
	
	$('body').on('change', 'input[name=cat-filter]', function()
	{
		cat_filter = $(this).data('category');   
		search(search_key, cat_filter);
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
	
	//order page
	$('body').on('change', 'select.qty-select', function()
	{
        var item_id = $(this).data('item_id')+'';
        var qty = $(this).val();
        
		addToCart(item_id, qty);
		
		loadMenu(function()
		{
			loadCart();
			loadOrderDetails();
			hideLoader();
		});
		
		return false;
	});
    
	
	
/*----------------------------------- ADD / REMOVE FROM CART ------------------------------ */
	$('body').on('click', 'button.add-to-cart', function()
	{
        var item_id = $(this).data('item_id')+'';
        var qty = parseInt( $('input[name=qty][data-item_id='+item_id+']').val() );
        addToCart(item_id, qty);
		return false;
	});
	
	$('body').on('click', 'span.remove-from-cart', function()
	{
        var item_id = $(this).data('item_id')+'';
		removeFromCart(item_id);
		return false;
	});
	
	//order page
	$('body').on('click', 'button.remove-from-cart', function()
	{
        var item_id = $(this).data('item_id')+'';
		removeFromCart(item_id);
		
		loadMenu(function()
		{
			loadCart();
			loadOrderDetails();
			hideLoader();
		});
		
		return false;
	});
	
	
/*----------------------------------- PLACE ORDER STICKY FOOTER ------------------------------ */
	
	$(window).scroll(function (event) 
	{
		var vTop = $(document).height() - $('footer').outerHeight(true);
		var y = $(this).scrollTop() + $(window).height();
		
		if (y < vTop)
		{
			$('.sticky-order-now').show();
            $('.sticky-confirm-order').show();
		} 
		else 
		{
			$('.sticky-order-now').hide();
            $('.sticky-confirm-order').hide();
		}
	});


/*----------------------------------- LOAD ORDER DETAILS ------------------------------ */
	if(getCurrentPath() === 'order.html')
	{
		//showLoader();
		loadMenu(function()
		{
			loadCart();
			loadOrderDetails();
			hideLoader();
		});
		
	}

/*----------------------------------- CONFIRM ORDER ------------------------------ */
	
    $('body').on('click', 'a.confirm-order', function()
	{
        var item_id = $(this).data('item_id')+'';
		removeFromCart(item_id);
		
		loadMenu(function()
		{
			loadCart();
			loadOrderDetails();
			hideLoader();
		});
		
		return false;
	});
    
	
});

