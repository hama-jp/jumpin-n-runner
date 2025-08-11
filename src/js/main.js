// ゲームインスタンスの作成
let game;

// ページ読み込み完了後にゲームを初期化
document.addEventListener('DOMContentLoaded', () => {
    game = new GameEngine();
});

// グローバル関数（HTMLから呼び出される）
async function initAndStart() {
    if (game) {
        await game.initAndStart();
    }
}

function toggleSound() {
    if (game) {
        game.toggleSound();
    }
}

// ゲーム再開用のグローバル関数
async function restartGame() {
    if (game) {
        await game.start();
    }
}