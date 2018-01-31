///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

var gameMode;

class gameState{
	constructor(){ }
	
	update(dt){ }
	draw(){ }
	
	static get current(){
		return gameMode;
	}
	static switchState(tostate){
		log("gameState switched from " + (
			gameState.current ? 
				gameState.current.constructor.name : 
				"UNDEFINED" )
			+ " to " + tostate.constructor.name, logType.notify);
			
		if(gameMode)
			gameMode.switchFrom(tostate);
		tostate.switchTo(gameMode);
		gameMode = tostate;
	}
	
	switchFrom(tostate = null){}
	switchTo(fromstate = null){}
}

class state_mainMenu extends gameState{
	constructor(){
		super();
	}
	
	update(dt){
		// updates the main menu
	}
	draw(){
		// draws the the main menu
		drawBackground();
		
		drawForegroundBorder();
	}
	
	switchFrom(tostate = null){
		
	}
	switchTo(fromstate = null){
		
	}
}