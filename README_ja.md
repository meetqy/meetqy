# NameSage - AIによる日本語名生成ツール 🎯

[English](README.md) | [简体中文](README_zh.md) | [日本語](README_ja.md)

非日本語話者向けに文化的に適切な日本語名を生成する、AI技術を活用したモダンなWebアプリケーションです。ネオブルータリズムデザインスタイルを採用しています。

## 📸 プレビュー

![snipate_1.png](screenshots/snipate_1.png)

プレビュー: https://namesage.hellokaton.me

## ✨ 主な機能

- 🤖 **AIによる生成**：個人の特徴や好みに基づいて日本語名を自動生成
- 🎯 **文化的背景**：名前の意味や文化的な意義を詳細に説明
- 🔍 **文字解析**：各文字の画数と説明を含む
- 🔉 **発音ガイド**：正確な発音のためのピンインサポート
- 🔄 **複数の提案**：選択肢として複数の名前を生成
- 🌍 **異文化適応**：文化的な好みに合わせて名前を調整
- 📖 **個人的なストーリー**：個人のストーリーや意味を名前の提案に組み込む

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**:
  - Tailwind CSS
  - ネオブルータリズムデザインシステム
- **UIコンポーネント**:
  - Shadcn UI
  - Radix UI
- **アイコン**: Lucide React
- **状態管理**: React Hooks
- **AI統合**: DeepSeek API

## 🚀 はじめに

1. リポジトリをクローン：

```bash
git clone https://github.com/hellokaton/namesage.git
```

2. 依存関係をインストール：

```bash
pnpm install
```

3. 環境変数を設定：

```bash
cp .env.example .env.local
```

4. 開発サーバーを起動：

```bash
pnpm dev
```

## 💡 使用方法

1. 英語名と個人情報を入力
2. 名前の特徴に関する好みを選択
3. AIが生成した複数の日本語名オプションを受け取る
4. 各名前の詳細な説明を確認
5. 文化的背景とともにお気に入りの名前を選択

## 🤝 貢献

貢献は大歓迎です！お気軽にプルリクエストを送信してください。

## 📝 ライセンス

[MIT](LICENSE)

## 🙏 謝辞

- UIコンポーネントは [neobrutalism](https://www.neobrutalism.dev) から
- アイコンは [Lucide](https://lucide.dev) から
- AIは deepseek によって提供されています
