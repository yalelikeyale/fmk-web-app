function storeToken(data){
	console.log('in store token')
	localStorage.setItem('heapIdentity',data.heapIdentity)
	//redirect
	window.location = '/game'
}

$('#submit').on('click', function(e){
	e.preventDefault()
	const username = $('.js-username').val()
	const password = $('.js-password').val()
	const creds = {
		username,
		password
	}
	const payload = {
		console.log(location.origin + '/login')
		url:location.origin + '/login',
		headers:{
			'Content-Type':'application/json'
		},
		dataType:'json',
		data:JSON.stringify(creds),
		error:function(error){
			console.log('error ' + JSON.stringify(error));
		},
		success:storeToken
	}
	$.post(payload)
})