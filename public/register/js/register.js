let username;
let password;

let appDomain = 'https://fierce-garden-85097.herokuapp.com'

function storeToken(data){
	localStorage.setItem('access_key',data.token)
	//redirect
	window.location = '../../game'
}

function signIn(data){
	const creds = {
		username,
		password
	}
	const payload = {
		url: appDomain + '/login',
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
		url: appDomain + '/users',
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