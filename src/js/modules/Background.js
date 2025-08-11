class Background {
    constructor(canvas) {
        this.canvas = canvas;
        this.clouds = [];
        this.mountains = [];
        this.init();
    }

    // パララックス背景の初期化
    init() {
        // 雲の生成
        this.clouds = [];
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * 150,
                width: 60 + Math.random() * 40,
                speed: 0.5 + Math.random() * 0.5
            });
        }
        
        // 山の生成
        this.mountains = [];
        for (let i = 0; i < 3; i++) {
            this.mountains.push({
                x: i * 300,
                width: 200 + Math.random() * 100,
                height: 100 + Math.random() * 50,
                color: `hsl(${260 + Math.random() * 40}, 30%, ${40 + Math.random() * 20}%)`
            });
        }
    }

    // 背景の描画
    draw(ctx, gameSpeed) {
        // グラデーション背景
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98D8E8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 太陽
        ctx.beginPath();
        ctx.arc(650, 80, 30, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.closePath();
        
        // 雲の描画と移動
        this.clouds.forEach(cloud => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.ellipse(cloud.x, cloud.y, cloud.width/2, 20, 0, 0, Math.PI * 2);
            ctx.ellipse(cloud.x - 20, cloud.y, cloud.width/3, 15, 0, 0, Math.PI * 2);
            ctx.ellipse(cloud.x + 20, cloud.y, cloud.width/3, 15, 0, 0, Math.PI * 2);
            ctx.fill();
            
            cloud.x -= cloud.speed * gameSpeed/3;
            if (cloud.x < -cloud.width) {
                cloud.x = this.canvas.width + cloud.width;
            }
        });
        
        // 山の描画と移動
        this.mountains.forEach(mountain => {
            ctx.fillStyle = mountain.color;
            ctx.beginPath();
            ctx.moveTo(mountain.x, this.canvas.height - 100);
            ctx.lineTo(mountain.x + mountain.width/2, this.canvas.height - 100 - mountain.height);
            ctx.lineTo(mountain.x + mountain.width, this.canvas.height - 100);
            ctx.closePath();
            ctx.fill();
            
            mountain.x -= gameSpeed * 0.3;
            if (mountain.x < -mountain.width) {
                mountain.x = this.canvas.width;
            }
        });
    }

    // 地面の描画
    drawGround(ctx) {
        // 地面
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
        
        // 草のテクスチャ
        ctx.fillStyle = '#45A049';
        for (let i = 0; i < this.canvas.width; i += 20) {
            ctx.fillRect(i, this.canvas.height - 100, 2, 10);
            ctx.fillRect(i + 10, this.canvas.height - 95, 2, 8);
        }
    }

    // 背景要素をリセット
    reset() {
        this.init();
    }
}