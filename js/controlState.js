///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

// enumerates all the different actions performed by triggering a control
var controlAction = {
	none: -1,
	left: 0,
	right: 1,
	up: 2,
	down: 3,
	quickDrop: 4,
	nudgeDown: 5,
	rotateCW: 6,
	rotateCCW: 7,
	select: 8,
	pause: 9
}

class controlState{
	static init(){
		log("initializing controlState...");
		controlState.keys = [];
		controlState.mouseDown = false;
	}
	
	static listenForKeyDown(e){
		if(!e.keyCode) return;
		controlState.keys[e.keyCode] = true;
		
		var a = controlState.getControlsForKey(e.keyCode);
		for(var i = a.length - 1; i >= 0; i--){
			log("control " + a[i] + " pressed", logType.notify);
			gameState.current.controlTap(a[i]);
		}
	}
	static listenForKeyUp(e){
		if(!e.keyCode) return;
		controlState.keys[e.keyCode] = false;
	}
	
	static isKeyDown(keyCode){
		return(!!controlState.keys[keyCode]);
	}
	static isControlDown(action = controlAction.none){
		switch(action){
			case controlAction.none: return false;
			case controlAction.left: return controlState.isKeyDown(controls.left);
			case controlAction.right: return controlState.isKeyDown(controls.right);
			case controlAction.up: return controlState.isKeyDown(controls.up);
			case controlAction.down: return controlState.isKeyDown(controls.down);
			case controlAction.quickDrop: return controlState.isKeyDown(controls.quickDrop);
			case controlAction.nudgeDown: return controlState.isKeyDown(controls.nudgeDown);
			case controlAction.rotateCW: return controlState.isKeyDown(controls.rotateCW);
			case controlAction.rotateCCW: return controlState.isKeyDown(controls.rotateCCW);
			case controlAction.select: return controlState.isKeyDown(controls.select);
			case controlAction.pause: return controlState.isKeyDown(controls.pause);
		}
		return false;
	}
	
	static getAllControls(){
		return [
			controls.left,
			controls.right,
			controls.up,
			controls.down,
			controls.quickDrop,
			controls.nudgeDown,
			controls.rotateCW,
			controls.rotateCCW,
			controls.select,
			controls.pause
		];
	}
	static getControlsForKey(keycode){
		var r = [];
		
		for(var i in controls)
			if(controls[i] == keycode)
				r.push(controlAction[i]);
			
		return r;
	}
}