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
        
        // 高度な得点システム
        this.combo = 0;
        this.maxCombo = 0;
        this.multiplier = 1;
        this.lastObstacleTime = 0;
        this.comboTimer = 0;
        this.comboTimeLimit = 180; // 3秒 @ 60fps
        
        // ポイント表示システム
        this.floatingPoints = [];
        
        // 障害物別ポイント設定
        this.obstaclePoints = {
            'box': 10,
            'spike': 15,
            'tall': 20,
            'moving': 25,
            'breakable': 30,
            'powerup': 50
        };
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
        
        // スコアシステムをリセット
        this.combo = 0;
        this.maxCombo = 0;
        this.multiplier = 1;
        this.lastObstacleTime = 0;
        this.comboTimer = 0;
        this.floatingPoints = [];
        
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

        // スコアの更新（基本ポイントを減らして障害物クリアを重視）
        this.score += Math.floor(this.gameSpeed / 3); // 基本ポイントを減らす
        this.scoreDisplay.textContent = `Score: ${this.score}`;
        
        // コンボタイマー更新
        if (this.combo > 0) {
            this.comboTimer++;
            if (this.comboTimer > this.comboTimeLimit) {
                this.resetCombo();
            }
        }

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
        if (this.obstacleManager.checkCollision(this.player, this.audioSystem)) {
            this.gameOver();
        }
    }

    
    // 障害物クリア時のポイント計算
    addObstaclePoints(obstacleType, x, y) {
        const basePoints = this.obstaclePoints[obstacleType] || 10;
        let totalPoints = basePoints;
        
        // コンボボーナス
        this.combo++;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        this.comboTimer = 0;
        
        if (this.combo >= 3) {
            this.multiplier = 1 + Math.floor(this.combo / 3) * 0.5;
            totalPoints = Math.floor(totalPoints * this.multiplier);
        }
        
        // 難易度ボーナス
        const difficultyBonus = Math.floor(this.difficultyLevel * 2);
        totalPoints += difficultyBonus;
        
        // スピードボーナス
        const speedBonus = Math.floor(this.gameSpeed * 3);
        totalPoints += speedBonus;
        
        this.score += totalPoints;
        this.scoreDisplay.textContent = `Score: ${this.score}`;
        
        // フローティングポイント表示を追加
        this.addFloatingPoint(totalPoints, x, y, obstacleType);
        
        return totalPoints;
    }
    
    // コンボリセット
    resetCombo() {
        this.combo = 0;
        this.multiplier = 1;
        this.comboTimer = 0;
    }
    
    // フローティングポイント追加
    addFloatingPoint(points, x, y, type = 'normal') {
        const colors = {
            'normal': '#FFF',
            'combo': '#FFD700',
            'powerup': '#4CAF50',
            'perfect': '#FF6B6B'
        };
        
        this.floatingPoints.push({
            x: x,
            y: y - 20,
            points: points,
            color: colors[type] || colors.normal,
            life: 60,
            velocityY: -2,
            alpha: 1
        });
    }
    
    // パワーアップ効果処理
    processPowerup(powerupType) {
        switch(powerupType) {
            case 'scoreBoost':
                this.addFloatingPoint(100, this.player.x, this.player.y, 'powerup');
                this.score += 100;
                break;
            case 'comboProtect':
                // 次の1回はコンボが切れない
                this.comboProtection = true;
                break;
            case 'multiplier':
                // 10秒間マルチプライヤー2倍
                this.multiplier *= 2;
                setTimeout(() => {
                    this.multiplier = Math.max(1, this.multiplier / 2);
                }, 10000);
                break;
        }
    }

    // 描画
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.background.draw(this.ctx, this.gameSpeed);
        this.background.drawGround(this.ctx);
        this.obstacleManager.draw(this.ctx);
        this.particleSystem.update(this.ctx);
        this.player.draw(this.ctx, this.particleSystem);
        // 草エフェクトは最前面に描画してスピード感を演出
        this.grassEffect.draw(this.ctx);
        
        // フローティングポイント描画
        this.drawFloatingPoints();
        
        // コンボ表示
        this.drawComboDisplay();
    }

    
    // フローティングポイント描画・更新
    drawFloatingPoints() {
        this.floatingPoints = this.floatingPoints.filter(point => {
            // 位置更新
            point.y += point.velocityY;
            point.life--;
            point.alpha = point.life / 60;
            
            // 描画
            this.ctx.save();
            this.ctx.globalAlpha = point.alpha;
            this.ctx.fillStyle = point.color;
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            
            if (point.points >= 50) {
                this.ctx.font = 'bold 20px Arial';
                this.ctx.strokeStyle = '#000';
                this.ctx.lineWidth = 2;
                this.ctx.strokeText(`+${point.points}`, point.x, point.y);
            }
            
            this.ctx.fillText(`+${point.points}`, point.x, point.y);
            this.ctx.restore();
            
            return point.life > 0;
        });
    }
    
    // コンボ表示
    drawComboDisplay() {
        if (this.combo >= 2) {
            this.ctx.save();
            
            // コンボ数表示
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            
            const comboText = `COMBO x${this.combo}`;
            const multiplierText = `Multiplier: ${this.multiplier.toFixed(1)}x`;
            
            this.ctx.strokeText(comboText, 20, 60);
            this.ctx.fillText(comboText, 20, 60);
            
            if (this.multiplier > 1) {
                this.ctx.font = 'bold 16px Arial';
                this.ctx.strokeText(multiplierText, 20, 85);
                this.ctx.fillText(multiplierText, 20, 85);
            }
            
            // コンボタイマーバー
            const timerBarWidth = 200;
            const timerBarHeight = 6;
            const timerProgress = 1 - (this.comboTimer / this.comboTimeLimit);
            
            // バー背景
            this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
            this.ctx.fillRect(20, 95, timerBarWidth, timerBarHeight);
            
            // バー前景
            this.ctx.fillStyle = timerProgress > 0.3 ? '#4CAF50' : '#F44336';
            this.ctx.fillRect(20, 95, timerBarWidth * timerProgress, timerBarHeight);
            
            this.ctx.restore();
        }
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
                <p class="gameText">Final Score: ${this.score}</p>
                <p class="gameText" style="color: #FFD700;">High Score: ${this.highScore}</p>
                <p class="gameText" style="color: #4CAF50;">Max Combo: ${this.maxCombo}</p>
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