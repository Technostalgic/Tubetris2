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
	
	static getRankSuffix(rank){
		// returns the correct rank suffix string (ie 'st' in '1st' or 'nd' in '2nd')
		switch(rank){
			case 1: return "st";
			case 2: return "nd";
			case 3: return "rd";
		}
		return "th";
	}
	static getRankStyle(rank){
		switch(rank){
			case 1: return textStyle.getDefault().setColor(textColor.yellow);
			case 2: return textStyle.getDefault().setColor(textColor.green);
			case 3: return textStyle.getDefault().setColor(textColor.cyan);
			case 4: return textStyle.getDefault().setColor(textColor.blue);
			case 5: return textStyle.getDefault().setColor(textColor.pink);
		}
		return null;
	}
	static getRankColorAnim(rank){
		switch(rank){
			case 1: return new textAnim_rainbow();
			case 2: return new textAnim_blink(500, 0.85, textColor.yellow);
			case 3: return new textAnim_blink(650, 0.15, textColor.light);
			case 4: return new textAnim_blink(800, 0.85, textColor.light);
			case 5: return new textAnim_blink(950, 0.15, textColor.light);
		}
		return null;
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
		
		var time = 450 + Math.min(value * 2, 500);
		if(scoreType == scoreTypes.bonus)
			time += 150;
		
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

// a data structure for maintaining combo information while the player is executing the combo
class scoreCombo{
	constructor(){
		this.comboID = 0;
		this.comboValue = 0;
		this.comboThreshold = 3;
		this.comboPointValue = 0;
	}
	
	static fromComboID(comboID){
		switch(comboID){
			case floatingScoreFieldID.bombCombo:
				return new combo_bombs();
			case floatingScoreFieldID.coinCombo:
				return new combo_coins();
		}
		return new scoreCombo();
	}
	
	addValue(val = 1){
		// adds to what number of extent the combo has been executed
		this.comboValue += val;
		if(this.comboValue < this.comboThreshold)
			return;
		
		this.updatePointValue();
		this.updateFloatingTexts();
	}
	updatePointValue(){
		// updates how much points the whole combo is worth to the player
		this.comboPointValue = this.comboValue * 100;
	}
	updatefloatingTexts(){}
	
	cashIn(){
		// gives the player the amount of points that the combo is worth
		scoring.addScore(this.comboPointValue);
	}
}

// the combo structure for detonating multiple bombs with one ball
class combo_bombs extends scoreCombo{
	constructor(){
		super();
		this.comboID = floatingScoreFieldID.bombCombo;
	}
	
	updatePointValue(){
		var mult;
		if(this.comboValue < 4)
			mult = 200;
		else if(this.comboValue < 5)
			mult = 250;
		else mult = 300;
		
		// if 5 bombs are detonated in one go, all the bricks are converted to bombs
		if(this.comboValue == 4)
			gameState.current.phase.brickBombs = true;
		
		this.comboPointValue = mult * this.comboValue;
	}
	updateFloatingTexts(){
		var str1 = this.comboValue.toString() + "x Chain Reaction!";
		var str2 = this.comboPointValue.toString() + " pts";
		var str3 = null;
		
		if(this.comboValue >= 5)
			str3 = "Brick Bombs!";
		
		var anim = new textAnim_blink(250, 0, textColor.yellow);
		var style = new textStyle(fonts.large, textColor.red);
		gameState.current.setFloatingScoreField(str1, style, floatingScoreFieldID.bombCombo, anim);
		gameState.current.setFloatingScoreField(str2, style, floatingScoreFieldID.bombComboPts, anim);
		if(str3) 
			gameState.current.setFloatingScoreField(str3, style, floatingScoreFieldID.bombComboBonus, anim);
	}
}

// the combo structure for collecting multiple coins with one ball
class combo_coins extends scoreCombo{
	constructor(){
		super();
		this.comboID = floatingScoreFieldID.coinCombo;
		this.comboThreshold = 2;
	}

	updatePointValue(){
		var val = 0;
		
		// adds an extra ball if 5 coins are collected
		if(this.comboValue == 5)
			gameState.current.nextTileforms.splice(0, 0, tileform.getPiece_ball(gameState.current.currentLevel.getRandomColor()));
		
		// adds an extra gold ball if 10 coins are collected
		else if(this.comboValue == 10)
			gameState.current.nextTileforms.splice(0, 0, tileform.getPiece_ball(balls.gold));
		
		// adds detPack if 15 coins are collected
		else if(this.comboValue == 15)
			gameState.current.nextTileforms.splice(0, 0, tileform.getPiece_detPack());
		
		if(this.comboValue >= 10)
			val = 2250 * Math.floor(this.comboValue / 5);
			
		this.comboPointValue = val;
	}
	updateFloatingTexts(){
		var anim = new textAnim_blink(250, 0, textColor.light);
		var style = new textStyle(fonts.large, textColor.yellow);
		var str1 = this.comboValue.toString() + "x Coins";
		for(let i = Math.floor(this.comboValue / 5); i > 0; i--)
			str1 += "!";
		
		var str2 = null;
		var str3 = null;
		var anim2 = anim;
		if(this.comboValue >= 5){
			str3 = "extra ball!";
		}
		if(this.comboValue >= 10){
			str3 = "extra gold ball!!";
		}
		if(this.comboValue >= 15){
			str3 = "det-pack gained!!!";
		}
		if(this.comboPointValue > 0){
			str2 = this.comboPointValue + " pts";
			if(this.comboValue >= 15){
				str2 += "! Mamma Mia!";
				anim2 = new textAnim_compound([
					new textAnim_blink(250, 0.1, textColor.red),
					new textAnim_blink(250, 0.2, textColor.blue),
					new textAnim_yOffset()
				]);
			}
		}

		gameState.current.setFloatingScoreField(str1, style, floatingScoreFieldID.coinCombo, anim);
		
		if(str3 != null)
			gameState.current.setFloatingScoreField(str3, style, floatingScoreFieldID.coinComboBonus, anim);
		
		if(str2 != null)
			gameState.current.setFloatingScoreField(str2, style, floatingScoreFieldID.coinComboPts, anim2);
		
	}
}