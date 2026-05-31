# Sound Studio

ローカルの動画・音声ファイルを取り込み、**再生速度を落としても音程を保ったまま**、特定の区間を繰り返し再生できる **楽器・音楽練習サポートツール**です。耳コピやフレーズの反復練習を支援します。

> ⚠️ まだ初期実装段階です。詳細な仕様は [`docs/`](./docs) を参照してください。

詳細・対象外機能は [docs/PRODUCT.md](./docs/PRODUCT.md) / [docs/ROADMAP.md](./docs/ROADMAP.md) を参照。

## 技術スタック

| 領域 | 採用 |
| --- | --- |
| UI | React 19（React Compiler 有効） |
| 言語 | TypeScript（`@typescript/native-preview` / `tsgo`） |
| ビルド | Vite 8（Rolldown） |
| Lint / Format | oxlint / oxfmt |
| Git hooks | lefthook（pre-commit で lint + format チェック） |
| ランタイム / pkg | Node 24.16.0 / pnpm 10.22.0（mise で管理） |

音声処理は **ネイティブの `<video>` / `<audio>` 要素のみ**で実装します（外部の音声ライブラリは使いません）。設計の詳細は [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) を参照。

## セットアップ

[mise](https://mise.jdx.dev/) で Node / pnpm のバージョンを固定しています。

```bash
mise install      # Node 24.16.0 / pnpm 10.22.0 を用意
pnpm install      # 依存をインストール（postinstall で lefthook も導入）
```

## 開発コマンド

```bash
pnpm dev          # 開発サーバ起動（Vite）
pnpm build        # 型チェック + 本番ビルド（tsgo -b && vite build）
pnpm preview      # ビルド成果物をプレビュー
pnpm typecheck    # 型チェックのみ（tsgo -b）
pnpm lint         # oxlint
pnpm lint:fix     # oxlint --fix
pnpm format       # oxfmt（整形）
pnpm format:check # oxfmt --check（整形チェック）
```

## ディレクトリ構成

```
sound-studio/
├─ docs/                 # 仕様ドキュメント
│  ├─ PRODUCT.md         #   何のアプリか / 対象ユーザー / スコープ
│  ├─ DESIGN.md          #   画面・操作フロー・UI 方針
│  ├─ ARCHITECTURE.md    #   状態管理・音声処理・保存形式
│  └─ ROADMAP.md         #   v0 / v1 / future の機能地図
├─ src/
│  ├─ main.tsx           # エントリポイント
│  └─ App.tsx            # ルートコンポーネント
├─ public/
└─ index.html
```

> 実装が進むにつれて `src/` 配下の構成は [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) の「ディレクトリ方針」に従って拡充していきます。

## ドキュメント

- [docs/PRODUCT.md](./docs/PRODUCT.md) — 何のアプリか、対象ユーザー、v1 スコープ
- [docs/DESIGN.md](./docs/DESIGN.md) — 画面・操作フロー・UI 方針
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — 状態管理・音声処理・データ保存
- [docs/ROADMAP.md](./docs/ROADMAP.md) — 機能の優先順位と未決定事項
