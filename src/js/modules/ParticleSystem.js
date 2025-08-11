class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    // パーティクルの生成
    createParticle(x, y, isCharging = false) {
        if (isCharging) {
            // チャージ中のパーティクル（上昇する光）
            for (let i = 0; i < 2; i++) {
                this.particles.push({
                    x: x + (Math.random() - 0.5) * 20,
                    y: y,
                    vx: (Math.random() - 0.5) * 1,
                    vy: -Math.random() * 2 - 1,
                    size: Math.random() * 4 + 2,
                    color: `hsl(${Math.random() * 60 + 30}, 100%, 70%)`,
                    life: 1
                });
            }
        } else {
            // 通常のジャンプパーティクル
            for (let i = 0; i < 5; i++) {
                this.particles.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: Math.random() * -3 - 1,
                    size: Math.random() * 3 + 2,
                    color: `hsl(${Math.random() * 60 + 30}, 100%, 50%)`,
                    life: 1
                });
            }
        }
    }

    // 大ジャンプ用の特別なパーティクル
    createBigJumpParticles(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: Math.random() * -5 - 2,
                size: Math.random() * 5 + 3,
                color: `hsl(${Math.random() * 60 + 30}, 100%, 60%)`,
                life: 1.5
            });
        }
    }

    // パーティクルの更新と描画
    update(ctx) {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // チャージパーティクルは重力が弱い
            if (particle.vy < 0) {
                particle.vy += 0.1;
            } else {
                particle.vy += 0.2;
            }
            
            particle.life -= 0.02;
            
            if (particle.life > 0) {
                ctx.globalAlpha = particle.life;
                ctx.fillStyle = particle.color;
                ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
                ctx.globalAlpha = 1;
                return true;
            }
            return false;
        });
    }

    // 全パーティクルをクリア
    clear() {
        this.particles = [];
    }

    // パーティクル数を取得（デバッグ用）
    getParticleCount() {
        return this.particles.length;
    }
}