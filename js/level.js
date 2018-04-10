///
///	code by Isaiah Smith
///
///	https://technostalgic.tech	
///	twitter @technostalgicGM
///

class level{
	constructor(difficulty){
		this.difficulty = difficulty;
		this.calculateTheme();
		this.calculateBlockFrequency();
		this.calculateIncrementors();
		
		this.goldLikenessInterval = 0;
		this.tfTilBall = this.ballFrequency;
	}
	
	calculateIncrementors(){
		// calculates the amount of tiles that need to be placed in order to progress to the next level
		this.tfTilProgression = 50 + this.difficulty * 5;

		// calculate how quickly the tileform will drop
		this.tfDropInterval = Math.max(200, 1000 - 40 * this.difficulty);
		if(this.difficulty > 20)
			this.tfDropInterval = Math.max(150, this.tfDropInterval - (this.difficulty - 20) * 10);
	}
	calculateTheme(){
		var dif = this.difficulty;
		
		// on the first level there will only be 1 color
		var thm = [tubeColors.blue];
		
		// on the levels 2 - 4 there will be 2 colors
		if(dif > 1) 
			thm = [tubeColors.blue, tubeColors.green];
		
		// on levels 5 and above there will be 3 or more colors
		if(dif >= 5)
			thm = [tubeColors.orange, tubeColors.blue, tubeColors.green];

		// on level 15 there will be all 4 colors in the theme
		if(dif >= 15)
			this.theme.splice(0, 0, tubeColors.grey);
		// on levels after 5 there will be only 3 colors but one of them will be replaced with grey, which yeilds the least points
		else if(dif > 5)
			this.theme[Math.floor(Math.random() * this.theme.length)] = tubeColors.grey;
		
		this.goldFrequency = 0.2 / (1 + this.difficulty / 5);
		
		this.theme = thm;
		return this.theme;
	}
	calculateBlockFrequency(){
		var dif = this.difficulty;
		this.bombFrequency = 0.2;
		this.brickFrequency = 0;
		this.ballFrequency = 5;
		
		// higher brick frequency as level difficulty increases
		this.brickFrequency = Math.min(dif - 1 / 40, 0.25);
		if(this.brickFrequency >= 20)
			this.brickFrequency = 0.3;
		
		// lower bomb frequency as level difficulty progresses
		if(dif > 5)
			bombFrequency -= 0.01;
		if(dif > 10)
			bombFrequency -= 0.025;
		if(dif > 15)
			bombFrequency -= 0.04
		
		// lower ball frequency as level difficulty increases (ball frequency variable represents 
		// the amount of tileforms between each ball)
		this.ballFrequency += Math.round((dif - 1) / 2);
		this.ballFrequency = Math.min(this.ballFrequency, 16);
		
	}
	
	getRandomColor(){
		// returns a random color in the theme
		var c = this.theme[Math.floor(this.theme.length * Math.random())];
		
		// make tubeColors.gold appear half as often as the others
		if(c == this.theme.length - 1)
			if(Math.random() >= 0.5)
				c = this.theme[Math.floor((this.theme.length - 1) * Math.random())];
		
		// return gold if the player gets lucky
		var gc = this.goldFrequency * (1 + this.goldLikenessInterval);
		if(gc >= Math.random()){
			this.goldLikenessInterval = 0;
			return tubeColors.gold;
		}
		else this.goldLikenessInterval += this.goldFrequency;
		
		return c;
	}
	getRandomPieces(count = 1){
		var r = [];
		while(count > 0){
			if(this.tfTilBall <= 0){
				this.tfTilBall = Math.max(this.ballFrequency, 1);
				r.push(tileform.getPiece_ball(this.getRandomColor()));
				continue;
			}
			
			let m = tileform.getPiece_random(this.getRandomColor());
			m.setColor(this.getRandomColor());
			r.push(m);
			
			this.tfTilProgression--;
			this.tfTilBall--;
			count--;
		}
		return r;
	}

	getNextLevel(){
		return new level(this.difficulty + 1);
	}
	completeLevel(parentState){
		var next = this.getNextLevel();
		parentState.currentLevel = next;
	}
}