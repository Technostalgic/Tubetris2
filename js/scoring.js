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
	combo: 1,
	bonus: 2,
	roundEnd: 3,
	levelEnd: 4
};

// static class used for keeping track of and adjusting the current player's score
class scoring{
	static init(){
		// set the static scoring fields
		scoring.memorizedScore = null;
	}
	
	static rememberScore(){
		// stores the score from the gameplay state so it can be accessed after the gamestate has ended (used 
		// while displaying most recent score in the scoreboard screen)
		scoring.memorizedScore = scoring.getCurrentScore();
	}
	static getCurrentScore(){
		// retrieves the current score, if available, otherwise gets the memorized score
		if(gameState.current instanceof state_gameplayState)
			return gameState.current.currentScore;
		return scoring.memorizedScore;
	}
	
	static addScore(points, splashPos = null, scoreType = null){
		// adds points to the current score
		
	}
	static createScoreSplashEffect(value, pos, scoreType = 0){
		// creates splash text at the specified pos
		var splash = splashText.build(value.toString(), pos);
		splash.add();
	}
}