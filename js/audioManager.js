///
///	code by Isaiah Smith
///
///	https://technostalgic.tech	
///	twitter @technostalgicGM
///

// used to play all sound effects and music according to the game's audio configuration
class audioMgr{
	static init(){
		// initialize static fields
		audioMgr.currentMusic = null;
		audioMgr.musicPlayCallback = null;
	}
	
	static playSound(sound, forceRestart = true){
		// plays a sound unless it is already playing, if forceRestart is enabled, will restart the
		// sound if it is already playing
		if(forceRestart) sound.currentTime = 0;
		sound.volume = config.volume_sound;
		
		sound.play();
	}
	static playMusic(track){
		// starts looping a music track
		if(audioMgr.currentMusic) audioMgr.stopMusic();
		audioMgr.currentMusic = track;
		track.currentTime = 0;
		track.volume = config.volume_music;
		track.onended = function(){
			audioMgr.currentMusic.currentTime = 0;
			audioMgr.currentMusic.play();
		};

		track.play();
		
		// ensures that the music will begin playback when the browser allows it to
		if(track.paused)
			audioMgr.playMusicWhenPossible(track);
		else if(audioMgr.musicPlayCallback != null)
			clearTimeout(audioMgr.musicPlayCallback);
	}
	static playMusicWhenPossible(track){
		// some browsers prevent playback of audio under certain circumstances. This ensures that the
		// music will be played as soon as the browser allows it to if the initial playback request is
		// denied
		if(track.paused)
			audioMgr.musicPlayCallback = 
			setTimeout(function(){
				audioMgr.playMusic(track);
			});
	}
	static pauseMusic(){
		if(!audioMgr.currentMusic) return;
		audioMgr.currentMusic.onended = null;
		audioMgr.currentMusic.pause();
	}
	static resumeMusic(){
		if(!audioMgr.currentMusic) return;
		audioMgr.currentMusic.volume = config.volume_music;
		audioMgr.currentMusic.onended = function(){
			audioMgr.playMusic(audioMgr.currentMusic);
		};
		
		audioMgr.currentMusic.play();
	}
	static stopMusic(){
		if(!audioMgr.currentMusic) return;
		audioMgr.currentMusic.onended = null;
		audioMgr.currentMusic.pause();
		audioMgr.currentMusic.currentTime = 0;
		audioMgr.currentMusic = null;
	}
}