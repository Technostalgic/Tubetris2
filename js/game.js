///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }Global variables{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
var debug = true;
var config = {};
var gfx = {};
	sfx = {};
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
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }High-Level functions{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function init(){
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
}
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ { ------------------ } ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

window.addEventListener("load", init);