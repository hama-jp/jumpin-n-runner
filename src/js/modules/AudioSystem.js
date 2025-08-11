class AudioSystem {
    constructor() {
        this.soundEnabled = true;
        this.audioInitialized = false;
        
        // サウンド関連の変数
        this.bgmLoop = null;
        this.synth = null;
        this.jumpSynth = null;
        this.gameOverSynth = null;
        this.pointSynth = null;
        this.speedUpSynth = null;
        
        this.loadingText = document.getElementById('loadingText');
        this.soundToggleBtn = document.getElementById('soundToggle');
    }

    // オーディオの初期化
    async init() {
        if (this.audioInitialized) return;
        
        this.loadingText.style.display = 'block';
        
        await Tone.start();
        
        // メインシンセサイザー（BGM用）
        this.synth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "square8" },
            envelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.3,
                release: 0.4
            }
        }).toDestination();
        this.synth.volume.value = -15;
        
        // ジャンプ音用シンセ
        this.jumpSynth = new Tone.Synth({
            oscillator: { type: "sine" },
            envelope: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0,
                release: 0.1
            }
        }).toDestination();
        this.jumpSynth.volume.value = -10;
        
        // ゲームオーバー音用シンセ
        this.gameOverSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sawtooth" },
            envelope: {
                attack: 0.01,
                decay: 0.3,
                sustain: 0.1,
                release: 0.5
            }
        }).toDestination();
        this.gameOverSynth.volume.value = -8;
        
        // ポイント獲得音用シンセ
        this.pointSynth = new Tone.Synth({
            oscillator: { type: "triangle" },
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 0,
                release: 0.1
            }
        }).toDestination();
        this.pointSynth.volume.value = -12;
        
        // スピードアップ音用シンセ
        this.speedUpSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sine" },
            envelope: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0.1,
                release: 0.3
            }
        }).toDestination();
        this.speedUpSynth.volume.value = -10;
        
        // BGMループの作成
        this.createBGM();
        
        this.audioInitialized = true;
        this.loadingText.style.display = 'none';
    }
    
    // BGMの作成
    createBGM() {
        const bgmPattern = [
            { time: "0:0", note: "C4", duration: "8n" },
            { time: "0:0:2", note: "E4", duration: "8n" },
            { time: "0:1", note: "G4", duration: "8n" },
            { time: "0:1:2", note: "E4", duration: "8n" },
            { time: "0:2", note: "C4", duration: "8n" },
            { time: "0:2:2", note: "E4", duration: "8n" },
            { time: "0:3", note: "G4", duration: "8n" },
            { time: "0:3:2", note: "B4", duration: "8n" },
            
            { time: "1:0", note: "A3", duration: "8n" },
            { time: "1:0:2", note: "C4", duration: "8n" },
            { time: "1:1", note: "E4", duration: "8n" },
            { time: "1:1:2", note: "C4", duration: "8n" },
            { time: "1:2", note: "A3", duration: "8n" },
            { time: "1:2:2", note: "C4", duration: "8n" },
            { time: "1:3", note: "E4", duration: "8n" },
            { time: "1:3:2", note: "G4", duration: "8n" },
            
            { time: "2:0", note: "F3", duration: "8n" },
            { time: "2:0:2", note: "A3", duration: "8n" },
            { time: "2:1", note: "C4", duration: "8n" },
            { time: "2:1:2", note: "A3", duration: "8n" },
            { time: "2:2", note: "G3", duration: "8n" },
            { time: "2:2:2", note: "B3", duration: "8n" },
            { time: "2:3", note: "D4", duration: "8n" },
            { time: "2:3:2", note: "G4", duration: "8n" },
            
            { time: "3:0", note: "C4", duration: "8n" },
            { time: "3:0:2", note: "E4", duration: "8n" },
            { time: "3:1", note: "G4", duration: "8n" },
            { time: "3:1:2", note: "C5", duration: "8n" },
            { time: "3:2", note: "G4", duration: "8n" },
            { time: "3:2:2", note: "E4", duration: "8n" },
            { time: "3:3", note: "C4", duration: "4n" }
        ];
        
        this.bgmLoop = new Tone.Part((time, note) => {
            if (this.soundEnabled) {
                this.synth.triggerAttackRelease(note.note, note.duration, time);
            }
        }, bgmPattern.map(p => [p.time, { note: p.note, duration: p.duration }]));
        
        this.bgmLoop.loop = true;
        this.bgmLoop.loopEnd = "4m";
        Tone.Transport.bpm.value = 140;
    }
    
    // BGM開始
    startBGM() {
        if (this.bgmLoop && this.soundEnabled) {
            Tone.Transport.start();
            this.bgmLoop.start(0);
        }
    }
    
    // BGM停止
    stopBGM() {
        if (this.bgmLoop) {
            this.bgmLoop.stop();
            Tone.Transport.stop();
        }
    }
    
    // ジャンプ音
    playJumpSound(chargeRatio = 0) {
        if (this.soundEnabled && this.jumpSynth) {
            if (chargeRatio < 0.3) {
                // 小ジャンプ音（高く短い音）
                this.jumpSynth.triggerAttackRelease("E5", "16n");
            } else if (chargeRatio < 0.7) {
                // 中ジャンプ音
                this.jumpSynth.triggerAttackRelease("C5", "8n");
                setTimeout(() => {
                    this.jumpSynth.triggerAttackRelease("E5", "8n");
                }, 50);
            } else {
                // 大ジャンプ音（力強い音）
                this.jumpSynth.triggerAttackRelease("G4", "8n");
                setTimeout(() => {
                    this.jumpSynth.triggerAttackRelease("C5", "8n");
                }, 30);
                setTimeout(() => {
                    this.jumpSynth.triggerAttackRelease("G5", "8n");
                }, 60);
            }
        }
    }
    
    // ポイント獲得音
    playPointSound() {
        if (this.soundEnabled && this.pointSynth) {
            this.pointSynth.triggerAttackRelease("G5", "16n");
            setTimeout(() => {
                this.pointSynth.triggerAttackRelease("C6", "16n");
            }, 30);
        }
    }
    
    // スピードアップ音
    playSpeedUpSound() {
        if (this.soundEnabled && this.speedUpSynth) {
            this.speedUpSynth.triggerAttackRelease(["C4", "E4", "G4", "C5"], "4n");
        }
    }
    
    // ゲームオーバー音
    playGameOverSound() {
        if (this.soundEnabled && this.gameOverSynth) {
            this.gameOverSynth.triggerAttackRelease(["C4", "Eb4", "G3"], "2n");
        }
    }
    
    // サウンドのオン/オフ切り替え
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.soundToggleBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
        
        if (!this.soundEnabled) {
            this.stopBGM();
        }
    }
}