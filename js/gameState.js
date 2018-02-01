///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

var gameMode;

class gameState{
	constructor(){ 
		this.timeElapsed = 0;
	}
	
	update(dt){
		this.timeElapsed += dt;
	}
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
	
	controlTap(control = controlAction.none){}
	controlDown(control = controlAction.none){}
}

class state_mainMenu extends gameState{
	constructor(){
		super();
	}
	
	update(dt){
		// updates the main menu
		super.update(dt);
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
	
	controlTap(control = controlAction.none){
		
	}
	controlDown(control = controlAction.none){
		
	}
}