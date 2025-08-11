class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('gameOverlay');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.highScoreDisplay = document.getElementById('highScoreDisplay');

        // ゲーム変数
        this.gameRunning = false;
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.gameSpeed = 1.5;
        this.speedIncreaseTimer = 0;
        this.difficultyLevel = 0;

        // ゲームコンポーネントの初期化
        this.audioSystem = new AudioSystem();
        this.player = new Player(this.canvas);
        this.obstacleManager = new ObstacleManager(this.canvas);
        this.particleSystem = new ParticleSystem();
        this.background = new Background(this.canvas);
        this.grassEffect = new GrassEffect(this.canvas);
        this.inputHandler = new InputHandler(this.canvas, this);

        // 初期表示
        this.background.draw(this.ctx, 0);
        this.background.drawGround(this.ctx);
        this.player.draw(this.ctx, this.particleSystem);
        this.highScoreDisplay.textContent = `High Score: ${this.highScore}`;
    }

    // ゲーム開始
    async start() {
        // オーディオが初期化されていない場合は初期化
        if (!this.audioSystem.audioInitialized) {
            await this.audioSystem.init();
        }

        this.gameRunning = true;
        this.score = 0;
        this.gameSpeed = 1.5;
        this.speedIncreaseTimer = 0;
        this.difficultyLevel = 0;
        
        // 背景色効果をリセット
        this.canvas.style.filter = 'none';

        // ゲームコンポーネントのリセット
        this.player.reset();
        this.obstacleManager.reset();
        this.particleSystem.clear();
        this.background.reset();
        this.grassEffect.reset();

        this.overlay.classList.remove('show');
        this.highScoreDisplay.textContent = `High Score: ${this.highScore}`;

        // BGMを停止してから再開（確実にリスタートさせる）
        this.audioSystem.stopBGM();
        setTimeout(() => {
            this.audioSystem.startBGM();
        }, 100);

        this.gameLoop();
    }

    // ゲームループ
    gameLoop() {
        this.update();
        this.draw();

        if (this.gameRunning) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    // ゲームの更新
    update() {
        if (!this.gameRunning) return;

        this.player.update();
        this.obstacleManager.update(this.gameSpeed, this.difficultyLevel, this.player, this.audioSystem);
        this.grassEffect.update(this.gameSpeed);

        // スコアの更新
        this.score++;
        this.scoreDisplay.textContent = `Score: ${this.score}`;

        // 速度上昇と難易度上昇
        this.speedIncreaseTimer++;
        if (this.speedIncreaseTimer > 300) {
            this.gameSpeed += 0.3;
            this.speedIncreaseTimer = 0;
            this.difficultyLevel++;

            // 速度上昇エフェクトと音
            this.player.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
            this.audioSystem.playSpeedUpSound();

            // 難易度上昇の視覚フィードバック（背景色を少し変化）
            if (this.difficultyLevel > 3) {
                this.canvas.style.filter = `hue-rotate(${this.difficultyLevel * 5}deg)`;
            }
        }

        // 衝突判定
        if (this.obstacleManager.checkCollision(this.player)) {
            this.gameOver();
        }
    }

    // 描画
    draw() {
        this.background.draw(this.ctx, this.gameSpeed);
        this.background.drawGround(this.ctx);
        this.obstacleManager.draw(this.ctx);
        this.particleSystem.update(this.ctx);
        this.player.draw(this.ctx, this.particleSystem);
        // 草エフェクトは最前面に描画してスピード感を演出
        this.grassEffect.draw(this.ctx);
    }

    // ジャンプチャージ開始
    startJumpCharge() {
        if (this.gameRunning) {
            this.player.startJumpCharge();
        }
    }

    // ジャンプ実行
    executeJump() {
        if (this.gameRunning) {
            const chargeRatio = this.player.executeJump(this.audioSystem);
            
            // 大ジャンプ時は追加エフェクト
            if (chargeRatio > 0.7) {
                this.particleSystem.createBigJumpParticles(
                    this.player.x + this.player.width/2, 
                    this.player.y + this.player.height
                );
            }
        }
    }

    // 即ジャンプ実行可能かチェック
    canExecuteQuickJump() {
        return !this.player.jumping && this.gameRunning;
    }

    // 即ジャンプ実行
    executeQuickJump() {
        if (this.canExecuteQuickJump()) {
            this.player.isCharging = false;
            this.player.chargeTime = 0;
            this.player.velocityY = this.player.minJumpPower;
            this.player.jumping = true;
            this.audioSystem.playJumpSound(0);
        }
    }

    // ゲームオーバー
    gameOver() {
        this.gameRunning = false;
        this.audioSystem.stopBGM();
        this.audioSystem.playGameOverSound();

        // 背景色効果をリセット
        this.canvas.style.filter = 'none';

        // チャージ状態をリセット
        this.player.isCharging = false;
        this.player.chargeTime = 0;

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }

        // ゲームオーバー画面を少し遅延して表示（音響効果が再生されるまで）
        setTimeout(() => {
            this.overlay.innerHTML = `
                <h1 class="gameTitle">Game Over</h1>
                <p class="gameText">Score: ${this.score}</p>
                <p class="gameText" style="color: #FFD700;">High Score: ${this.highScore}</p>
                <button class="button" onclick="restartGame()">Play Again</button>
            `;
            this.overlay.classList.add('show');
        }, 500);
    }

    // サウンド切り替え
    toggleSound() {
        this.audioSystem.toggleSound();
        
        if (this.audioSystem.soundEnabled && this.gameRunning) {
            this.audioSystem.startBGM();
        }
    }

    // 初期化して開始
    async initAndStart() {
        if (!this.audioSystem.audioInitialized) {
            await this.audioSystem.init();
        }
        this.start();
    }

    // クリーンアップ
    destroy() {
        this.inputHandler.destroy();
        this.audioSystem.stopBGM();
    }
}