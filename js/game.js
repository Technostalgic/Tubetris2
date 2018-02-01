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
	
var config = {};
	
var fonts = {},
	gfx = {},
	sfx = {};
	
// canvas and contexts
var renderTarget,
	scalingTarget;
var renderContext,
	scalingContext;
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
	
	// sets the console styling if the object is stylable (aka if it's a string)
	var style;
	if(obj.constructor.name == "String"){
		obj = "%c" + obj;
		
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
	
	var ob = obj || "console logged @" + timeElapsed + "ms";
	if(style) console.log(ob, style);
	else console.log(ob);
}
function loadFont(assetname, filename, charsize, colorVariants = 8){
	// downloads the specified font image and puts it into a textRenderer container with the specified data
	
	var out = "load font '" + filename + "'... ";
	
	var r = new Image();
	var f = new textRenderer(r, charsize, colorVariants);
	
	r.onload = function(e){ this.loadedState = 1; f.loadedState = 1; };
	r.onerror = function(e){ this.loadedState = e; f.loadedState = e; };
	r.src = "gfx/" + filename;
	
	fonts[assetname] = f;
	out += "success!";
	log(out, logType.unimportant);
	return r;
}
function loadGraphic(assetname, filename){
	// downloads the specified image asset
	
	var out = "load graphic '" + filename + "'... ";
	
	var r = new Image();
	r.onload = function(e){ this.loadedState = 1; };
	r.onerror = function(e){ this.loadedState = e; };
	r.src = "gfx/" + filename;
	gfx[assetname] = r;
	
	out += "success!";
	log(out, logType.unimportant);
	return r;
}
function loadSound(assetname, filename){
	// downloads the specified sound asset
	
	var out = "load sound '" + filename + "'... ";
	
	var r = new Audio("sfx/" + filename);
	r.onload = function(e){ this.loadedState = 1; };
	r.onerror = function(e){ this.loadedState = e; };
	sfx[assetname] = r;
	
	out += "success!";
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
///
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }High-Level functions{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function init(){
	// initializes the game
	log("initializing game @" + performance.now().toString() + "ms...", logType.notify);
	
	getCanvas();
	addInputEventListeners();
	
	controlState.init();
	gameState.switchState(new state_mainMenu());
	
	
	loadConfig();
	loadControls();
	loadAssets();
	
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
	
	loadFont("small", "font_small.png", new vec2(12, 8), 3);
	loadFont("large", "font_large.png", new vec2(18, 32), 3);
	
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
	
	log(Object.keys(gfx).length.toString() + " images indexed", logType.notify);
}
function loadSFX(){
	// downloads the all the needed sound effects from the server to the client
	log("loading sound effects... ");
	sfx = {};
	
	// load sounds
	
	log(Object.keys(sfx).length.toString() + " sounds indexed", logType.notify);
}
function loadConfig(){
	// loads the game configuration from localStorage
	log("loading game configuration... ");
	setDefaultConfig();
}
function loadControls(){
	// loads the controlState.controls from localStorage
	log("loading controls... ");
	setDefaultControls();
}

function setDefaultConfig(){
	// sets the default game configuration settings
	config = {
		animText: true,
		animSpeed: 100,
		music: true,
		sound: true,
		canvasSize: 800,
		imageSmoothing: false,
	};
}
function setDefaultControls(){
	// sets the default game controlState.controls
	var c = {
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
	controlState.setControls(c);
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
}

function generateDynamicTextures(){
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
	bg.width = 600;
	bg.height = 800;
	var bgctx = bg.getContext("2d");
	var off = new vec2(-20, -16);
	var tilesize = 32;
	var cX = Math.floor(bg.width / tilesize) + 1;
	var cY = Math.floor(bg.height / tilesize) + 1;
	var sbox = new spriteBox(new vec2(32, 0), new vec2(32));
	
	for(var y = 0; y <= cY; y++){
		for(var x = 0; x <= cX; x++){
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			drawImage(bgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	
	gfx.background = bg;
}
function generateForeground_border(){
	// generates the tile border that surrounds the background tiles in menu
	log("generating foreground border texture...", logType.unimportant);
	
	var fg = document.createElement("canvas");
	fg.width = 600;
	fg.height = 800;
	var fgctx = fg.getContext("2d");
	var off = new vec2(-20, -16);
	var tilesize = 32;
	var cX = Math.floor(fg.width / tilesize) + 1;
	var cY = Math.floor(fg.height / tilesize);
	var sbox = new spriteBox(new vec2(0), new vec2(32));
	
	for(var y = 0; y <= cY; y++){
		for(var x = 0; x <= cX;
			x += (y == 0 || y == cY) ?
			1 : cX
			){
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			drawImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	
	gfx.foreground_border = fg;
}
function generateForeground_overlay(){
	//generates the texture that is overlayed over the background for the HUD text to disply on during gameplay
	log("generating foreground overlay texture...", logType.unimportant);
	
	var fg = document.createElement("canvas");
	fg.width = 600;
	fg.height = 800;
	var fgctx = fg.getContext("2d");
	var off = new vec2(-20, -16);
	var tilesize = 32;
	var cX = Math.floor(fg.width / tilesize) + 1;
	var cY = Math.floor(fg.height / tilesize);
	var sbox = new spriteBox(new vec2(), new vec2(32));
	
	// border foreground tiles
	for(var y = 0; y <= cY; y++){
		for(var x = 0; x <= cX;
			x += (y == 0 || y == cY) ?
			1 : cX
			){
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			drawImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	// foreground tiles to the left of next piece area
	for(var y = 1; y <= 4; y++){
		for(var x = 1; x < 12; x++){
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			drawImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	// foreground above next piece area
	for(var y = 1; y <= 1; y++){
		for(var x = 11; x < cX; x++){
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			drawImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	// foreground tiles to the right of next piece area
	for(var y = 1; y <= 3; y++){
		for(var x = cX - 1; x < cX; x++){
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			drawImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	// foreground tiles on the right side of the screen
	for(var y = 4; y < cY; y++){
		for(var x = 11; x < cX; x++){
			var tpos = off.plus(new vec2(x * tilesize, y * tilesize));
			drawImage(fgctx, gfx.tiles_empty, tpos, sbox);
		}
	}
	
	// tileboard righthand shadow
	var spos1 = off.plus(new vec2(tilesize * 11 - 1, tilesize * 5));
	var ssize1 = new vec2(1, tilesize * 20);
	fgctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	fgctx.fillRect(spos1.x, spos1.y, ssize1.x, ssize1.y);
	
	// tileboard top shadow
	var spos2 = off.plus(new vec2(tilesize * 1, tilesize * 5));
	var ssize2 = new vec2(tilesize * 10, 1);
	fgctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	fgctx.fillRect(spos2.x, spos2.y, ssize2.x, ssize2.y);
	
	// next piece righthand shadow
	var spos1 = off.plus(new vec2(tilesize * (cX - 1) - 1, tilesize * 2));
	var ssize1 = new vec2(1, tilesize * 2);
	fgctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	fgctx.fillRect(spos1.x, spos1.y, ssize1.x, ssize1.y);
	
	// next piece top shadow
	var spos2 = off.plus(new vec2(tilesize * 12, tilesize * 2));
	var ssize2 = new vec2(tilesize * 6, 1);
	fgctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	fgctx.fillRect(spos2.x, spos2.y, ssize2.x, ssize2.y);
	
	gfx.foreground_overlay = fg;
}

function applyConfig(){
	// applies the game configuration settings
	var smoothing = config.imageSmoothing;
	
	renderContext.mozImageSmoothingEnabled    = smoothing;
	renderContext.oImageSmoothingEnabled      = smoothing;
	renderContext.webkitImageSmoothingEnabled = smoothing;
	renderContext.msImageSmoothingEnabled     = smoothing;
	renderContext.imageSmoothingEnabled       = smoothing;
	
	scalingContext.mozImageSmoothingEnabled    = smoothing;
	scalingContext.oImageSmoothingEnabled      = smoothing;
	scalingContext.webkitImageSmoothingEnabled = smoothing;
	scalingContext.msImageSmoothingEnabled     = smoothing;
	scalingContext.imageSmoothingEnabled       = smoothing;
}
function getCanvas(){
	// gets or creates the canvas and canvas contexts from the webpage and sets them to the global variables
	log("retrieving canvas data... ");
	
	// the scaling canvas is what is displayed on the webpage
	scalingTarget = document.getElementById("canvas");
	scalingContext = scalingTarget.getContext("2d");
	
	// the rendering canvas is the canvas that everything is rendered to in the game's native resolution, it is then rescaled by the scaling canvas to the desired resolution before being drawn
	renderTarget = document.createElement("canvas");
	renderTarget.width = 600;
	renderTarget.height = 800;
	renderContext = renderTarget.getContext("2d");
}

function assetLoadingFinishCheck(){
	// checks to see if the assets are done downloading, if not, it sets a callback to itself and returns empty
	
	var errs = [];
	for(var i in fonts){
		if(!fonts[i].spritesheet.loadedState){
			setTimeout(assetLoadingFinishCheck, 100);
			return false;
		} 
		// if there is an error loading the font, it is added to the errs array
		else if (fonts[i].spritesheet.loadedState != 1)
			errs.push({ obj: fonts[i], varName: "fonts." + i });
	}
	for(var i in gfx){
		if(!gfx[i].loadedState){
			setTimeout(assetLoadingFinishCheck, 100);
			return false;
		}
		// if there is an error loading the asset, it is added to the errs array
		else if (gfx[i].loadedState != 1)
			errs.push({ obj: gfx[i], varName: "gfx." + i });
	}
	for(var i in sfx){
		if(!sfx[i].loadedState){
			setTimeout(assetLoadingFinishCheck, 100);
			return false;
		}
		// if there is an error loading the asset, it is added to the errs array 
		else if (gfx[i].loadedState != 1)
			errs.push({ obj: gfx[i], varName: "sfx." + i });
	}
	
	finishLoading(errs);
	return true;
}
function handleAssetLoadingErrors(errors){
	// logs the errors in the console
	for(var i in errors){
		// the problem variable
		log("*** error loading '" + errors[i].obj.constructor.name + "' @ var: " + errors[i].varName, logType.error);
		// the error object
		log(errors[i].obj.loadedState);
	}
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
	log("initiating game loop...");
	window.requestAnimationFrame(step);
}
function step(){
	// a game step occurs, update logic is applied and the game is rendered
	var dt = performance.now() - timeElapsed;
	
	update(dt);
	draw();
	
	window.requestAnimationFrame(step);
	timeElapsed = performance.now();
}
function update(dt){
	gameState.current.update(dt);
}
function draw(){
	// draws the graphics onto the canvas
	clearScreen();
	
	gameState.current.draw();
	
	printScreen();
}

function drawBackground(){
	drawImage(renderContext, gfx.background, new vec2());
}
function drawForegroundBorder(){
	drawImage(renderContext, gfx.foreground_border, new vec2());
}
function drawForegroundOverlay(){
	drawImage(renderContext, gfx.foreground_overlay, new vec2());
}

/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ { ------------------ } ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///

preventKeyScrolling();
window.addEventListener("load", init);