

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
		async:false,
		data:JSON.stringify(creds),
		error:function(error){
			console.log(error);
		}
	}
	$.post(payload)
})