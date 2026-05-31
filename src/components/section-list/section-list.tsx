/**
 * 登録済みセクションの一覧を表示する。
 * 区間ループの登録・選択は本アプリの中核機能なので、再生面（MediaStage / Transport）から
 * 独立した一覧の責務をここに閉じ込め、v1 でセクション配列・選択状態・ループ ON/OFF を
 * 受け取るようになっても App の画面合成を膨らませないために分けている。
 */
export function SectionList() {
  // v1 でセクション配列を props で受け取り、件数と一覧を描画する。現状は登録 UI 未実装のプレースホルダ。
  return (
    <aside className="flex min-h-72 flex-col rounded-lg border border-studio-border bg-studio-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-studio-text">セクション</h2>
        <span className="rounded-full bg-studio-surface-muted px-2 py-1 text-xs text-studio-text-muted">
          0
        </span>
      </div>
      <div className="mt-5 grid flex-1 place-items-center rounded-md border border-dashed border-studio-border bg-studio-surface-muted px-4 py-8 text-center">
        <div>
          <p className="text-sm font-medium text-studio-text-muted">未登録</p>
          <p className="mt-2 text-xs text-studio-text-soft">A / B loop points</p>
        </div>
      </div>
    </aside>
  )
}
