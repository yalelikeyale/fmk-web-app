const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function storeUserData(data){
	analytics.track('User Created')
	localStorage.setItem('user_id',data.obj_id)
	// localStorage.setItem('user_email',data.email)
	// localStorage.setItem('user_first',data.first_name)
	// localStorage.setItem('user_last',data.last_name)
	analytics.identify({
		'First Name':data.first_name,
		'Last Name':data.last_name,
		'Email':data.email
	})
	window.location = '/game'
}

$('#submit').on('click', function(e){
	e.preventDefault()
	const confirm = $('.js-confirm').val()
	const firstName = $('.js-first').val()
	const lastName = $('.js-last').val()
	const username = $('.js-username').val()
	const password = $('.js-password').val()
	if(!(confirm===password)){
		//highlight the password/ confirm in red
		alert('passwords do not match')
	} else if (!(re.test(username))) {
		alert('please provide an email address or a string that follows the format email@domain')
	} else {
		const creds = {
			firstName,
			lastName,
			username,
			password
		}
		const payload = {
			url: location.origin + '/users',
			headers:{
				'Content-Type':'application/json'
			},
			dataType:'json',
			data:JSON.stringify(creds),
			error:function(error){
				analytics.track('User Creation Failed')
				console.log('error ' + JSON.stringify(error));
			},
			success:storeUserData 
		}
		$.post(payload)
	}
})