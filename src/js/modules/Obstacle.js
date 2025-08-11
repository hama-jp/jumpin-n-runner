class ObstacleManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.baseObstacleInterval = 100;  // 初期の障害物間隔（広め）
        this.obstacleRandomness = 20;     // 初期のランダム性（小さめ）
    }

    // 障害物の生成
    createObstacle(difficultyLevel) {
        const types = ['box', 'spike', 'tall'];
        // 難易度が上がるほど危険な障害物の確率が上がる
        let typeWeights = [3, 1, 1];  // 初期は箱が多め
        if (difficultyLevel > 3) {
            typeWeights = [2, 2, 1];  // 中盤はスパイクも増える
        }
        if (difficultyLevel > 6) {
            typeWeights = [1, 2, 2];  // 後半は高い障害物とスパイクが多め
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
        
        let obstacle = {
            x: this.canvas.width,
            type: type,
            color: '',
            scored: false
        };
        
        // 障害物のサイズを少し調整（高さ調整可能なジャンプに対応）
        switch(type) {
            case 'box':
                obstacle.y = this.canvas.height - 135;
                obstacle.width = 30;
                obstacle.height = 35;
                obstacle.color = '#FF9800';
                break;
            case 'spike':
                obstacle.y = this.canvas.height - 115;
                obstacle.width = 25;
                obstacle.height = 15;
                obstacle.color = '#F44336';
                break;
            case 'tall':
                obstacle.y = this.canvas.height - 155;
                obstacle.width = 20;
                obstacle.height = 55;
                obstacle.color = '#9C27B0';
                break;
        }
        
        this.obstacles.push(obstacle);
        
        // 時々連続障害物を生成（難易度が上がると確率が上がる）
        if (difficultyLevel > 4 && Math.random() < 0.2 + (difficultyLevel * 0.02)) {
            setTimeout(() => {
                const secondType = Math.random() < 0.7 ? 'spike' : 'box';
                this.obstacles.push({
                    x: this.canvas.width,
                    y: secondType === 'spike' ? this.canvas.height - 115 : this.canvas.height - 135,
                    width: secondType === 'spike' ? 25 : 30,
                    height: secondType === 'spike' ? 15 : 35,
                    type: secondType,
                    color: secondType === 'spike' ? '#F44336' : '#FF9800',
                    scored: false
                });
            }, 400);
        }
    }

    // 障害物の更新
    update(gameSpeed, difficultyLevel, player, audioSystem) {
        // 障害物の移動とポイント獲得チェック
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.x -= gameSpeed;
            
            // 障害物を飛び越えたらポイント音を鳴らす
            if (!obstacle.scored && obstacle.x + obstacle.width < player.x) {
                obstacle.scored = true;
                audioSystem.playPointSound();
            }
            
            return obstacle.x > -50;
        });

        // 難易度に応じた障害物の生成間隔を計算
        const currentInterval = Math.max(
            40,  // 最小間隔（これより短くしない）
            this.baseObstacleInterval - (difficultyLevel * 5)  // 難易度が上がるごとに5フレーム短縮
        );
        const currentRandomness = Math.min(
            60,  // 最大ランダム性
            this.obstacleRandomness + (difficultyLevel * 3)  // 難易度が上がるごとにランダム性増加
        );

        // 新しい障害物の生成
        this.obstacleTimer++;
        if (this.obstacleTimer > currentInterval + Math.random() * currentRandomness) {
            this.createObstacle(difficultyLevel);
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
            } else {
                // ボックスの描画
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                
                // 装飾
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.fillRect(obstacle.x + 2, obstacle.y + 2, obstacle.width - 4, 4);
            }
        });
    }

    // 衝突判定
    checkCollision(player) {
        const playerBounds = player.getBounds();
        
        for (let obstacle of this.obstacles) {
            if (playerBounds.x < obstacle.x + obstacle.width &&
                playerBounds.x + playerBounds.width > obstacle.x &&
                playerBounds.y < obstacle.y + obstacle.height &&
                playerBounds.y + playerBounds.height > obstacle.y) {
                return true;
            }
        }
        return false;
    }

    // リセット
    reset() {
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.baseObstacleInterval = 100;
        this.obstacleRandomness = 20;
    }

    // 全ての障害物を取得
    getObstacles() {
        return this.obstacles;
    }
}