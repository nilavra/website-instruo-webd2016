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
					var USERID = result[key].userid;
					var USERNAME = result[key].username;
					var PASSWORD = result[key].password;
					
					if(USERNAME === username && PASSWORD === password_md5)
					{
						found = true;
						$.session.set('userid', USERID);
						$.session.set('username', USERNAME);
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
	
	
/*----------------------------------- SEARCH ------------------------------ */
	$('#search-input').keyup(function()
	{
		if($(this).val().length > 0)
			$('a#search-clear').removeClass('hidden');
	});
	
	$('a#search-clear').click(function()
	{
		$('#search-input').val('');
		$(this).addClass('hidden');
		$('#search-input').focus();
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

