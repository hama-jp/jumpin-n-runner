# Jumpin' N Runner

HTML5 Canvas を使用したブラウザゲームです。障害物を飛び越えながら生き残る 2D プラットフォーマーゲームです。

🎮 **[今すぐプレイ！](https://hama-jp.github.io/jumpin-n-runner/)**

[English README](README_EN.md)

## 🎮 ゲームの特徴

- **可変ジャンプシステム**: 長押しで高いジャンプ、短押しで低いジャンプが可能
- **プログレッシブ難易度**: 時間経過とともに速度と難易度が上昇
- **手続き的オーディオ**: Tone.js を使用したリアルタイム音響効果
- **マルチデバイス対応**: キーボード、マウス、タッチ操作に対応
- **視覚エフェクト**: パーティクルシステムによる豊富な視覚効果

## 🚀 プレイ方法

1. `index.html` をブラウザで開く
2. 「ゲームスタート」ボタンをクリック
3. 操作方法：
   - **PC**: スペースキー または マウスクリック
   - **モバイル**: 画面タップ
   - **短押し**: 低いジャンプ（小さな障害物用）
   - **長押し**: 高いジャンプ（高い障害物用）

## 🏗️ プロジェクト構造

```
├── index.html                    # メインHTMLファイル
├── src/
│   ├── css/
│   │   └── styles.css           # スタイルシート
│   └── js/
│       ├── main.js              # エントリーポイント
│       └── modules/
│           ├── AudioSystem.js    # 音響システム
│           ├── Background.js     # 背景描画
│           ├── GameEngine.js     # ゲームエンジン
│           ├── InputHandler.js   # 入力処理
│           ├── Obstacle.js       # 障害物管理
│           ├── ParticleSystem.js # パーティクル効果
│           └── Player.js         # プレイヤー制御
└── assets/
    └── audio/                   # 将来の音声ファイル用
```

## 🛠️ 技術スタック

- **HTML5 Canvas**: グラフィック描画
- **Vanilla JavaScript**: ES6+ クラス構文使用
- **Tone.js**: Web Audio API による音響生成
- **CSS3**: レスポンシブデザインとアニメーション

## 🎵 音響システム

- BGM: 4小節の手続き的音楽パターン
- 効果音: プレイヤーのアクションに応じた動的音響効果
  - ジャンプ音: チャージ量に応じて3段階
  - ポイント獲得音
  - スピードアップ音
  - ゲームオーバー音

## 📱 対応ブラウザ

- Chrome 60+
- Firefox 55+
- Safari 13+
- Edge 79+

## 🔧 開発者向け情報

### ゲーム実行
```bash
# ローカルサーバーを起動（推奨）
python -m http.server 8000
# または
npx serve .

# ブラウザで http://localhost:8000 を開く
```

### 新機能追加
1. `src/js/modules/` に新しいモジュールを作成
2. `index.html` にスクリプト参照を追加
3. `GameEngine` クラスで初期化とゲームループに統合

### デバッグ
- ブラウザの開発者ツールを使用
- `CLAUDE.md` に詳細な開発ガイダンスを記載

## 🎯 ゲームルール

- **スコア**: 時間経過とともに自動増加
- **障害物**: 3種類（ボックス、スパイク、高い障害物）
- **難易度**: 300フレームごとに速度上昇
- **衝突判定**: 障害物に触れるとゲームオーバー
- **ハイスコア**: LocalStorage に保存

## 🤝 コントリビューション

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/新機能`)
3. 変更をコミット (`git commit -am '新機能を追加'`)
4. ブランチにプッシュ (`git push origin feature/新機能`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🙏 謝辞

- [Tone.js](https://tonejs.github.io/) - Web Audio API ライブラリ
- HTML5 Canvas API
- Modern JavaScript ES6+ features