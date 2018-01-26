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
var gfx = {},
	sfx = {};

// canvas and contexts
var renderTarget,
	scalingTarget;
var renderContext,
	scalingContext;
///
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }Global functions{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function log(obj = "@ console logged"){
	if(!debug) return;
	console.log(obj);
}
function loadGraphic(assetname, filename){
	var out = "load graphic '" + filename + "'... ";
	
	var r = new Image();
	r.onload = function(e){ this.loadedState = 1; };
	r.onerror = function(e){ this.loadedState = 9; };
	r.src = "gfx/" + filename;
	gfx[assetname] = r;
	
	out += "success!";
	log(out);
	return r;
}
function loadSound(assetname, filename){
	var out = "load sound '" + filename + "'... ";
	
	var r = new Audio("sfx/" + filename);
	r.onload = function(e){ this.loadedState = 1; };
	r.onerror = function(e){ this.loadedState = 9; };
	sfx[assetname] = r;
	
	out += "success!";
	log(out);
	return r;
}
function clearScreen(color = "#aaa"){
	renderContext.fillStyle = color;
	scalingContext.fillStyle = color;
	
	renderContext.fillRect(0, 0, renderTarget.width, renderTarget.height);
	scalingContext.fillRect(0, 0, scalingTarget.width, scalingTarget.height);
}
///
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }High-Level functions{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function init(){
	loadConfig();
	loadControls();
	loadAssets();
	log("intitialized game!");
}
function loadAssets(){
	loadGFX();
	loadSFX();
	
	log("waiting for assets to finish downloading... ");
	assetLoadingFinishCheck()
}
function loadGFX(){
	log("loading graphics... ")
	gfx = {};
	
	loadGraphic("tiles_tubes", "tiles_tubes.png");
	loadGraphic("tiles_blocks", "tiles_blocks.png");
	loadGraphic("balls", "balls.png");
	
	log(Object.keys(gfx).length.toString() + " files indexed");
}
function loadSFX(){
	log("loading sound effects... ");
	sfx = {};
	
	// load sounds
	
	log(Object.keys(sfx).length.toString() + " files indexed");
}
function loadConfig(){
	log("loading game configuration... ");
	setDefaultConfig();
}
function loadControls(){
	log("loading controls... ");
	setDefaultControls();
}

function setDefaultConfig(){
	config = {
		animSpeed: 100,
		music: true,
		sound: true,
		canvasSize: 800,
		imageSmoothing: false,
	};
}
function setDefaultControls(){
	controls = {
		ballLeft: 0,
		ballRight: 0,
		ballDown: 0,
		ballUp: 0,
		bumpLeft: 0,
		bumpRight: 0,
		bumpDown: 0,
		quickDrop: 0,
		rotateCW: 0,
		rotateCCW: 0,
		select: 0,
		pause: 0
	};
}

function applyConfig(){
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
	log("retrieving canvas data... ");
	
	scalingTarget = document.getElementById("canvas");
	scalingContext = scalingTarget.getContext("2d");
	
	renderTarget = document.createElement("canvas");
	renderTarget.width = 600;
	renderTarget.height = 800;
	renderContext = renderTarget.getContext("2d");
}

function assetLoadingFinishCheck(){
	for(var i in gfx){
		if(!gfx[i].loadedState){
			setTimeout(assetLoadingFinishCheck, 100);
			return false;
		}
	}
	for(var i in sfx){
		if(!sfx[i].loadedState){
			setTimeout(assetLoadingFinishCheck, 100);
			return false;
		}
	}
	finishLoading();
	return true;
}
function finishLoading(){
	log("--> finished loading game! " + (performance.now()).toString() + "ms elapsed");
	getCanvas();
	applyConfig();
	startGameLoop();
}

function startGameLoop(){
	log("initiating game loop...");
	window.requestAnimationFrame(step);
}
function step(){
	var dt = performance.now() - timeElapsed;
	
	update(dt);
	draw();
	
	window.requestAnimationFrame(step);
	timeElapsed = performance.now();
}
function update(dt){}
function draw(){
	clearScreen();
}
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ { ------------------ } ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///

window.addEventListener("load", init);