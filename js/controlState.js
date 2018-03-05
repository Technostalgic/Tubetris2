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
		controlState.controlChangeListener = null;
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
	
	static keyCodeToName(code){
		//parses a keyCode and converts it into understandable text, used to display player controls
		if(code >= 65 && code <= 90)
			return String.fromCharCode(code);
		if(code >= 48 && code <= 57)
			return (code - 48).toString();
		if(code >= 96 && code <= 105)
			return "kp " + (code - 96).toString();
		switch(code){
			case -1: return ":::";
			case 0: return "none";
			case 8: return "backspc";
			case 13: return "enter";
			case 37: return "left arw";
			case 39: return "right arw";
			case 40: return "down arw";
			case 38: return "up arw";
			case 17: return "ctrl";
			case 16: return "shift";
			case 32: return "space";
			case 219: return "l brckt";
			case 221: return "r brckt";
			case 191: return "backslash";
			case 220: return "fwdslash";
			case 190: return "period";
			case 186: return "semicolon";
			case 222: return "apstrophe";
			case 188: return "comma";
		}
		return "key" + code.toString();
	}
	static setControls(controls){
		// sets the control bindings
		controlState.controls = controls;
	}
	static resetControlChangeListener(){
		window.removeEventListener("keydown", controlState.controlChangeListener);
		gameState.current.selectionFocus = false;
		//gameState.current.addButtons();
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