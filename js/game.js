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
	controls = {};
	
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
var logType = {
	log: 0,
	error: 1,
	success: 2
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
	log(out);
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
	log(out);
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
	log(out);
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
function drawImage(ctx, img, pos, sprite, scale = 1){
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
	loadFont("large", "font_lrge.png", new vec2(18, 32), 3);
	
	fonts.large.setSpecificCharacterWidths({
		'!': 18 - 5,
		':': 18 - 5,
		'j': 18 - 1,
		'1': 18 - 3
	});
	fonts.small.setSpecificCharacterWidths({
		'0': 8,
		'1': 8,
		'2': 10,
		'3': 10,
		'4': 8,
	});
	
	log(Object.keys(fonts).length.toString() + " fonts indexed");
}
function loadGFX(){
	// downloads all the needed graphics from the server to the client
	log("loading graphics... ")
	gfx = {};
	
	loadGraphic("tiles_tubes", "tiles_tubes.png");
	loadGraphic("tiles_blocks", "tiles_blocks.png");
	loadGraphic("balls", "balls.png");
	
	log(Object.keys(gfx).length.toString() + " files indexed");
}
function loadSFX(){
	// downloads the all the needed sound effects from the server to the client
	log("loading sound effects... ");
	sfx = {};
	
	// load sounds
	
	log(Object.keys(sfx).length.toString() + " files indexed");
}
function loadConfig(){
	// loads the game configuration from localStorage
	log("loading game configuration... ");
	setDefaultConfig();
}
function loadControls(){
	// loads the controls from localStorage
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
	// sets the default game controls
	controls = {
		Left: 0,
		Right: 0,
		Up: 0,
		Down: 0,
		quickDrop: 0,
		nudgeDown: 0,
		rotateCW: 0,
		rotateCCW: 0,
		select: 0,
		pause: 0
	};
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
	log("--> finished loading game! @" + (performance.now()).toString() + "ms", logType.success);
	getCanvas();
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
	
	// FIX: UNCOMMENT LINE BELOW
	// window.requestAnimationFrame(step);
	timeElapsed = performance.now();
}
function update(dt){}
function draw(){
	clearScreen();
	
	fonts.small.drawString(renderContext, "0123456789!:- abcdefghijklmnopqrstuvwxyz", new vec2(300), textColor.light);
	
	printScreen();
}
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ { ------------------ } ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///

window.addEventListener("load", init);