class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 100;
        this.y = 200;
        this.width = 40;
        this.height = 40;
        this.velocityY = 0;
        this.jumping = false;
        this.jumpPower = -12;
        this.gravity = 0.6;
        this.color = '#FF6B6B';
        this.rotation = 0;
        this.isCharging = false;
        this.chargeTime = 0;
        this.minJumpPower = -6;   // 最小ジャンプ（低い障害物用）
        this.maxJumpPower = -22;  // 最大ジャンプ（高い障害物用、1.5倍の高さ）
        this.chargeColor = '#FF6B6B';
    }

    update() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        
        // 地面との衝突
        if (this.y > this.canvas.height - 140) {
            this.y = this.canvas.height - 140;
            this.velocityY = 0;
            this.jumping = false;
            this.rotation = 0;
        }
        
        // チャージ中の処理
        if (this.isCharging && !this.jumping) {
            this.chargeTime++;
        }
        
        // ジャンプ中の回転
        if (this.jumping) {
            this.rotation += 0.1;
        }
    }

    draw(ctx, particleSystem) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation);
        
        // チャージ中のエフェクト
        if (this.isCharging) {
            const chargeRatio = Math.min(this.chargeTime / 10, 1);
            const glowSize = 5 + chargeRatio * 15;
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
            gradient.addColorStop(0, `hsla(${60 - chargeRatio * 60}, 100%, 60%, ${0.3 + chargeRatio * 0.3})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);
        }
        
        // 本体（チャージに応じて色を変化）
        if (this.isCharging) {
            const chargeRatio = Math.min(this.chargeTime / 10, 1);
            const hue = 60 - chargeRatio * 60; // 黄色から赤へ
            this.chargeColor = `hsl(${hue}, 70%, 60%)`;
            ctx.fillStyle = this.chargeColor;
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // 目
        ctx.fillStyle = 'white';
        ctx.fillRect(-this.width/2 + 5, -this.height/2 + 8, 8, 8);
        ctx.fillRect(-this.width/2 + 20, -this.height/2 + 8, 8, 8);
        
        ctx.fillStyle = 'black';
        ctx.fillRect(-this.width/2 + 7, -this.height/2 + 10, 4, 4);
        ctx.fillRect(-this.width/2 + 22, -this.height/2 + 10, 4, 4);
        
        // 笑顔（チャージ中は集中顔）
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (this.isCharging) {
            // 集中している表情
            ctx.moveTo(-8, 5);
            ctx.lineTo(8, 5);
        } else {
            // 通常の笑顔
            ctx.arc(0, 5, 10, 0, Math.PI);
        }
        ctx.stroke();
        
        ctx.restore();
        
        // チャージインジケーター（足元に表示）
        if (this.isCharging && !this.jumping) {
            const chargeRatio = Math.min(this.chargeTime / 10, 1);
            const barWidth = this.width * chargeRatio;
            
            // バーの背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(this.x, this.y + this.height + 5, this.width, 6);
            
            // バーの枠
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x, this.y + this.height + 5, this.width, 6);
            
            // チャージバー
            const gradient = ctx.createLinearGradient(this.x, 0, this.x + barWidth, 0);
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(1, '#FF4444');
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x, this.y + this.height + 5, barWidth, 6);
            
            // 最大チャージ時の輝き
            if (chargeRatio >= 1) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 2;
                ctx.strokeRect(this.x - 1, this.y + this.height + 4, this.width + 2, 8);
            }
        }

        // チャージ中のパーティクル生成
        if (this.isCharging && !this.jumping && this.chargeTime % 5 === 0) {
            particleSystem.createParticle(this.x + this.width/2, this.y + this.height, true);
        }

        // ジャンプ中のパーティクル生成
        if (this.jumping) {
            particleSystem.createParticle(this.x + this.width/2, this.y + this.height, false);
        }
    }

    // ジャンプチャージ開始
    startJumpCharge() {
        if (!this.jumping) {
            this.isCharging = true;
            this.chargeTime = 0;
        }
    }

    // ジャンプ実行
    executeJump(audioSystem) {
        if (!this.jumping) {
            if (this.isCharging) {
                // チャージ時間に応じてジャンプ力を計算（0～10フレームを0～1に正規化）
                const chargeRatio = Math.min(this.chargeTime / 10, 1);
                
                // ジャンプ力を計算（最小から最大まで）
                // chargeRatio が 0 なら minJumpPower(-6)、1 なら maxJumpPower(-15)
                this.velocityY = this.minJumpPower + (this.maxJumpPower - this.minJumpPower) * chargeRatio;
                
                this.jumping = true;
                this.isCharging = false;
                
                // チャージ量に応じた音を鳴らす
                audioSystem.playJumpSound(chargeRatio);
                
                this.chargeTime = 0;
                
                return chargeRatio; // 大ジャンプ判定用に返す
            } else {
                // チャージなしの即ジャンプ（最小ジャンプ）
                this.velocityY = this.minJumpPower;
                this.jumping = true;
                audioSystem.playJumpSound(0);
                return 0;
            }
        }
        return 0;
    }

    // 衝突判定用の境界ボックス取得
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    // リセット
    reset() {
        this.y = 200;
        this.velocityY = 0;
        this.jumping = false;
        this.rotation = 0;
        this.color = '#FF6B6B';
        this.isCharging = false;
        this.chargeTime = 0;
        this.chargeColor = '#FF6B6B';
    }
}