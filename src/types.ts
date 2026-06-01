/**
 * 読み込んだローカルファイルを、音声として扱うか動画として扱うかを表す。
 * 表示コンポーネントが native media element を選ぶための最小限の分類に留める。
 */
export type MediaKind = 'audio' | 'video'

/**
 * 現在のセッションで読み込まれているローカルメディアを表す。
 * ファイル本体は永続化せず、再生用 URL もブラウザ上の一時的な参照として扱う。
 */
export type LoadedMedia = {
  /** ユーザーが選択したローカルファイル本体。保存キー生成と表示名取得に使う。 */
  file: File
  /** UI が audio / video のどちらの media element を描画するかを決める分類。 */
  kind: MediaKind
  /** `URL.createObjectURL` で作る、現在のセッション中だけ有効な再生用 URL。 */
  url: string
}

/**
 * 名前を付けて繰り返し練習する、メディア内の時間範囲を表す。
 * 再生中の現在時刻ではなく、保存対象になる区間定義として扱う。
 */
export type Section = {
  /** セクションを選択・更新・削除するときの安定した識別子。 */
  id: string
  /** 一覧に表示する練習区間の名前。 */
  name: string
  /** 区間開始位置。メディア先頭からの秒数で保持する。 */
  start: number
  /** 区間終了位置。メディア先頭からの秒数で保持する。 */
  end: number
  /** このセクションを選んだときに適用する再生速度。 */
  speed: number
}

/**
 * ひとつのローカルファイルに紐づく、復元可能な練習設定を表す。
 * ファイル本体は保存せず、ファイル同定キーにぶら下げる設定値だけを保持する。
 */
export type FileSettings = {
  /** 表示用のファイル名。ファイル同定キーには含めない。 */
  fileLabel: string
  /** セクション未選択の自由再生時に使う再生速度。 */
  globalSpeed: number
  /** このファイルに登録された練習区間。v1 から常に配列として扱う。 */
  sections: Section[]
}
