

$('#submit').on('click', function(e){
	e.preventDefault()
	const username = $('.js-username').val()
	const password = $('.js-password').val()
	const creds = {
		username,
		password
	}
	const payload = {
		url:location.origin + '/login',
		headers:{
			'Content-Type':'application/json'
		},
		dataType:'json',
		data:JSON.stringify(creds),
		error:function(error){
			console.log(error);
		},
		success:function(data){
			console.log(data)
			window.location.href = data.redirect
		}
	}
	$.post(payload)
})