let username;
let password;

const appDomain = 'https://fierce-garden-85097.herokuapp.com'
const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function storeToken(data){
	localStorage.setItem('access_key',data.token)
	//redirect
	window.location = '../../game'
}

function signIn(data){
	const creds = {
		email,
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
	const first_name = $('.js-first').val()
	const email = $('.js-email').val()
	const password = $('.js-password').val()
	if(!(confirm===password)){
		//highlight the password/ confirm in red
		alert('passwords do not match')
	} else if (!(re.test(email))) {
		alert('please provide an email address or a string that follows the format email@domain')
	} else {
		const creds = {
			first_name,
			email,
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
	}
})