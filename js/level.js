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
		
		this.tfTillBall = this.ballFrequency();
	}
	
	calculateTheme(){
		var dif = this.difficulty;
		
		// on the first level there will only be 3 colors
		var thm = [tubeColors.blue, tubeColors.green, tubeColors,gold];
		
		// on the other levels there will be atleast 4 colors or more
		if(dif >= 1) 
			thm = [tubeColors.orange, tubeColors.blue, tubeColors.green, tubeColors.gold];
		
		// on level 10 there will be all 5 colors in the theme
		if(dif >= 10)
			this.theme.splice(0, 0, tubeColors.grey);
		// on level 5 there will be only 4 colors but one of them will be replaced with grey, which yeilds the least points
		else if(dif >= 5)
			this.theme[Math.floor(Math.random() * this.theme.length - 1)] = tubeColors.grey;
		
		this.theme = thm;
		
		return this.theme
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
			if(math.random() >= 0.5)
				c = this.theme[Math.floor((this.theme.length - 1) * Math.random())];
		
		return this.theme[c];
	}
	getRandomPieces(count = 1){
		var r = [];
		while(count > 1){
			if(this.tfTillBall <= 0){
				this.tfTillBall = Math.max(this.ballFrequency, 1);
				r.push(tileform.getPiece_ball(this.getRandomColor()));
				continue;
			}
			
			let m = tileform.getPiece_random(this.getRandomColor());
			r.push(m);
			
			this.tfTillBall--;
			count--;
		}
		return r;
	}
}