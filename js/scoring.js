///
///	code by Isaiah Smith
///
///	https://technostalgic.tech	
///	twitter @technostalgicGM
///

// enumerate all the different types of points earned
var scoreTypes = {
	none: -1,
	roll: 0,
	pop: 1,
	combo: 2,
	bonus: 3,
	roundEnd: 4,
	levelEnd: 5
};

// static class used for keeping track of and adjusting the current player's score
class scoring{
	static init(){
		// set the static scoring fields
		scoring.memorizedScore = null;
		scoring.memorizedBallScore = null;
	}
	
	static rememberScore(){
		// stores the score from the gameplay state so it can be accessed after the gamestate has ended (used 
		// while displaying most recent score in the scoreboard screen)
		scoring.memorizedScore = scoring.getCurrentScore();
		scoring.memorizedBallScore = scoring.getCurrentBallScore();
	}
	static getCurrentScore(){
		// retrieves the current score if available, otherwise gets the memorized score
		if(gameState.current instanceof state_gameplayState)
			return gameState.current.currentScore;
		return scoring.memorizedScore;
	}
	static getCurrentBallScore(){
		// retrieves the current score of the latest ball if available, otherwise gets the memorized ball score
		if(gameState.current instanceof state_gameplayState)
			return gameState.current.currentBallScore;
		return scoring.memorizedBallScore;
	}
	
	static addScore(points, splashPos = null, scoreType = scoreTypes.roll){
		// adds points to the current score
		gameState.current.currentScore += points;
		
		// keep track of the round score
		gameState.current.currentBallScore += points;
		gameState.current.updateScoreVisuals(points);
		
		// create a splash effect if there is a defined splash position
		if(splashPos)
			scoring.createScoreSplashEffect(points, splashPos, scoreType);
	}
	static createScoreSplashEffect(value, pos, scoreType = scoreTypes.roll){
		// creates splash text at the specified pos
		
		var style = scoring.getScoreStyle(value, scoreType);
		
		var time = 500 + Math.min(value * 2, 500);
		if(scoreType == scoreTypes.bonus)
			time += 250;
		
		var splash = splashText.build(value.toString(), pos, time, style, style.anim);
		splash.add();
	}
	static getScoreStyle(score, scoreType = scoreTypes.roll){
		// gets a textStyle appropriate for the specified score
		var style = textStyle.getDefault();
		var anim = null;
		
		switch(scoreType){
			case scoreTypes.roll:
				style.font = fonts.small;
				style.scale = 2;
				if(score >= 150){
					anim = new textAnim_rainbow(400, 0.1);
					style.color = textColor.green;
				}
				else if(score >= 50)
					style.color = textColor.cyan;
				break;
			case scoreTypes.pop:
				style.font = fonts.small;
				if(score >= 150)
					anim = new textAnim_rainbow(400, 0.1);
				else if(score >= 120)
					anim = new textAnim_blink(100, 0, textColor.yellow);
				if(score >= 100)
					style.scale = 2;
				if(score >= 80)
					style.color = textColor.green;
				else if(score >= 40)
					style.color = textColor.cyan;
				break;
			case scoreTypes.bonus:
				if(score >= 1000)
					anim = new textAnim_rainbow(400, 0.1);
				else if(score >= 750)
					anim = new textAnim_blink(300, 0.2, textColor.yellow);
				if(score >= 500)
					style.color = textColor.green;
				else if(score >= 100)
					style.color = textColor.cyan;
				break;
		}
		
		style.anim = anim;
		return style;
	}
}