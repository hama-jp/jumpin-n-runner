class InputHandler {
    constructor(canvas, gameEngine) {
        this.canvas = canvas;
        this.gameEngine = gameEngine;
        this.isSpacePressed = false;
        this.mouseDownTimer = null;
        this.touchStartTime = null;
        
        this.initEventListeners();
    }

    initEventListeners() {
        // キーボード操作
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // マウス操作
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));

        // タッチ操作（モバイル対応）
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        this.canvas.addEventListener('touchcancel', (e) => this.handleTouchCancel(e));
    }

    // キーボード操作
    handleKeyDown(e) {
        if (e.code === 'Space' && !this.isSpacePressed) {
            e.preventDefault();
            this.isSpacePressed = true;
            this.gameEngine.startJumpCharge();
        }
    }

    handleKeyUp(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            this.isSpacePressed = false;
            this.gameEngine.executeJump();
        }
    }

    // マウス操作
    handleMouseDown(e) {
        e.preventDefault();
        this.gameEngine.startJumpCharge();
        this.mouseDownTimer = Date.now();
    }

    handleMouseUp(e) {
        e.preventDefault();
        const pressDuration = this.mouseDownTimer ? Date.now() - this.mouseDownTimer : 0;
        
        // 非常に短いクリック（100ms未満）は即ジャンプとして扱う
        if (pressDuration < 100 && this.gameEngine.canExecuteQuickJump()) {
            this.gameEngine.executeQuickJump();
        } else {
            this.gameEngine.executeJump();
        }
        this.mouseDownTimer = null;
    }

    handleMouseLeave(e) {
        if (this.gameEngine.player.isCharging) {
            this.gameEngine.executeJump();
        }
        this.mouseDownTimer = null;
    }

    // タッチ操作
    handleTouchStart(e) {
        e.preventDefault();
        this.gameEngine.startJumpCharge();
        this.touchStartTime = Date.now();
    }

    handleTouchEnd(e) {
        e.preventDefault();
        const pressDuration = this.touchStartTime ? Date.now() - this.touchStartTime : 0;
        
        // 非常に短いタップ（100ms未満）は即ジャンプとして扱う
        if (pressDuration < 100 && this.gameEngine.canExecuteQuickJump()) {
            this.gameEngine.executeQuickJump();
        } else {
            this.gameEngine.executeJump();
        }
        this.touchStartTime = null;
    }

    handleTouchCancel(e) {
        if (this.gameEngine.player.isCharging) {
            this.gameEngine.executeJump();
        }
        this.touchStartTime = null;
    }

    // クリーンアップ
    destroy() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
        this.canvas.removeEventListener('touchcancel', this.handleTouchCancel);
    }
}