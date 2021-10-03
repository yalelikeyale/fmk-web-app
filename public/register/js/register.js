let username;
let password;

function storeToken(data){
	localStorage.setItem('access_key',data.token)
	//redirect
	window.location = '../launch-game/index.html'
}

function signIn(data){
	const creds = {
		username,
		password
	}
	const payload = {
		url:'{replace_me}/login',
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
}

$('#submit').on('click', function(e){
	e.preventDefault()
	const confirm = $('.js-confirm').val()
	first_name = $('.js-first').val()
	username = $('.js-username').val()
	password = $('.js-password').val()
	if(!(confirm===password)){
		//highlight the password/ confirm in red
	}
	const creds = {
		first_name,
		username,
		password
	}
	const payload = {
		url:'{replace_me}/users',
		headers:{
			'Content-Type':'application/json'
		},
		dataType:'json',
		data:JSON.stringify(creds),
		error:function(error){
			console.log('error ' + JSON.stringify(error));
		},
		success:signIn
	}
	$.post(payload)
})