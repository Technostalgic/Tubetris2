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
	}
	
	static playSound(sound, forceRestart = true){
		// plays a sound unless it is already playing, if forceRestart is enabled, will restart the
		// sound if it is already playing
		if(forceRestart) sound.currentTime = 0;
		sound.volume = config.volume_sound;
		
		sound.play();
	}
	static playMusic(music){
		// starts looping a music track
		if(audioMgr.currentMusic) audioMgr.stopMusic();
		audioMgr.currentMusic = music;
		music.currentTime = 0;
		music.volume = config.volume_music;
		music.onended = function(){
			audioMgr.playMusic(music);
		};
		
		music.play();
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