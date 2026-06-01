type FileKeySource = Pick<File, 'lastModified' | 'size'>

/**
 * ローカルファイルに紐づく設定を保存・復元するための localStorage key を作る。
 * ファイル名はリネームで変わるため使わず、File API から安価に取れる値だけに閉じ込める。
 */
export function fileKey(file: FileKeySource) {
  return `ss:file:${file.size}:${file.lastModified}`
}
