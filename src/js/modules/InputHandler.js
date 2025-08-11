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
        // bind methods to preserve 'this' context
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleTouchCancel = this.handleTouchCancel.bind(this);

        // キーボード操作
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);

        // マウス操作
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave);

        // タッチ操作（モバイル対応）
        this.canvas.addEventListener('touchstart', this.handleTouchStart);
        this.canvas.addEventListener('touchend', this.handleTouchEnd);
        this.canvas.addEventListener('touchcancel', this.handleTouchCancel);
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