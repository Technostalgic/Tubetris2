///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

///
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }Global variables{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
var debug = true;
	localStorageEnabled = true;
	timeElapsed = 0;
	
var config = {},
	scores = {};
	
var fonts = {},
	gfx = {},
	sfx = {};
	
// canvas and contexts
var renderTarget,
	scalingTarget;
var renderContext,
	scalingContext;
var screenBounds;

// sets the keys that are used to retrieve saved information in localStorage
var storageKeys = {
	config: "technostalgic_tubetris2_config",
	controls: "technostalgic_tubetris2_keybind",
	scoreboard: "technostalgic_tubetris2_scores"
};
///
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }Global enumerators{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
// enumerates the different styles that console logs can be
var logType = {
	log: 0,
	error: 1,
	success: 2,
	notify: 3,
	unimportant: 4
}
///
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }Global functions{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function log(obj, type = logType.log){
	// logs the spcified object to the console
	if(!debug) return;
	var ob = obj || "console logged @" + timeElapsed + "ms";
	
	// sets the console styling if the object is stylable (if it's a string)
	var style;
	if(ob.constructor.name == "String"){
		ob = "%c" + ob;
		
		style = "color: #222; background-color: #ddd";
		switch(type){
			case logType.log:
				style = "color: #000; background-color: #fff"; 
				break;
			case logType.error:
				style = "color: #f00; background-color: #fdd";  
				break;
			case logType.success:
				style = "color: #0b0; background-color: #efe";  
				break;
			case logType.notify:
				style = "color: #00d; background-color: #fff";  
				break;
			case logType.unimportant:
				style = "color: #999; background-color: #fff";  
				break;
		}
	}
	
	if(style) console.log(ob, style);
	else console.log(ob);
}
function loadFont(assetname, filename, charsize, colorVariants = 8){
	// downloads the specified font image to the client and puts it into a textRenderer container with the specified data
	
	var out = "load font '" + filename + "'... ";
	
	var r = new Image();
	var f = new textRenderer(r, charsize, colorVariants);
	
	r.onload = function(e){ this.loadedState = 1; f.loadedState = 1; };
	r.onerror = function(e){ this.loadedState = e; f.loadedState = e; };
	r.src = "gfx/" + filename;
	
	fonts[assetname] = f;
	log(out, logType.unimportant);
	return r;
}
function loadGraphic(assetname, filename){
	// downloads the specified image asset to the client
	
	var out = "load graphic '" + filename + "'... ";
	
	var r = new Image();
	r.onload = function(e){ this.loadedState = 1; };
	r.onerror = function(e){ this.loadedState = e; };
	r.src = "gfx/" + filename;
	gfx[assetname] = r;
	
	log(out, logType.unimportant);
	return r;
}
function loadSound(assetname, filename){
	// downloads the specified sound asset to the client
	
	var out = "load sound '" + filename + "'... ";
	
	var r = new Audio("sfx/" + filename);
	r.oncanplay = function(e){ this.loadedState = 1; };
	r.onerror = function(e){ this.loadedState = e; };
	sfx[assetname] = r;
	
	log(out, logType.unimportant);
	return r;
}

function clearScreen(color = "#aaa"){
	// clears the screen to a solid color
	
	renderContext.fillStyle = color;
	scalingContext.fillStyle = color;
	
	renderContext.fillRect(0, 0, renderTarget.width, renderTarget.height);
	scalingContext.fillRect(0, 0, scalingTarget.width, scalingTarget.height);
}
function printScreen(){
	// prints the rendering canvas onto the main canvas so it can be scaled to fit the screen
	scalingContext.drawImage(renderTarget, 0, 0, scalingTarget.width, scalingTarget.height);
}

function printImage(ctx, img, pos, sprite = null, scale = 1){
	if(!sprite)
		sprite = new spriteBox(new vec2, new vec2(img.width, img.height));
	
	ctx.drawImage(
		img,
		sprite.left, sprite.top,
		sprite.width, sprite.height,
		pos.x, pos.y,
		sprite.width * scale, sprite.height * scale
		);
}
function drawImage(ctx, img, pos, sprite = null, scale = 1){
	// draws an image onto the specifed context
	if(!sprite)
		sprite = new spriteBox(new vec2, new vec2(img.width, img.height));
	
	ctx.drawImage(
		img,
		sprite.left, sprite.top,
		sprite.width, sprite.height,
		pos.x, pos.y,
		sprite.width * scale, sprite.height * scale
		);
}
function drawCenteredImage(ctx, img, pos, sprite = null, scale = 1, rotation = 0){
	// draws an image onto the specifed context
	if(!sprite)
		sprite = new spriteBox(new vec2, new vec2(img.width, img.height));
	var cCorrect = sprite.size.multiply(-0.5);
	
	// sets the context transformation to allow rotation
	ctx.translate(pos.x, pos.y);
	ctx.rotate(angle);
	
	ctx.drawImage(
		img,
		sprite.left, sprite.top,
		sprite.width, sprite.height,
		cCorrect.x, cCorrect.y,
		sprite.width * scale, sprite.height * scale
		);
	
	// resets the context transformation
	ctx.rotate(-angle);
	ctx.translate(-pos.x, -pos.y);
}

function drawArrow(pos, dir = side.right){
	// renders a blinking arrow at the specified position and facing the specified direction
	var blinkRate = 500;
	var isBlinking = gameState.current.timeElapsed % blinkRate >= blinkRate / 2;
	
	var ssize = 16;
	var spos = new vec2(ssize * (dir - 1), isBlinking ? 16 : 0);
	var sprite = new spriteBox(spos, new vec2(ssize));
	
	drawImage(renderContext, gfx.arrows, pos.minus(new vec2(ssize / 2)), sprite);
}
///
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }High-Level functions{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function init(){
	// initializes the game
	log("initializing game @" + performance.now().toString() + "ms...", logType.notify);
	
	localStorageCheck();
	
	getCanvas();
	addInputEventListeners();
	
	controlState.init();
	tile.init();
	
	loadAssets();
	loadConfig();
	loadControls();
	loadScores();

	gameState.switchState(new state_mainMenu());	
	log("intitialized game!");
}

function loadAssets(){
	// downloads and prepares all the assets needed from the server
	loadFonts();
	loadGFX();
	loadSFX();
	
	log("waiting for assets to finish downloading... ");
	// enters a recursive callback to check to see if the assets are finished loading 
	// a few times per second, when they are finished, finishLoading() is called
	assetLoadingFinishCheck()
}
function loadFonts(){
	// downloads all the needed font spritesheets from the server and parses them into a textRenderer container
	log("loading fonts... ")
	fonts = {};
	
	loadFont("small", "font_small.png", new vec2(12, 8), 8);
	loadFont("large", "font_large.png", new vec2(18, 32), 8);
	
	// set individual character widths for each font
	fonts.large.setSpecificCharacterWidths({
		'1': 14,
		'!': 12,
		':': 12,
		' ': 6,
		'j': 16
	});
	fonts.small.setSpecificCharacterWidths({
		'0': 9,
		'1': 7,
		'2': 9,
		'3': 9,
		'4': 10,
		'5': 10,
		'6': 9,
		'7': 9,
		'8': 9,
		'9': 9,
		'!': 5,
		':': 5,
		'-': 9,
		' ': 4,
		'a': 10,
		'b': 9,
		'c': 9,
		'd': 10,
		'e': 9,
		'f': 7,
		'g': 10,
		'h': 10,
		'i': 7,
		'j': 9,
		'k': 10,
		'l': 8,
		'm': 12,
		'n': 11,
		'o': 11,
		'p': 10,
		'q': 11,
		'r': 10,
		's': 9,
		't': 9,
		'u': 10,
		'v': 10,
		'w': 12,
		'x': 12,
		'y': 11,
		'z': 10
	});
	
	log(Object.keys(fonts).length.toString() + " fonts indexed", logType.notify);
}
function loadGFX(){
	// downloads all the needed graphics from the server to the client
	log("loading graphics... ")
	gfx = {};
	
	loadGraphic("tiles_empty", "tiles_empty.png");
	loadGraphic("tiles_tubes", "tiles_tubes.png");
	loadGraphic("tiles_blocks", "tiles_blocks.png");
	loadGraphic("balls", "balls.png");
	loadGraphic("arrows", "arrows.png");
	
	log(Object.keys(gfx).length.toString() + " images indexed", logType.notify);
}
function loadSFX(){
	// downloads the all the needed sound effects from the server to the client
	log("loading sound effects... ");
	sfx = {};
	
	// load sounds
	loadSound("moveCursor", "moveCursor.wav");
	loadSound("select", "select.wav");
	
	log(Object.keys(sfx).length.toString() + " sounds indexed", logType.notify);
}
function loadConfig(){
	// loads the game configuration from localStorage
	log("loading game configuration... ");
	
	setDefaultConfig();
	if(!localStorageEnabled){
		log("localStorage is not enabled", logType.error);
		return;
	}
	
	var cStr = localStorage.getItem(storageKeys.config);
	if(!cStr) {
		log("no configuration settings found, using default", logType.notify);
		return;
	}
	
	var splCStr = cStr.split('\n');
	splCStr.forEach(function(cOp){
		let splOp = cOp.split(':');
		if(splOp.length <= 1) return;
		switch(splOp[0]){
			case "animText":
				config.animText = splOp[1][0] == 't';
				break;
			case "animSpeed": 
				config.animSpeed = Number.parseFloat(splOp[1]);
				break;
			case "volume_music": 
				config.volume_music = Number.parseFloat(splOp[1]);
				break;
			case "volume_sound": 
				config.volume_sound = Number.parseFloat(splOp[1]);
				break;
			case "imageSmoothing": 
				config.imageSmoothing = splOp[1][0] == 't';
				break;
			case "saving": 
				config.saving = splOp[1][0] == 't';
				break;
			case "arrowIndicators":
				config.arrowIndicators = splOp[1][0] == 't';
				break;
			case "pathIndicators":
				config.pathIndicators = splOp[1][0] == 't';
				break;
		}
		log(splOp[0] + " = " + config[splOp[0]], logType.unimportant);
	});
	applyConfig();
	log("loaded!", logType.success);
}
function loadControls(){
	// loads the controlState.controls from localStorage
	log("loading controls... ");
	setDefaultControls();
	
	if(!localStorageEnabled){
		log("localStorage is not enabled", logType.error);
		return;
	}
	
	var cStr = localStorage.getItem(storageKeys.controls);
	if(!cStr) {
		log("no controls settings found, using default", logType.notify);
		return;
	}
	
	var c = {};
	var splCStr = cStr.split('\n');
	splCStr.forEach(function(cOp){
		let splOp = cOp.split(':');
		if(splOp.length <= 1) return;
		c[splOp[0]] = Number.parseInt(splOp[1]);
	});
	
	controlState.setControls(c);
	log(splCStr.length - 1 + " controls loaded", logType.unimportant);
}
function loadScores(){
	// loads the scoreboard data from localStorage
	log("loading scores... ");
	
	var r = [];
	if(!localStorageEnabled){
		log("localStorage is not enabled", logType.error);
		setDefaultScores();
		return;
	}
	
	var data = localStorage.getItem(storageKeys.scoreboard);
	if(!data){
		// returns if there is no score data
		log("no score data found, reverting to default", logType.unimportant);
		setDefaultScores();
		return;
	}
	
	var splData = data.split('\n');
	splData.forEach(function(score, i){
		let splScore = score.split(':');
		if(splScore.length < 2) return;
		
		let sCap = { name: splScore[0], score: parseInt(splScore[1]) };
		r.push(sCap);
	});
	
	scores = r;
	log(r.length + " scores loaded", logType.unimportant);
}

function localStorageCheck(){
	// checks to see if the browser is able to store and load data from localStorage
	log("testing to see if localStorage is enabled...", logType.notify);
	try{
		localStorage.setItem("technostalgic_test", true);
		localStorageEnabled = localStorage.getItem("technostalgic_test");
		log("browser localStorage is enabled!", logType.success);
	}
	catch(e){
		localStorageEnabled = false;
		log("browser localStorage is disabled by user", logType.error);
	}
}
function saveConfig(){
	// saves the game configuration to localStorage
	log("saving game configuration... ", logType.notify);
	if(!localStorageEnabled){
		log("localStorage is not enabled", logType.error);
		return;
	}
	
	var cStr = "";
	Object.keys(config).forEach(function(key){
		var op = key + ":" + config[key].toString();
		cStr += op + "\n";
	});
	localStorage.setItem(storageKeys.config, cStr);
	
	log("saved!", logType.success);
}
function saveControls(){
	// saves the game controls to the browser's localStorage
	log("saving game controls... ", logType.notify);
	if(!localStorageEnabled){
		log("localStorage is not enabled", logType.error);
		return;
	}
	
	var cStr = "";
	Object.keys(controlState.controls).forEach(function(key){
		var op = key + ":" + controlState.controls[key];
		cStr += op + "\n";
	});
	localStorage.setItem(storageKeys.controls, cStr);
	
	log("saved!", logType.success);
}
function saveScores(){
	// saves the scoreboard data to localStorage
	log("saving scoreboard scores...", logType.notify);	
	if(!localStorageEnabled){
		log("localStorage is not enabled", logType.error);
		return;
	}
	
	var dataStr = ""; 
	scores.forEach(function(score, i){
		let sStr = score.name + ":" + score.score.toString();
		dataStr += sStr + '\n';
	});
	localStorage.setItem(storageKeys.scoreboard, dataStr);
	
	log("saved!", logType.success);
}

function setDefaultConfig(){
	// sets the default game configuration settings
	config = {
		animText: true,
		animSpeed: 1,
		volume_music: 1,
		volume_sound: 1,
		imageSmoothing: false,
		saving: true,
		arrowIndicators: true,
		pathIndicators: false
	};
}
function setDefaultControls(){
	// sets the default game controlState.controls
	controlState.setControls(getDefaultControls());
}
function getDefaultControls(){
	return {
		left: 37,
		right: 39,
		up: 38,
		down: 40,
		quickDrop: 0,
		nudgeDown: 40,
		rotateCW: 38,
		rotateCCW: 0,
		select: 32,
		pause: 13
	};
}
function setDefaultScores(){
	scores = getDefaultScores();
}
function getDefaultScores(){
	return [
		{name: "Top Dog", score: 250000},
		{name: "Harry", score: 100000},
		{name: "Middle Dog", score: 50000},
		{name: "Greg", score: 10000},
		{name: "Bottom Dog", score: 1000}
	];
}
function addInputEventListeners(){
	//window.addEventListener('keydown', function(e){ log("key '" + e.key + "'(" + e.keyCode + ") pressed", logType.notify); });
	scalingTarget.addEventListener('mousedown', controlState.listenForMouseDown);
	scalingTarget.addEventListener('mouseup', controlState.listenForMouseUp);
	scalingTarget.addEventListener('mousemove', controlState.listenForMouseMove);
	window.addEventListener('keydown', controlState.listenForKeyDown);
	window.addEventListener('keyup', controlState.listenForKeyUp);
}
function preventKeyScrolling(){
	// prevents arrow key / space scrolling on the web page
	window.addEventListener("keydown", function(e) {
		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	}, false);
	window.addEventListener("touchmove", function(e) {
		e.preventDefault();
	}, false);
}

function generateDynamicTextures(){
	// generates all the textures that need to be created dynamically
	log("generating dynamic textures...");
	
	generateBackground();
	generateForeground_border();
	generateForeground_overlay();
	
	log("finished generating dynamic textures! @" + performance.now() + "ms", logType.success);
}
function generateBackground(){
	// generates the dark tile texture that is drawn in the background
	log("generating background texture...", logType.unimportant);
	
	var bg = document.createElement("canvas");
	bg.width = screenBounds.width;
	bg.height = screenBounds.height;
	var bgctx = bg.getContext("2d");
	var tilesize = tile.tilesize;
	var off = tile.offset;
	var cX = Math.floor(bg.width / tilesize) + 1;
	var cY = Math.floor(bg.height / tilesize) + 1;
	var sbox = new spriteBox(new vec2(tile.tilesize, 0), new vec2(tile.tilesize));
	
	for(let y = -1; y <= cY; y++){
		for(let x = -1; x <= cX; x++){
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			printImage(bgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	
	gfx.background = bg;
}
function generateForeground_border(){
	// generates the tile border that surrounds the background tiles in menu
	log("generating foreground border texture...", logType.unimportant);
	
	var fg = document.createElement("canvas");
	fg.width = screenBounds.width;
	fg.height = screenBounds.height;
	var fgctx = fg.getContext("2d");
	var tilesize = tile.tilesize;
	var off = tile.offset;
	var cX = Math.floor(fg.width / tilesize) + 1;
	var cY = Math.floor(fg.height / tilesize);
	var sbox = new spriteBox(new vec2(0), new vec2(tile.tilesize));
	
	for(let y = -1; y <= cY; y++){
		for(let x = -1; x <= cX;
			x += (y == -1 || y == cY) ?
			1 : cX
			){
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			printImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	
	gfx.foreground_border = fg;
}
function generateForeground_overlay(){
	//generates the texture that is overlayed over the background for the HUD text to disply on during gameplay
	log("generating foreground overlay texture...", logType.unimportant);
	
	var fg = document.createElement("canvas");
	fg.width = screenBounds.width;
	fg.height = screenBounds.height;
	var fgctx = fg.getContext("2d");
	var tilesize = tile.tilesize;
	var off = tile.offset.minus(new vec2(tilesize));
	var cX = Math.floor(fg.width / tilesize) + 1;
	var cY = Math.floor(fg.height / tilesize) + 1;
	var sbox = new spriteBox(new vec2(), new vec2(tile.tilesize));
	
	// border foreground tiles
	for(let y = 0; y <= cY; y++){
		for(let x = 0; x <= cX;
			x += (y == 0 || y == cY) ?
			1 : cX
			){
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			printImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	// foreground tiles to the left of next piece area
	for(let y = 2; y <= 3; y++){
		for(let x = 11; x < 12; x++){
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			printImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	// foreground above next piece area
	for(let y = 1; y <= 1; y++){
		for(let x = 11; x < cX; x++){
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			printImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	// foreground tiles on the right side of the screen
	for(let y = 4; y < cY; y++){
		for(let x = 11; x < cX; x++){
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			printImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	
	// tileboard righthand shadow
	var spos1 = off.plus(new vec2(tilesize * 11 - 1, tilesize * 1));
	var ssize1 = new vec2(1, tilesize * 20);
	fgctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	fgctx.fillRect(spos1.x, spos1.y, ssize1.x, ssize1.y);
	
	// tileboard top shadow
	var spos2 = off.plus(new vec2(tilesize * 1, tilesize * 1));
	var ssize2 = new vec2(tilesize * 10, 1);
	fgctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	fgctx.fillRect(spos2.x, spos2.y, ssize2.x, ssize2.y);
	
	// next piece righthand shadow
	var spos1 = off.plus(new vec2(tilesize * (cX) - 1, tilesize * 2));
	var ssize1 = new vec2(1, tilesize * 2);
	fgctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	fgctx.fillRect(spos1.x, spos1.y, ssize1.x, ssize1.y);
	
	// next piece top shadow
	var spos2 = off.plus(new vec2(tilesize * 12, tilesize * 2));
	var ssize2 = new vec2(tilesize * 4, 1);
	fgctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	fgctx.fillRect(spos2.x, spos2.y, ssize2.x, ssize2.y);
	
	gfx.foreground_overlay = fg;
}


function applyConfig(){
	// applies the game configuration settings
	var smoothing = config.imageSmoothing;
	
	renderContext.mozImageSmoothingEnabled    	= smoothing;
	renderContext.oImageSmoothingEnabled      	= smoothing;
	renderContext.webkitImageSmoothingEnabled 	= smoothing;
	renderContext.msImageSmoothingEnabled     	= smoothing;
	renderContext.imageSmoothingEnabled       	= smoothing;

	scalingContext.mozImageSmoothingEnabled    	= smoothing;
	scalingContext.oImageSmoothingEnabled      	= smoothing;
	scalingContext.webkitImageSmoothingEnabled	= smoothing;
	scalingContext.msImageSmoothingEnabled     	= smoothing;
	scalingContext.imageSmoothingEnabled       	= smoothing;
}
function getCanvas(){
	// gets or creates the canvas and canvas contexts from the webpage and sets them to the global variables
	log("retrieving canvas data... ");
	
	// the scaling canvas is what is displayed on the webpage
	scalingTarget = document.getElementById("gameCanvas");
	scalingContext = scalingTarget.getContext("2d");
	
	// the rendering canvas is the canvas that everything is rendered to in the game's native resolution, it is then rescaled by the scaling canvas to the desired resolution before being drawn
	renderTarget = document.createElement("canvas");
	renderTarget.width = 500;
	renderTarget.height = 660;
	renderContext = renderTarget.getContext("2d");
	
	// sets the screen bounds
	screenBounds = new collisionBox(new vec2(), new vec2(renderTarget.width, renderTarget.height));
}

function assetLoadingFinishCheck(){
	// checks to see if the assets are done downloading, if not, it sets a callback to itself and returns empty
	
	var errs = [];
	for(let i in fonts){
		if(!fonts[i].spritesheet.loadedState){
			setTimeout(assetLoadingFinishCheck, 100);
			return false;
		} 
		// if there is an error loading the font, it is added to the errs array
		else if (fonts[i].spritesheet.loadedState != 1)
			errs.push({ obj: fonts[i], varName: "fonts." + i });
	}
	for(let i in gfx){
		if(!gfx[i].loadedState){
			setTimeout(assetLoadingFinishCheck, 100);
			return false;
		}
		// if there is an error loading the asset, it is added to the errs array
		else if (gfx[i].loadedState != 1)
			errs.push({ obj: gfx[i], varName: "gfx." + i });
	}
	for(let i in sfx){
		if(!sfx[i].loadedState){
			setTimeout(assetLoadingFinishCheck, 100);
			return false;
		}
		// if there is an error loading the asset, it is added to the errs array 
		else if (sfx[i].loadedState != 1)
			errs.push({ obj: gfx[i], varName: "sfx." + i });
	}
	
	finishLoading(errs);
	return true;
}
function handleAssetLoadingErrors(errors){
	// logs the errors in the console
	Object.keys(errors).forEach(function(key){
		// the problem variable
		log("*** error loading '" + errors[key].obj.constructor.name + "' @ var: " + errors[key].varName, logType.error);
		// the error object
		log(errors[key].obj.loadedState);
	});
}
function finishLoading(errors = []){
	// called after all assets are done downloading
	if(debug) handleAssetLoadingErrors(errors);
	log("--> finished loading game assets! @" + (performance.now()).toString() + "ms", logType.success);
	generateDynamicTextures();
	applyConfig();
	startGameLoop();
}

function startGameLoop(){
	// sets an animation frame callback for the main gameloop step
	log("initiating game loop...", logType.notify);
	window.requestAnimationFrame(step);
}
function step(){
	// a game step occurs, update logic is applied and the game is rendered
	var dt = performance.now() - timeElapsed;
	timeElapsed = performance.now();
	
	update(dt);
	draw();
	
	window.requestAnimationFrame(step);
}
function update(dt){
	// handles game logic that doesn't have to do with rendering
	gameState.current.update(dt);
}
function draw(){
	// draws the graphics onto the canvas
	clearScreen();
	
	gameState.current.draw();
	
	// FOR TESTING textBlock object:
	//var str = "Lorem Ipsum is simply (dummy text) of the [printing and typesetting industry]! Lorem Ipsum has been {the industrys standard} dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book It has survived <not only five centuries but also the leap> (into electronic typesetting) remaining essentially unchanged It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages and more recently with (desktop publishing)[ software like Aldus PageMaker] including versions <of Lorem Ipsum>";
	//var style = new textStyle(fonts.large);
	//var style0 = new textStyle(fonts.large, textColor.green);
	//var style1 = new textStyle(fonts.large, textColor.dark);
	//var style2 = new textStyle(fonts.small, textColor.light, 2);
	//var style3 = new textStyle(fonts.small, textColor.dark);
	//var textbox = new textBlock(str, style, collisionBox.fromSides(50, 200, 550, 500), [style0, style1, style2, style3]);
	//textbox.clone().draw();
	//textbox.bounds.drawOutline(renderContext);
	
	printScreen();
}

function drawBackground(){
	// draws the tiled backgroumd image onto the canvas
	drawImage(renderContext, gfx.background, new vec2());
}
function drawForegroundBorder(){
	// draws the border around inside of the canvas
	drawImage(renderContext, gfx.foreground_border, new vec2());
}
function drawForegroundOverlay(){
	// draws the overlay for the HUD to be displayed on while in game
	drawImage(renderContext, gfx.foreground_overlay, new vec2());
}

/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ { ------------------ } ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///

preventKeyScrolling();
window.addEventListener("load", init);