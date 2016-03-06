/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function()
{
	var current_path = window.location.pathname.split('/').pop();
	//if not logged in, redirect to index.html
	if(!$.session.get('userid') && current_path !== 'index.html' )
		window.location.replace('index.html');
	
	$('#form-signin').submit(function()
	{
		$.session.clear();
		
		var username = $('input[name=username]').val();
		var password = $('input[name=password]').val();
		var password_md5 = $.md5(password);
		
		var found = false;
		
		$.getJSON('users.json', function(result) 
		{
			for (var key in result)
			{
				if (result.hasOwnProperty(key))
				{
					// here you have access to
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
		});
		
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
				delay:300000
			});
			
			$('input[name=username]').val('');
			$('input[name=password]').val('');
			
			$('input[name=username]').focus();
		}
		
		
		return false;
	});
	
	
	
});

