class GrassEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.grassParticles = [];
        this.spawnTimer = 0;
        this.baseSpawnRate = 8; // フレーム間隔でスポーン頻度を制御
    }

    // 草パーティクルの生成
    createGrassParticle() {
        // 画面の右端から少し外側で生成
        const grassParticle = {
            x: this.canvas.width + 10,
            y: this.canvas.height - 100 + Math.random() * 30, // 地面付近でランダムな高さ
            width: 3 + Math.random() * 2, // 幅のバリエーション
            height: 8 + Math.random() * 6, // 高さのバリエーション
            speed: 2 + Math.random() * 1, // 基本速度にランダム性
            color: `hsl(${100 + Math.random() * 30}, ${60 + Math.random() * 20}%, ${35 + Math.random() * 15}%)`, // 緑系の色
            alpha: 0.6 + Math.random() * 0.3, // 透明度のバリエーション
            swayOffset: Math.random() * Math.PI * 2, // 揺れのオフセット
            swaySpeed: 0.1 + Math.random() * 0.05 // 揺れ速度
        };
        
        this.grassParticles.push(grassParticle);
    }

    // エフェクトの更新
    update(gameSpeed) {
        // スポーン制御
        this.spawnTimer++;
        if (this.spawnTimer >= this.baseSpawnRate) {
            // ランダムでスポーンするかどうかを決める（50%の確率）
            if (Math.random() < 0.5) {
                this.createGrassParticle();
            }
            this.spawnTimer = 0;
        }

        // 草パーティクルの更新
        this.grassParticles = this.grassParticles.filter(grass => {
            // ゲームスピードと個別スピードを掛け合わせて移動
            grass.x -= gameSpeed * grass.speed;
            
            // 揺れ効果
            grass.swayOffset += grass.swaySpeed;
            
            // 画面左端を過ぎたら削除
            return grass.x > -20;
        });
    }

    // エフェクトの描画
    draw(ctx) {
        this.grassParticles.forEach(grass => {
            ctx.save();
            
            // 透明度設定
            ctx.globalAlpha = grass.alpha;
            
            // 揺れ効果の計算
            const swayAmount = Math.sin(grass.swayOffset) * 2;
            
            // 草の描画（簡単な縦線）
            ctx.fillStyle = grass.color;
            ctx.fillRect(
                grass.x + swayAmount, 
                grass.y, 
                grass.width, 
                grass.height
            );
            
            // より草らしく見せるために上部を少し細くする
            ctx.fillRect(
                grass.x + swayAmount + grass.width * 0.2, 
                grass.y - grass.height * 0.3, 
                grass.width * 0.6, 
                grass.height * 0.4
            );
            
            ctx.restore();
        });
    }

    // リセット
    reset() {
        this.grassParticles = [];
        this.spawnTimer = 0;
    }

    // デバッグ用：現在の草パーティクル数を取得
    getParticleCount() {
        return this.grassParticles.length;
    }
}