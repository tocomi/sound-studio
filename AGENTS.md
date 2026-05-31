# AGENTS.md

Sound Studio のコーディングエージェント向けガイド。人間向けの概要は [README.md](./README.md)、仕様の正本は [docs/](./docs) を参照。

## このアプリは何か

ローカルの動画／音声を取り込み、**速度を落としても音程を保ったまま**、名前付きの区間（セクション）を複数登録して**区間ループ再生**する**音楽練習サポートツール**。DAW・録音・サンプラーではない。機能追加の相談では「練習に効くか」「v1 スコープか future か」をまず確認する。

- [docs/PRODUCT.md](./docs/PRODUCT.md) — 何のアプリか / スコープ / 非対象
- [docs/DESIGN.md](./docs/DESIGN.md) — 画面・操作・UI 方針
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — 状態管理・音声処理・保存
- [docs/ROADMAP.md](./docs/ROADMAP.md) — v0 / v1 / future の優先順位

## 開発コマンド

```bash
pnpm dev          # 開発サーバ（Vite）
pnpm build        # 型チェック + 本番ビルド（tsgo -b && vite build）
pnpm typecheck    # 型チェックのみ（tsgo -b）
pnpm lint         # oxlint
pnpm lint:fix     # oxlint --fix
pnpm format       # oxfmt（整形）
pnpm format:check # oxfmt --check
```

- パッケージマネージャは **pnpm**（npm / yarn は使わない）。Node・pnpm のバージョンは mise で固定。
- コミット時は lefthook の pre-commit で `lint` と `format:check` が走る。**コミット前に `pnpm lint` と `pnpm format` を通す**こと。

## 設計上の必須ルール

これらは [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) の要点。逸脱する場合は必ず相談する。

- **音声処理はネイティブの `<video>` / `<audio>` 要素のみ**。wavesurfer.js や Web Audio ベースの DSP は v1 では導入しない（複雑さ回避のため意図的に見送り済み）。
- **状態管理ライブラリを入れない**。React 標準（Context + `useReducer` + カスタムフック）で実装する。
- **再生のリアルタイム状態**（`currentTime` 等）は `usePlayer` に閉じ込め、React state へ高頻度同期しない。**保存の真実は React 側、再生と表示はメディア要素側**。
- **設定は localStorage 保存**。ファイル本体は保存しない。同定キーは **`size + lastModified`**（`name` はキーに含めず表示用のみ — リネーム耐性のため）。
- 波形表示・キー変更（移調）・URL 取り込み・ループ回数指定・ファイル本体保存は **すべて future**。v1 に勝手に入れない。

## コード規約

- 言語は TypeScript + React 19（React Compiler 有効 → 手動の `useMemo`/`useCallback` メモ化は基本不要）。
- セクションは常に**配列**として扱う（v1 から複数対応）。データモデルは ARCHITECTURE.md の `Section` / `FileSettings` 型に従う。
- コンポーネントは関心ごとに分割（`MediaStage` / `Transport` / `SpeedControl` / `SectionList` 等）。`app.tsx` は **画面合成のみ**を行う薄いルートに保ち、フィーチャー UI やアプリ状態をインラインで抱え込まない。
- **配置はレイヤーで分ける**：ビューは `components/`（1 コンポーネント 1 ディレクトリ + stories）、アプリ状態のスライスを持つ hook は関心ごとのトップレベルディレクトリ（`player/` / `theme/` …）に置く。`components/` 配下に hook を混在させない。詳細は [ARCHITECTURE.md](./docs/ARCHITECTURE.md) のディレクトリ方針を参照。
- **import 方針**：同一ディレクトリ内や近いコンポーネント同士は相対 import、`src` 直下のレイヤー（`components/` / `player/` / `theme/` / `lib/` / `types.ts` など）をまたぐ場合は `@/` alias を使う。
- **型の置き場所**：複数レイヤーをまたぐドメイン型は `types.ts`（`LoadedMedia` / 将来の `Section` / `FileSettings`）。単一の hook やコンポーネントが所有する型はそのファイルへ同居させる（例：`ThemeMode` は `theme/use-theme.ts` が所有）。ビュー（葉コンポーネント）からドメイン型を import させない。
- Component / hook の主体には必ず JSDoc を付ける。内容は**何をするか**を簡潔に書いたうえで、**なぜその単位が必要か**（責務境界・設計上の理由）も書く。
- 既存ファイルの記述スタイル（命名・コメント量）に合わせる。
