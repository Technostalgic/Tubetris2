///
///	code by Isaiah Smith
///		
///	https://technostalgic.tech  
///	twitter @technostalgicGM
///

/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }Global variables{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
var debug = true;
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ }Global functions{ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function log(obj = "@ console logged"){
	if(!debug) return;
	console.log(obj);
}
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ {----------------} ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function init(){
	log("intitialized game!");
}

window.addEventListener("load", init);