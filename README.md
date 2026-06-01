# Sound Studio

ローカルの動画・音声ファイルを取り込み、**再生速度を落としても音程を保ったまま**、特定の区間を繰り返し再生できる **楽器・音楽練習サポートツール**です。耳コピやフレーズの反復練習を支援します。

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
