# ARCHITECTURE — 設計方針

## 基本方針

- **音声処理はネイティブの `<video>` / `<audio>` 要素のみ**で行う。外部の音声ライブラリ（wavesurfer.js / Web Audio ベースの DSP）は v1 では使わない。
- 速度変更・音程維持・シーク・ループは、すべて標準のメディア要素 API + 軽量な自前ロジックで実現できる。
- 状態管理ライブラリ（Zustand / Jotai 等）は導入しない。**React 標準**（Context + `useReducer` + カスタムフック）で十分な規模。

## 状態の 2 分類

| 種類 | 例 | 真実の源 | 扱い |
| --- | --- | --- | --- |
| 再生のリアルタイム状態 | `currentTime`、再生中か、実効速度 | `<video>`/`<audio>` 要素 | React state に高頻度同期しない。`usePlayer` 内で扱い、必要箇所だけ購読 |
| アプリの編集状態 | セクション配列、選択中セクション、ループ ON/OFF、グローバル速度 | React（Context + reducer） | localStorage に永続化する対象 |

原則：**保存データの真実は React 側、再生と表示はメディア要素側**。

## 音声処理の責務分離

### `usePlayer`（再生エンジンのラッパー）

メディア要素の `ref` をラップし、命令的な再生制御を一箇所に集約するカスタムフック。

- `play()` / `pause()` / `seek(t)`
- `setRate(rate)` … `media.playbackRate = rate`、`media.preservesPitch = true` を保証
- **区間ループ監視** … `requestAnimationFrame`（または `timeupdate`）で `currentTime` を監視し、ループ ON かつアクティブ区間の `end` を越えたら `currentTime = start` に戻す
- セクション選択時に `start` へシークして再生開始

UI コンポーネントは `currentTime` を直接 React state に持たず、`usePlayer` が公開する購読手段（例：rAF で更新するバー専用の subscribe、または ref 経由の直接 DOM 更新）を使い、**再レンダーの多発を避ける**。

### 編集状態ストア（Context + useReducer）

- アクション例：`loadFile` / `addSection` / `updateSection` / `removeSection` / `selectSection` / `toggleLoop` / `setGlobalSpeed`
- セクションのデータモデル：
  ```ts
  type Section = {
    id: string
    name: string
    start: number   // 秒
    end: number     // 秒
    speed: number    // このセクションの再生速度
  }

  type FileSettings = {
    fileLabel: string        // 表示用のファイル名（マッチングには使わない）
    globalSpeed: number      // セクション未選択時の速度
    seekStepSeconds: number  // 巻き戻し・早送りの秒数
    sections: Section[]
  }
  ```

### 同期の向き

```
React state（保存の真実）── 反映 ──▶ メディア要素 / セクション表示
        ▲                                      │
        └────── ユーザー操作（速度変更など）◀─────┘
```

将来 UI でドラッグ編集を入れる場合も、操作結果は必ず reducer 経由で React state に書き戻し、そこを唯一の真実とする。

## データ保存（永続化）

- 保存先：**localStorage**（ファイル本体は保存しない）。
- 保存単位：ファイルごとに 1 つの `FileSettings`。
- **ファイル同定キー = `size` + `lastModified`**。`File` から取得でき、計算コストがゼロ。**ファイル名はキーに含めない**（リネームしても設定を引き継ぐため）。`name` は表示用ラベルとして別途保存するだけ。
  ```ts
  const key = `ss:file:${file.size}:${file.lastModified}`
  ```
- 同定ロジックは 1 つの関数（例 `fileKey(file)`）に隔離し、将来ハッシュ等へ差し替え可能にする。
- 衝突リスク（同サイズ かつ 同更新時刻の別ファイル）は個人利用では実質起きないため許容する。

## エラー処理方針

- **非対応／壊れたファイル**：メディア要素の `error` イベントを捕捉し、空状態に戻して理由を表示。読み込み前に MIME / 拡張子で軽くガードする。
- **保存設定の不整合**：localStorage の JSON はスキーマ検証してから適用。壊れていたら無視して新規扱い（保存データでアプリを落とさない）。
- **区間の無効値**：`start >= end` や範囲外を reducer 側で正規化（クランプ）する。
- **想定外例外**：再生エンジン層の例外は UI を巻き込まないよう `usePlayer` 内で握り、ユーザーには「再読み込みしてください」程度の回復導線を出す。

## ディレクトリ方針

ファイル・フォルダ名は **kebab-case** で統一する（シンボル名は PascalCase / camelCase のまま）。

```
src/
├─ main.tsx
├─ app.tsx             # 画面合成のみを行う薄いルート。状態の所有は各 hook へ寄せる
├─ types.ts            # 複数レイヤーをまたぐドメイン型（LoadedMedia / 将来の Section, FileSettings）
├─ lib/                # 横断的な小さな helper（cn など）
├─ player/             # 再生エンジン（use-player, use-keyboard-shortcuts, 将来のループ監視）
├─ theme/              # テーマ状態 hook（use-theme）と所有する型（ThemeMode）
└─ components/         # ビューのみ。1 コンポーネント 1 ディレクトリ + stories
   ├─ app-header/
   ├─ empty-state/
   ├─ media-stage/
   ├─ section-list/
   ├─ speed-control/
   ├─ theme-toggle/
   └─ transport/
```

**レイヤーで分ける**方針。ビューは必ず `components/` に置き、アプリ状態のスライスを持つ hook は
関心ごとのトップレベルディレクトリ（`player/` / `theme/` …）に置く。`components/` に hook を混在させない。

import は、同一ディレクトリ内や近いコンポーネント同士では相対 import を使う。`src` 直下のレイヤー
（`components/` / `player/` / `theme/` / `lib/` / `types.ts` など）をまたぐ場合は `@/` alias を使い、
ファイルの置き場所に依存する `../../` を増やさない。

v1 で導入予定の以下は、対応する機能を実装するタイミングで追加する（**空ディレクトリを先回りで作らない**）。

- `state/` — Context + `useReducer`、セクション編集状態（`app.tsx` の `useState` 群の移設先）
- `storage/` — localStorage 同期、`fileKey()`

> 実際の分割は実装しながら調整する。本ドキュメントは「責務の線引き」を示すものであり、最終的なファイル名を縛るものではない。
