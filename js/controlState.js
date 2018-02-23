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
		// initializes the static fields of controlState
		log("initializing controlState...");
		controlState.keys = [];
		controlState.mouseDown = false;
		controlState.mousePos = new vec2();
		controlState.controls = {};
	}
	
	static listenForMouseMove(e){
		// the event listener that is triggered when the mouse is moved
		controlState.mousePos = new vec2(e.offsetX, e.offsetY);
		gameState.current.mouseMove(controlState.mousePos);
	}
	static listenForMouseDown(e){
		// the event listener that is triggered when the mouse is pressed
		controlState.mouseDown = true;
		gameState.current.mouseTap(controlState.mousePos);
	}
	static listenForMouseUp(e){
		// the event listener that is triggered when the mouse is released
		controlState.mouseDown = false;
	}
	static listenForKeyDown(e){
		// the event listener that is triggered when a keyboard key is pressed
		if(!e.keyCode) return;
		controlState.keys[e.keyCode] = true;
		
		var a = controlState.getControlsForKey(e.keyCode);
		for(var i = a.length - 1; i >= 0; i--){
			gameState.current.controlTap(a[i]);
		}
	}
	static listenForKeyUp(e){
		// the event listener that is triggered when a keyboard key is released
		if(!e.keyCode) return;
		controlState.keys[e.keyCode] = false;
	}
	
	static isKeyDown(keyCode){
		// checks to see if a key is currently pressed
		return(!!controlState.keys[keyCode]);
	}
	static isControlDown(action = controlAction.none){
		// checks to see if a control action is currently being triggered
		switch(action){
			case controlAction.none: return false;
			case controlAction.left: return controlState.isKeyDown(controlState.controls.left);
			case controlAction.right: return controlState.isKeyDown(controlState.controls.right);
			case controlAction.up: return controlState.isKeyDown(controlState.controls.up);
			case controlAction.down: return controlState.isKeyDown(controlState.controls.down);
			case controlAction.quickDrop: return controlState.isKeyDown(controlState.controls.quickDrop);
			case controlAction.nudgeDown: return controlState.isKeyDown(controlState.controls.nudgeDown);
			case controlAction.rotateCW: return controlState.isKeyDown(controlState.controls.rotateCW);
			case controlAction.rotateCCW: return controlState.isKeyDown(controlState.controls.rotateCCW);
			case controlAction.select: return controlState.isKeyDown(controlState.controls.select);
			case controlAction.pause: return controlState.isKeyDown(controlState.controls.pause);
		}
		return false;
	}
	
	static setControls(controls){
		// sets the control bindings
		controlState.controls = controls;
	}

	static getAllControls(){
		// returns a list of all the keys currently bound to control actions
		return [
			controlState.controls.left,
			controlState.controls.right,
			controlState.controls.up,
			controlState.controls.down,
			controlState.controls.quickDrop,
			controlState.controls.nudgeDown,
			controlState.controls.rotateCW,
			controlState.controls.rotateCCW,
			controlState.controls.select,
			controlState.controls.pause
		];
	}
	static getControlsForKey(keycode){
		// returns all the control actions currently bound to a specified key
		var r = [];
		
		for(var i in controlState.controls)
			if(controlState.controls[i] == keycode)
				r.push(controlAction[i]);
			
		return r;
	}
}