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
		
		// if music playback is successfull, remove previous music playback call
		else audioMgr.musicPlayCallback = null;
	}
	static playMusicWhenPossible(track){
		// some browsers prevent playback of audio under certain circumstances. This ensures that the
		// music will be played as soon as the browser allows it to if the initial playback request is
		// denied

		if(track.paused){
			// store the track in audioMgr.musicPlayCallback so that only the most recent song that is
			// attempted to be played starts playing when available
			audioMgr.musicPlayCallback = track;
			setTimeout(function(){
				audioMgr.tryStartMusic();
			});
		}
	}
	static tryStartMusic(){
		// tries to start the track that was most recently attempted to be played
		if(!audioMgr.musicPlayCallback)
			return;
		var track = audioMgr.musicPlayCallback;
		log("starting music: " + track.src);
		this.playMusic(track);

		// if the track successfully plays, cancel the previous unsuccessful music playback calls
		if(!track.paused)
			audioMgr.musicPlayCallback = null;
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