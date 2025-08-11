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
        const y = this.canvas.height - 100 + Math.random() * 50; // 地面付近でランダムな高さ
        
        // Y座標に基づいて奥行きを計算（下に行くほど手前）
        const groundLevel = this.canvas.height - 100; // 地面レベル
        const maxDepth = 50; // 最大奥行き範囲
        const depthRatio = Math.max(0, (y - groundLevel) / maxDepth); // 0(奥) to 1(手前)
        
        // 奥行きに応じて速度を調整
        // 手前（下側）ほど速く、奥（キャラクター付近）はゲーム速度と同じくらい
        const baseSpeedMultiplier = 0.8 + (depthRatio * 1.5); // 0.8倍から2.3倍
        
        // 奥行きに応じてサイズも調整
        const sizeMultiplier = 0.5 + (depthRatio * 0.8); // 奥は小さく、手前は大きく
        
        const grassParticle = {
            x: this.canvas.width + 10,
            y: y,
            width: (2 + Math.random() * 3) * sizeMultiplier,
            height: (6 + Math.random() * 8) * sizeMultiplier,
            speed: baseSpeedMultiplier, // ゲーム速度との掛け合わせ用
            depthRatio: depthRatio, // 後で使用
            color: `hsl(${95 + Math.random() * 35}, ${50 + Math.random() * 30}%, ${25 + Math.random() * 20}%)`,
            alpha: (0.3 + Math.random() * 0.4) * (0.6 + depthRatio * 0.4), // 手前ほど濃く
            swayOffset: Math.random() * Math.PI * 2,
            swaySpeed: (0.08 + Math.random() * 0.04) * (1 - depthRatio * 0.3) // 奥ほどゆっくり揺れる
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
            // 奥行きによる速度差を適用
            // 手前（下側）はより速く、キャラクター付近はゲーム速度と同程度
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