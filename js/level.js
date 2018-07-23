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
		this.isOver = false;
	}
	
	calculateIncrementors(){
		// calculates the amount of tiles that need to be placed in order to progress to the next level
		this.tfTilProgression = 15 + this.difficulty * 5;

		// calculate how quickly the tileform will drop
		this.tfDropInterval = Math.max(200, 1000 - 40 * this.difficulty);
		if(this.difficulty > 20)
			this.tfDropInterval = Math.max(150, this.tfDropInterval - (this.difficulty - 20) * 10);
	}
	calculateTheme(){
		// calculates the different tube colors that the level will use
		var dif = this.difficulty;
		
		// on the first level there will only be 1 color
		var thm = [tubeColors.blue];
		
		// on the levels 2 - 4 there will be 2 colors, but blue will be the most common
		if(dif > 1) 
			thm = [tubeColors.blue, tubeColors.blue, tubeColors.green];
		
		// on levels 5 and above there will be 3 or more colors, but blue will be the most common
		if(dif >= 5)
			thm = [tubeColors.blue, tubeColors.blue, tubeColors.red, tubeColors.green];

		// on level 15 there will be all 4 colors in the theme
		if(dif >= 15)
		thm.splice(0, 0, tubeColors.grey);
	
		// on levels after 5 there will be only 3 colors but one of them will be replaced with grey, which yeilds the least points
		else if(dif > 5){
			thm.splice(0, 1);
			thm[Math.floor(Math.random() * thm.length)] = tubeColors.grey;
		}
		
		this.goldFrequency = 0.2 / (1 + this.difficulty / 5);
		
		this.theme = thm;
		return this.theme;
	}
	calculateBlockFrequency(){
		// calculates the level's frequency that the different types of blocks appear
		var dif = this.difficulty;
		this.bombFrequency = 0.15;
		this.brickFrequency = 0;
		this.ballFrequency = 5;
		this.itemFrequency = 0.15;
		
		// higher brick frequency as level difficulty increases
		this.brickFrequency = Math.min((dif - 1) / 100, 0.175);
		if(this.brickFrequency >= 20)
			this.brickFrequency = 0.2;
		
		// lower bomb frequency as level difficulty progresses
		if(dif > 5)
			this.bombFrequency = 0.135;
		else if(dif > 10)
			this.bombFrequency = 0.125;
		else if(dif > 15)
			this.bombFrequency = 0.10;
		
		// lower ball frequency as level difficulty increases (ball frequency variable represents 
		// the amount of tileforms between each ball)
		this.ballFrequency += Math.round((dif - 1) / 2);
		this.ballFrequency = Math.min(this.ballFrequency, 16);
		
	}
	
	getDifficultyColor(){
		if(this.difficulty >= 20) return textColor.red;
		if(this.difficulty >= 10) return textColor.yellow;
		if(this.difficulty >= 5) return textColor.cyan;
		return textColor.light;
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
		// returns a random set of tileforms that adhere to the level's theme
		// returns nothing if level is over
		if(this.isOver) return [];
		var r = [];
		
		// iterates until the count reaches zero
		while(count > 0){
			// if the level is over or on the last piece, break the loop
			if(this.tfTilProgression <= 1) break;
			
			// pushes a ball object to the set if the ball countdown is completed
			if(this.tfTilBall <= 0){
				this.tfTilBall = Math.max(this.ballFrequency, 1);
				r.push(tileform.getPiece_ball(this.getRandomColor()));
				continue;
			}
			
			// define deciding variables
			let m;
			let blf = this.bombFrequency + this.brickFrequency;
			let fd = Math.random();
			
			// allows 'm' to be set to a randomly selected piece according to the specified block frequency values 
			// for this level
			if(fd <= blf){
				if(fd <= this.bombFrequency) m = tileform.getPiece_bomb();
				else m = tileform.getPiece_brick();
			}
			else
				m = tileform.getPiece_random(this.getRandomColor());
			
			if(m.hasEntityType(entities.tube)){
				m.setColor(this.getRandomColor());
				if(Math.random() <= this.itemFrequency)
					m.tiles[Math.floor(Math.random() * m.tiles.length)].setItem(item.getItem_random())
			}
			
			
			r.push(m);
			
			// decrement the counter variables
			this.tfTilProgression--;
			this.tfTilBall--;
			count--;
		}
		if(count > 0 && this.tfTilProgression == 1){
			r.push(tileform.getPiece_ball(balls.gold));
			this.tfTilProgression--;
			this.tfTilBall--;
			count--;
		}
		if(this.tfTilProgression <= 0)
			this.isOver = true;
		return r;
	}

	getNextLevel(){
		return new level(this.difficulty + 1);
	}
	completeLevel(parentState){
		audioMgr.playSound(sfx.levelUp);
		var next = this.getNextLevel();
		parentState.currentLevel = next;
	}
}