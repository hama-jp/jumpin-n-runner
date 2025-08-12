class ObstacleManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.baseObstacleInterval = 400;  // 初期の障害物間隔（4倍に拡大）
        this.obstacleRandomness = 20;     // 初期のランダム性（小さめ）
        
        // オブジェクトプール
        this.obstaclePool = [];
        this.maxPoolSize = 50;
        this.initializePool();
        
        // パターン生成
        this.patterns = this.initializePatterns();
        this.currentPatternIndex = 0;
        this.patternTimer = 0;
    }
    
    // オブジェクトプールの初期化
    initializePool() {
        for (let i = 0; i < this.maxPoolSize; i++) {
            this.obstaclePool.push(this.createEmptyObstacle());
        }
    }
    
    // 空の障害物オブジェクトを作成
    createEmptyObstacle() {
        return {
            x: 0, y: 0, width: 0, height: 0,
            type: '', color: '', scored: false,
            health: 1, moveSpeed: 0, moveDirection: 1,
            originalY: 0, moveRange: 0, isMoving: false,
            isCollectable: false, active: false
        };
    }
    
    // プールから障害物を取得
    getFromPool() {
        for (let obstacle of this.obstaclePool) {
            if (!obstacle.active) {
                obstacle.active = true;
                return obstacle;
            }
        }
        // プールが満杯の場合は新しく作成
        return this.createEmptyObstacle();
    }
    
    // 障害物をプールに返却
    returnToPool(obstacle) {
        obstacle.active = false;
        obstacle.scored = false;
        obstacle.health = 1;
        obstacle.isMoving = false;
        obstacle.isCollectable = false;
    }
    
    // パターンの初期化
    initializePatterns() {
        return [
            // 基本パターン
            { name: 'basic', obstacles: [{ type: 'box', delay: 0 }] },
            { name: 'spike_combo', obstacles: [{ type: 'spike', delay: 0 }, { type: 'spike', delay: 100 }] },
            { name: 'high_low', obstacles: [{ type: 'tall', delay: 0 }, { type: 'spike', delay: 150 }] },
            // 高難易度パターン
            { name: 'moving_chaos', obstacles: [{ type: 'moving', delay: 0 }, { type: 'box', delay: 200 }] },
            { name: 'breakable_wall', obstacles: [{ type: 'breakable', delay: 0 }, { type: 'breakable', delay: 50 }] }
        ];
    }

    // パターンを生成
    spawnPattern(difficultyLevel, gameSpeed = 1.5) {
        // 難易度に応じてパターンを選択
        let availablePatterns = this.patterns.filter(pattern => {
            if (difficultyLevel < 3) return pattern.name === 'basic';
            if (difficultyLevel < 6) return ['basic', 'spike_combo', 'high_low'].includes(pattern.name);
            return true; // 高難易度では全パターン
        });
        
        const selectedPattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
        
        // パターンの障害物を生成
        selectedPattern.obstacles.forEach(obstacleConfig => {
            setTimeout(() => {
                this.createObstacleFromConfig(obstacleConfig, difficultyLevel, gameSpeed);
            }, obstacleConfig.delay);
        });
    }
    
    // 設定から障害物を生成
    createObstacleFromConfig(config, difficultyLevel, gameSpeed = 1.5) {
        let obstacle = this.getFromPool();
        obstacle.x = this.canvas.width + (config.xOffset || 0);
        obstacle.type = config.type;
        obstacle.scored = false;
        
        // タイプごとの設定を適用
        this.applyObstacleConfig(obstacle, config.type, difficultyLevel, gameSpeed);
        this.obstacles.push(obstacle);
    }
    
    // 障害物設定を適用
    applyObstacleConfig(obstacle, type, difficultyLevel, gameSpeed = 1.5) {
        // 基本設定をリセット
        obstacle.health = 1;
        obstacle.moveSpeed = 0;
        obstacle.moveDirection = 1;
        obstacle.originalY = 0;
        obstacle.moveRange = 0;
        obstacle.isMoving = false;
        obstacle.isCollectable = false;
        
        switch(type) {
            case 'box':
                obstacle.y = this.canvas.height - 100 - 35;  // 地面上に35pxの高さ
                obstacle.width = 30;
                obstacle.height = 35;
                obstacle.color = '#FF9800';
                break;
            case 'spike':
                obstacle.y = this.canvas.height - 100 - 15;  // 地面上に15pxの高さ
                obstacle.width = 25;
                obstacle.height = 15;
                obstacle.color = '#F44336';
                break;
            case 'tall':
                obstacle.y = this.canvas.height - 100 - 55;  // 地面上に55pxの高さ
                obstacle.width = 20;
                obstacle.height = 55;
                obstacle.color = '#9C27B0';
                break;
            case 'moving':
                obstacle.y = this.canvas.height - 100 - 25;  // 地面上に25pxの高さ
                obstacle.width = 25;
                obstacle.height = 25;
                obstacle.color = '#2196F3';
                obstacle.moveSpeed = 2 + Math.random() * 2;
                obstacle.moveDirection = Math.random() < 0.5 ? 1 : -1;
                obstacle.originalY = obstacle.y;
                obstacle.moveRange = 40 + Math.random() * 30;
                obstacle.isMoving = true;
                break;
            case 'breakable':
                obstacle.y = this.canvas.height - 100 - 40;  // 地面上に40pxの高さ
                obstacle.width = 35;
                obstacle.height = 40;
                obstacle.color = '#795548';
                obstacle.health = 2;
                break;
            case 'powerup':
                obstacle.y = this.canvas.height - 100 - 20;  // 地面上に20pxの高さ
                obstacle.width = 20;
                obstacle.height = 20;
                obstacle.color = '#4CAF50';
                obstacle.isCollectable = true;

                break;
        }
    }

    // 障害物の生成
    createObstacle(difficultyLevel, gameSpeed = 1.5) {
        const types = ['box', 'spike', 'tall', 'moving', 'breakable', 'powerup'];
        // 難易度と速度に応じた障害物の重み調整
        let typeWeights = [3, 1, 1, 0, 0, 1];  // 初期: box多め、powerup少し
        if (difficultyLevel > 3) {
            typeWeights = [2, 2, 1, 1, 0, 1];  // 中盤: moving追加
        }
        if (difficultyLevel > 6) {
            typeWeights = [1, 2, 2, 2, 1, 1];  // 後半: breakable追加、全種類登場
        }
        
        // 速度が上がると難しい障害物の重みを増加
        if (gameSpeed > 2.5) {
            typeWeights[1] = Math.min(4, typeWeights[1] + 1); // spike増加
            typeWeights[3] = Math.min(3, typeWeights[3] + 1); // moving増加
            typeWeights[5] = Math.min(2, typeWeights[5] + 1); // powerup増加（報酬も増やす）
        }
        if (gameSpeed > 4.0) {
            typeWeights[2] = Math.min(3, typeWeights[2] + 1); // tall増加
            typeWeights[4] = Math.min(2, typeWeights[4] + 1); // breakable増加
        }
        
        // 重み付きランダム選択
        const totalWeight = typeWeights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        let typeIndex = 0;

        for (let i = 0; i < typeWeights.length; i++) {
            random -= typeWeights[i];
            if (random <= 0) {
                typeIndex = i;
                break;
            }
        }
        const type = types[typeIndex];

        
        let obstacle = this.getFromPool();
        obstacle.x = this.canvas.width;
        obstacle.type = type;
        obstacle.color = '';
        obstacle.scored = false;
        // 新機能用プロパティをリセット
        obstacle.health = 1;
        obstacle.moveSpeed = 0;
        obstacle.moveDirection = 1;
        obstacle.originalY = 0;
        obstacle.moveRange = 0;
        obstacle.isMoving = false;
        obstacle.isCollectable = false;
        
        // 障害物のサイズと特性を設定
        switch(type) {
            case 'box':
                obstacle.y = this.canvas.height - 100 - 35;  // 地面上に35pxの高さ
                obstacle.width = 30;
                obstacle.height = 35;
                obstacle.color = '#FF9800';
                break;
            case 'spike':
                obstacle.y = this.canvas.height - 100 - 15;  // 地面上に15pxの高さ
                obstacle.width = 25;
                obstacle.height = 15;
                obstacle.color = '#F44336';
                break;
            case 'tall':
                obstacle.y = this.canvas.height - 100 - 55;  // 地面上に55pxの高さ
                obstacle.width = 20;
                obstacle.height = 55;
                obstacle.color = '#9C27B0';
                break;
            case 'moving':
                obstacle.y = this.canvas.height - 100 - 25;  // 地面上に25pxの高さ
                obstacle.width = 25;
                obstacle.height = 25;
                obstacle.color = '#2196F3';
                obstacle.moveSpeed = 2 + Math.random() * 2;
                obstacle.moveDirection = Math.random() < 0.5 ? 1 : -1;
                obstacle.originalY = obstacle.y;
                obstacle.moveRange = 40 + Math.random() * 30;
                obstacle.isMoving = true;
                break;
            case 'breakable':
                obstacle.y = this.canvas.height - 100 - 40;  // 地面上に40pxの高さ
                obstacle.width = 35;
                obstacle.height = 40;
                obstacle.color = '#795548';
                obstacle.health = 2;
                break;
            case 'powerup':
                obstacle.y = this.canvas.height - 100 - 20;  // 地面上に20pxの高さ
                obstacle.width = 20;
                obstacle.height = 20;
                obstacle.color = '#4CAF50';
                obstacle.isCollectable = true;

                break;
        }
        
        this.obstacles.push(obstacle);
        
        // 時々連続障害物を生成（難易度が上がると確率が上がる）
        if (difficultyLevel > 6 && Math.random() < 0.1 + (difficultyLevel * 0.01)) {
            setTimeout(() => {
                // 連続障害物は低い障害物のみ（spikesのみ）にして攻略可能にする
                const secondType = 'spike';
                this.obstacles.push({
                    x: this.canvas.width + 150, // より間隔を空ける
                    y: this.canvas.height - 115,
                    width: 25,
                    height: 15,
                    type: secondType,
                    color: '#F44336',
                    scored: false
                });
            }, 800); // より長い間隔
        }
    }

    // 障害物の更新
    update(gameSpeed, difficultyLevel, player, audioSystem) {
        // 障害物の移動とポイント獲得チェック
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.x -= gameSpeed;
            
            // 動く障害物の処理
            if (obstacle.isMoving && obstacle.type === 'moving') {
                obstacle.y += obstacle.moveSpeed * obstacle.moveDirection;
                
                // 地面レベルと移動範囲の制限
                const groundLevel = this.canvas.height - 100;
                const maxY = groundLevel - obstacle.height;  // 地面に接する位置
                
                if (obstacle.y > maxY) {
                    obstacle.y = maxY;
                    obstacle.moveDirection *= -1;
                } else if (Math.abs(obstacle.y - obstacle.originalY) > obstacle.moveRange) {
                    obstacle.moveDirection *= -1;
                }
            }
            
            // 障害物を飛び越えたらポイント音を鳴らしてポイント追加
            if (!obstacle.scored && obstacle.x + obstacle.width < player.x) {
                obstacle.scored = true;
                audioSystem.playPointSound();
                
                // GameEngineのポイント計算メソッドを呼び出し
                if (window.game && window.game.addObstaclePoints) {
                    window.game.addObstaclePoints(obstacle.type, obstacle.x + obstacle.width, obstacle.y);
                }
            }
            
            if (obstacle.x <= -50 || !obstacle.active) {
                this.returnToPool(obstacle);
                return false;
            }
            return true;
        });

        // 難易度と速度に応じた障害物の生成間隔を計算
        const speedMultiplier = Math.max(1, gameSpeed / 1.5); // 初期速度1.5を基準
        const difficultyMultiplier = Math.max(1, difficultyLevel * 0.2);
        
        const currentInterval = Math.max(
            25,  // 最小間隔（さらに短縮して密度アップ）
            Math.floor(this.baseObstacleInterval / (speedMultiplier * difficultyMultiplier))
        );
        const currentRandomness = Math.min(
            80,  // 最大ランダム性を増加
            this.obstacleRandomness + (difficultyLevel * 4) + (speedMultiplier * 5)
        );
        


        // パターンベース生成または通常生成
        this.obstacleTimer++;
        this.patternTimer++;
        
        // パターン生成（速度に応じて確率が上昇、難易度3以上）
        const patternProbability = Math.min(0.6, 0.3 + (speedMultiplier - 1) * 0.1);
        if (difficultyLevel >= 3 && Math.random() < patternProbability && 
            this.obstacleTimer > currentInterval + Math.random() * currentRandomness) {
            this.spawnPattern(difficultyLevel, gameSpeed);
            this.obstacleTimer = 0;
        }
        // 通常の単体生成
        else if (this.obstacleTimer > currentInterval + Math.random() * currentRandomness) {
            this.createObstacle(difficultyLevel, gameSpeed);
            this.obstacleTimer = 0;
        }
    }

    // 障害物の描画
    draw(ctx) {
        this.obstacles.forEach(obstacle => {
            ctx.fillStyle = obstacle.color;
            
            if (obstacle.type === 'spike') {
                // スパイクの描画
                ctx.beginPath();
                ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
                ctx.lineTo(obstacle.x + obstacle.width/2, obstacle.y);
                ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
                ctx.closePath();
                ctx.fill();
            } else if (obstacle.type === 'moving') {
                // 動く障害物の描画（円形）
                ctx.beginPath();
                ctx.arc(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, 
                       obstacle.width/2, 0, Math.PI * 2);
                ctx.fill();
                // 動きを示すトレイル
                ctx.fillStyle = obstacle.color + '44';
                ctx.fillRect(obstacle.x, obstacle.y - 2, obstacle.width, 2);
            } else if (obstacle.type === 'breakable') {
                // 壊れる障害物の描画（クラック模様）
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                if (obstacle.health < 2) {
                    // ダメージがある場合はクラック表示
                    ctx.beginPath();
                    ctx.moveTo(obstacle.x + 10, obstacle.y + 5);
                    ctx.lineTo(obstacle.x + 25, obstacle.y + 35);
                    ctx.moveTo(obstacle.x + 20, obstacle.y + 10);
                    ctx.lineTo(obstacle.x + 30, obstacle.y + 30);
                    ctx.stroke();
                }
            } else if (obstacle.type === 'powerup') {
                // パワーアップアイテムの描画（星形）
                this.drawStar(ctx, obstacle.x + obstacle.width/2, 
                             obstacle.y + obstacle.height/2, 5, obstacle.width/2, obstacle.width/4);
            } else {
                // 通常のボックスの描画
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                
                // 装飾
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.fillRect(obstacle.x + 2, obstacle.y + 2, obstacle.width - 4, 4);
            }
        });
    }
    
    // 星形を描画するヘルパーメソッド
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rotation = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rotation) * outerRadius;
            y = cy + Math.sin(rotation) * outerRadius;
            ctx.lineTo(x, y);
            rotation += step;
            
            x = cx + Math.cos(rotation) * innerRadius;
            y = cy + Math.sin(rotation) * innerRadius;
            ctx.lineTo(x, y);
            rotation += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    // 衝突判定
    checkCollision(player, audioSystem) {
        const playerBounds = player.getBounds();
        
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            if (playerBounds.x < obstacle.x + obstacle.width &&
                playerBounds.x + playerBounds.width > obstacle.x &&
                playerBounds.y < obstacle.y + obstacle.height &&
                playerBounds.y + playerBounds.height > obstacle.y) {
                
                // パワーアップの場合は収集
                if (obstacle.isCollectable) {
                    this.collectPowerup(obstacle, audioSystem);
                    return false; // 衝突ではない
                }
                
                // 壊れる障害物の場合はダメージ処理
                if (obstacle.type === 'breakable' && obstacle.health > 1) {
                    obstacle.health--;
                    obstacle.color = '#A1887F'; // 色を変える
                    return false; // まだ壊れていない
                }
                
                return true; // 通常の衝突
            }
        }
        return false;
    }
    
    // パワーアップ収集
    collectPowerup(obstacle, audioSystem) {

        // 効果音を鳴らす
        if (audioSystem && audioSystem.playPowerupSound) {

            audioSystem.playPowerupSound();
        }
        
        // GameEngineのパワーアップ処理を呼び出し
        if (window.game && window.game.processPowerup) {
            window.game.processPowerup('scoreBoost');
            window.game.addObstaclePoints('powerup', obstacle.x, obstacle.y);
        }
        
        // 障害物を非アクティブにして次回のfilterで削除されるようにする
        obstacle.active = false;
        obstacle.isCollectable = false;
        this.returnToPool(obstacle);
    }

    // リセット
    reset() {
        // アクティブな障害物をプールに返却
        this.obstacles.forEach(obstacle => this.returnToPool(obstacle));
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.baseObstacleInterval = 400;  // 初期の障害物間隔（4倍に拡大）
        this.obstacleRandomness = 20;
        this.currentPatternIndex = 0;
        this.patternTimer = 0;
    }

    // 全ての障害物を取得
    getObstacles() {
        return this.obstacles;
    }
}