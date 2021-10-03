const client_id = localStorage.getItem('client_id')
const user = localStorage.getItem('access_key')

if(!(client_id)){
	window.location = '../index.html'
} 

$('.aws-form').on('submit', function(){
	const access_key = $(this).find('#access_key').val()
	const secret_key = $(this).find('#secret_key').val()
	const region = $(this).find('#region').val()
	const endpoint = $(this).find('#endpoint').val()
})

$('.seg-form').on('submit', function(e){
	console.log('made it into create segment connection')
	e.preventDefault()
	const segment_write = $(this).find('#segment_write').val()
	const data = {
		company: client_id,
		segment:{segment_write}
	}
	const payload = {
		url:'https://dry-chamber-24837.herokuapp.com/connect/woocom',
		dataType:'json',
		data:JSON.stringify(data),
		headers:{
			'content-type':'application/json',
			'Authorization':`Bearer ${user}`
		},
		error:function(err){console.log(err)},
		success:function(resp){console.log(resp)}
	}
	console.log(payload.data)
	$.post(payload)
})