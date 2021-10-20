'use strict'

// 
$(document).ready(function(){
	const GameState = {
		'round':0,
		'batches':[
		  ['burrito','pizza','chicken'],
		  ['peter','randy','homer'],
		  ['curly','russet','waffle']
		],
		'category':[
		  'What could you eat for the rest of your life...',
		  'Best Cartoon Dad...',
		  'Picking between fries is tough, but so is life...'
		],
		'correct':0,
		'incorrect':0,
		'correctCount':0,
		'nextQuestion':true
	}

	function toggleDisplay(selector){
		$(selector).toggleClass('hide-it')
	}

	function toggleButton(selector, value, className){
		$(selector).unbind('click');
		$(selector).attr({"value":value,"class":className});
	}

	function tallyCorrect(){
		$('.js-tally-correct').html(state.correct);
	}

	function tallyIncorrect(){
		$('.js-tally-incorrect').html(state.incorrect);
	}

    function checkAnswers(){
    	state.correctCount = 0;
    	$('.line-up').find('.card').each(function(){
    		var correct = $(this).find('.img').attr('data-answer');
    		correct = String(correct);
    		var userAnswer = $(this).find('.ui-droppable.answer-box.answered').text();
    		userAnswer = String(userAnswer);
    		userAnswer = userAnswer.trim();
    		if(userAnswer===''){
    			state.nextQuestion = false;
    		} else {
	    		if(correct.toLowerCase()===userAnswer.toLowerCase()){
	    			state.correctCount += 1;
	    		}
    		}
    	});
    	if(state.nextQuestion===true ){
    		if(state.correctCount===3){
				state.correct += 1;
				tallyCorrect()
				if(state.round===3){
					renderEnd();
				} else {
					shuffleCards();
    				renderAnswers();
				}
    		} else {
				state.incorrect += 1;
				tallyIncorrect();
				if(state.round===3){
					renderEnd();
				} else {
					shuffleCards();
    				renderAnswers();
				}
    		}
    	} else {
    		alert('I know this game can leave you choosing between a turdsandwich and a douche, but you have to choose all three.')
    		state.round -= 1;
    		state.correctCount = 0;
    		state.nextQuestion = true;
    		shuffleCards();
    		renderAnswers();
    	}
    }

	function renderCards(img){
		var card = 
			`<div class="col-4">
				<div class="card">
					<div class="image-wrapper">
					    // figure out how to reference aws s3 public objects from img src 
						<img class="img" data-answer="${img.answer}" src="https://aws.s3.com/${img.img_name}" alt="${img.alt}"/>
					</div>
					<div class="droppable answer-box">
						<span class="description">${img.alt}</span>
						<p>Place your answer here!</p>
					</div>
				</div>
			</div>`	
        return card
        }

	function renderImg(imgKey){
		// mongo fetch image info
		// get request to backend to fetch aws path for each img
		
	}

	function shuffleCards(){
		$('.title').html(state.category[state.round])
		var cards = [];
		var batch = state.batches[state.round];
		for (var key in batch){
			//replace with render image
			var card = renderImg(batch[key])
			// var card = state.images[batch[key]];
			card = renderCards(card);
			cards.push(card);
		}
		cards = cards.join("");
		$('.line-up').html(cards);
		state.round += 1;
		$( ".droppable" ).droppable({
			accept:'.draggable',
			drop: function( event, ui ) {
				ui.draggable.detach().appendTo($(this));
	    		const userChoice = $(ui.draggable).text();
	    		$(this).text(userChoice);
	    		$(this).css({'background-color':'#7FB800','line-height':'2.5'});
	    		$(this).addClass('answered');
	  		}
		});
		toggleDisplay('.m-choice');
	}

	function renderAnswers(img){
		var answers = 
			`<div class="row"> 
				<div class="col-4">
					<div class="draggable">
          				<span>F*ck</span>
        			</div>
        		</div>
        		<div class="col-4">
        			<div class="draggable">
          				<span>Marry</span>
        			</div>
        		</div>
        		<div class="col-4">
        			<div class="draggable">
          				<span>Kill</span>
        			</div>
        		</div>
        	</div>`	
        $('.answer-wrapper').html(answers);
        $('.draggable').draggable({
			revert:'invalid'
		});
        }

    function renderEnd(){
    	var selectors = ['.correct.top','.correct.bottom','.incorrect','.answer-wrapper']
    	selectors.map((selector) => toggleDisplay(selector));
    	toggleButton('.submit-button', 'PLAY AGAIN', 'play-button');
    	$('.fmk').toggleClass('col-6 col-12');
    	$('.play-button').on('click', function(){
    		toggleDisplay('.answer-wrapper');
    		state.round = 0;
    		state.correct = 0;
    		state.incorrect = 0;
    		tallyCorrect();
    		tallyIncorrect();
    		renderGamePlay();
    	});
    	$('.title').html(`We agreed on ${state.correct} out of 5`)
    	if(state.correct >= 3){
	  		var correctBackground = 
				`<div class="col-12">
					<div class="card">
						<div class="image-wrapper">
							<img class="answer-response" src="images/great_job.gif" alt="gif of a boy giving a thumbs up"/>
						</div>
					</div>
				</div>`	
			$('.line-up').html(correctBackground);
    	} else {
	  		var incorrectBackground = 
				`<div class="col-12">
					<div class="card">
						<div class="image-wrapper">
							<img class="answer-response" src="images/cannot_sit.gif" alt="gif of a girl not allowing you to sit with her"/>
						</div>
					</div>
				</div>`	
			$('.line-up').html(incorrectBackground);
    	}
    }

	function renderGamePlay(){
		toggleButton('.play-button', 'SUBMIT', 'submit-button');
		toggleDisplay('.instruct-title');
		$('.popup .p2').remove();
		shuffleCards();
		renderAnswers();
		var selectors = ['.correct.top','.correct.bottom','.incorrect','.line','.btn']
		$('.start .col-12.fmk').toggleClass('col-6 col-12');
		selectors.map((selector) => toggleDisplay(selector));
		state.correct = 0;
		state.incorrect = 0;
		$('.submit-button').on('click', function(){
			checkAnswers();
		})
	}

    function renderStart(){
		var randKeys = Object.keys(state.images);
		randKeys = randKeys.sort(() => .5 - Math.random()).slice(0,3);
		var cards = randKeys.map((key) => renderCards(state.images[key]));
		cards = cards.join("");
		$('.line-up').html(cards);
		$('.answer-box').addClass('hide-it');
		toggleDisplay('.instructions');
	}

	$('.play-button').on('click', function(){
		toggleDisplay('.instructions');
		renderGamePlay();
	})

	$('[data-popup-open]').on('click', function(e)  {
		var targeted_popup_class = $(this).attr('data-popup-open');
		$('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
		e.preventDefault();
	});

	$('[data-popup-close]').on('click', function(e)  {
		var targeted_popup_class = jQuery(this).attr('data-popup-close');
		$('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
		e.preventDefault();
	});

	renderStart()
});
