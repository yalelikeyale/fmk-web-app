'use strict'

// 
$(document).ready(function(){
	const GameState = {
		'awsBucket':'https://fmk-web-app.s3.us-west-2.amazonaws.com/',
		'round':0,
		'batches':[
		  'fast_food',
		  'cartoon_dads',
		  'french_fries',
		  'trump'
		],
		'category':[
		  'What could you eat for the rest of your life...',
		  'Best Cartoon Dad...',
		  'Choose your hangover fighter...',
		  'Best Trump impression...'
		],
		'correct':0,
		'incorrect':0,
		'correctCount':0,
		'nextQuestion':true, 
		'imgObjArray':[]
	}

	function toggleDisplay(selector){
		$(selector).toggleClass('hide-it')
	}

	function toggleButton(selector, value, className){
		$(selector).unbind('click');
		$(selector).attr({"value":value,"class":className});
	}

	function tallyCorrect(){
		$('.js-tally-correct').html(GameState.correct);
	}

	function tallyIncorrect(){
		$('.js-tally-incorrect').html(GameState.incorrect);
	}

    function checkAnswers(){
    	GameState.correctCount = 0;
    	$('.line-up').find('.card').each(function(){
    		var correct = $(this).find('.img').attr('data-answer');
    		correct = String(correct);
    		var userAnswer = $(this).find('.ui-droppable.answer-box.answered').text();
    		userAnswer = String(userAnswer);
    		userAnswer = userAnswer.trim();
    		if(userAnswer===''){
    			GameState.nextQuestion = false;
    		} else {
	    		if(correct.toLowerCase()===userAnswer.toLowerCase()){
	    			GameState.correctCount += 1;
	    		}
    		}
    	});
    	if(GameState.nextQuestion===true ){
    		if(GameState.correctCount===3){
				GameState.correct += 1;
				tallyCorrect()
				if(GameState.round===3){
					renderEnd();
				} else {
					shuffleCards();
    				renderAnswers();
				}
    		} else {
				GameState.incorrect += 1;
				tallyIncorrect();
				if(GameState.round===3){
					renderEnd();
				} else {
					shuffleCards();
    				renderAnswers();
				}
    		}
    	} else {
    		alert('I know this game can leave you choosing between a turdsandwich and a douche, but you have to choose all three.')
    		GameState.round -= 1;
    		GameState.correctCount = 0;
    		GameState.nextQuestion = true;
    		shuffleCards();
    		renderAnswers();
    	}
    }

	function renderCard(img){
		var card = 
			`<div class="col-4">
				<div class="card">
					<div class="image-wrapper">
					    // figure out how to reference aws s3 public objects from img src 
						<img class="img" data-answer="${img.answer}" src="${GameState.awsBucket}${img.img_file}" alt="${img.alt}"/>
					</div>
					<div class="droppable answer-box">
						<span class="description">${img.alt}</span>
						<p>Place your answer here!</p>
					</div>
				</div>
			</div>`	
        return card
        }

	function renderRandomBatch(randBatchData){
		var cards = randBatchData.map(card => {
			renderCard(card)
		});
		cards = cards.join("");
		$('.line-up').html(cards);
		$('.answer-box').addClass('hide-it');
		toggleDisplay('.instructions');
	}

	function renderShuffleBatch(shuffleBatchData){
		$('.title').html(GameState.category[GameState.round])
		var cards = shuffleBatchData.map(img => {
			var card = renderCard(img);
			return card
		})
		cards = cards.join("");
		$('.line-up').html(cards);
		GameState.round += 1;
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

	function fetchImgObjArray(batch_key, callback){
		const payload = {
			url:`${location.origin}/images/${batch_key}`,
			dataType:'json',
			error: function(error){
				console.log('error ' + JSON.stringify(error));
			},
			success: function(res){
				callback(res)
			}
		}
		$.get(payload)
	}

	function shuffleCards(){
		var batch_key = GameState.batches[GameState.round];
		fetchImgObjArray(batch_key, renderShuffleBatch)
	}

	function renderAnswers(){
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
    		GameState.round = 0;
    		GameState.correct = 0;
    		GameState.incorrect = 0;
    		tallyCorrect();
    		tallyIncorrect();
    		renderGamePlay();
    	});
    	$('.title').html(`We agreed on ${GameState.correct} out of 5`)
    	if(GameState.correct >= 3){
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
		GameState.correct = 0;
		GameState.incorrect = 0;
		$('.submit-button').on('click', function(){
			checkAnswers();
		})
	}

    function renderStart(){
		var batchKeys = GameState.batches
		var randBatch = batchKeys.sort(() => .5 - Math.random()).slice(0,1);
		fetchImgObjArray(randBatch, renderRandomBatch)
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
