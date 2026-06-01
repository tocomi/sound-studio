import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { useFileSettingsActions, useFileSettingsState } from '@/state/file-settings-provider.tsx'

type SectionListProps = {
  currentTime: number
  duration: number
  isLoopEnabled: boolean
  onSectionActivated: (start: number) => void
}

function formatTime(time: number) {
  if (!Number.isFinite(time)) {
    return '0:00'
  }

  const totalSeconds = Math.max(0, Math.floor(time))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatSecondsInput(time: number) {
  return Number.isFinite(time) ? time.toFixed(2) : '0.00'
}

function readSeconds(value: string) {
  const parsedValue = Number(value)

  return Number.isFinite(parsedValue) ? parsedValue : 0
}

/**
 * 登録済みセクションの一覧を表示する。
 * 区間ループの登録・選択は本アプリの中核機能なので、再生面（MediaStage / Transport）から
 * 独立した一覧の責務をここに閉じ込め、v1 でセクション配列・選択状態・ループ ON/OFF を
 * 受け取るようになっても App の画面合成を膨らませないために分けている。
 */
export function SectionList({
  currentTime,
  duration,
  isLoopEnabled,
  onSectionActivated,
}: SectionListProps) {
  const { fileSettings, selectedSectionId } = useFileSettingsState()
  const actions = useFileSettingsActions()
  const sections = fileSettings?.sections ?? []
  const [isComposing, setIsComposing] = useState(false)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [draftStart, setDraftStart] = useState('0.00')
  const [draftEnd, setDraftEnd] = useState('8.00')
  const startSeconds = readSeconds(draftStart)
  const endSeconds = readSeconds(draftEnd)
  const canSaveDraft = endSeconds > startSeconds
  const isEditing = editingSectionId !== null
  const selectedSection = sections.find((section) => section.id === selectedSectionId) ?? null

  function handleAddSection() {
    setEditingSectionId(null)
    setDraftName(`セクション ${sections.length + 1}`)
    setDraftStart(formatSecondsInput(currentTime))
    setDraftEnd(formatSecondsInput(currentTime + 8))
    setIsComposing(true)
  }

  function handleEditSection(section: (typeof sections)[number]) {
    setEditingSectionId(section.id)
    setDraftName(section.name)
    setDraftStart(formatSecondsInput(section.start))
    setDraftEnd(formatSecondsInput(section.end))
    setIsComposing(true)
  }

  function handleSaveDraft() {
    if (!canSaveDraft) {
      return
    }

    if (editingSectionId) {
      actions.updateSection(
        editingSectionId,
        {
          name: draftName,
          start: startSeconds,
          end: endSeconds,
        },
        duration,
      )
      setIsComposing(false)
      setEditingSectionId(null)
      return
    }

    actions.createSection(
      {
        name: draftName,
        start: startSeconds,
        end: endSeconds,
      },
      duration,
    )
    setIsComposing(false)
  }

  function handleCancelDraft() {
    setIsComposing(false)
    setEditingSectionId(null)
  }

  function handleRemoveSection(id: string) {
    actions.removeSection(id)

    if (editingSectionId === id) {
      handleCancelDraft()
    }
  }

  function handleSectionToggle(section: (typeof sections)[number], isSelected: boolean) {
    if (isSelected) {
      actions.selectSection(null)
      return
    }

    actions.selectSection(section.id)
    onSectionActivated(section.start)
  }

  function handleSectionKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    section: (typeof sections)[number],
    isSelected: boolean,
  ) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    handleSectionToggle(section, isSelected)
  }

  return (
    <aside className="flex min-h-72 flex-col rounded-lg border border-studio-border bg-studio-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-studio-text">セクション</h2>
          {selectedSection ? (
            <div className="mt-1 flex min-w-0 items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-studio-accent" />
              <p className="truncate text-xs font-medium text-studio-text-muted">
                選択中: {selectedSection.name}
              </p>
            </div>
          ) : (
            <p className="mt-1 text-xs font-medium text-studio-text-soft">自由再生</p>
          )}
        </div>
        <div className="flex items-center">
          <button
            className="h-8 rounded-md bg-studio-accent px-3 text-sm font-semibold text-studio-accent-contrast transition hover:bg-studio-accent-hover focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:ring-offset-2 focus-visible:ring-offset-studio-surface focus-visible:outline-none disabled:opacity-40 motion-reduce:transition-none"
            type="button"
            disabled={isComposing}
            onClick={handleAddSection}
          >
            追加
          </button>
        </div>
      </div>

      {isComposing ? (
        <div className="mt-4 rounded-md border border-studio-border-strong bg-studio-surface-raised p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-studio-text-muted">
              {isEditing ? 'セクション編集' : '新規セクション'}
            </p>
            <span className="rounded-full bg-studio-surface-muted px-2 py-1 text-xs text-studio-text-soft">
              A/B
            </span>
          </div>
          <label
            className="block text-xs font-semibold text-studio-text-muted"
            htmlFor="section-name"
          >
            Name
          </label>
          <input
            className="mt-1 h-9 w-full rounded-md border border-studio-border bg-studio-surface px-2 text-sm font-semibold text-studio-text focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:outline-none"
            id="section-name"
            type="text"
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
          />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  className="text-xs font-semibold text-studio-text-muted"
                  htmlFor="section-start"
                >
                  A
                </label>
                <button
                  className="h-7 rounded-md border border-studio-border bg-studio-surface px-2 text-xs font-semibold text-studio-text-muted transition hover:border-studio-border-strong hover:bg-studio-surface-muted focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:outline-none motion-reduce:transition-none"
                  type="button"
                  onClick={() => setDraftStart(formatSecondsInput(currentTime))}
                >
                  現在
                </button>
              </div>
              <input
                className="mt-1 h-9 w-full rounded-md border border-studio-border bg-studio-surface px-2 text-sm font-semibold text-studio-text tabular-nums focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:outline-none"
                id="section-start"
                type="number"
                min="0"
                max={duration || undefined}
                step="0.01"
                value={draftStart}
                onChange={(event) => setDraftStart(event.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  className="text-xs font-semibold text-studio-text-muted"
                  htmlFor="section-end"
                >
                  B
                </label>
                <button
                  className="h-7 rounded-md border border-studio-border bg-studio-surface px-2 text-xs font-semibold text-studio-text-muted transition hover:border-studio-border-strong hover:bg-studio-surface-muted focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:outline-none motion-reduce:transition-none"
                  type="button"
                  onClick={() => setDraftEnd(formatSecondsInput(currentTime))}
                >
                  現在
                </button>
              </div>
              <input
                className="mt-1 h-9 w-full rounded-md border border-studio-border bg-studio-surface px-2 text-sm font-semibold text-studio-text tabular-nums focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:outline-none"
                id="section-end"
                type="number"
                min="0"
                max={duration || undefined}
                step="0.01"
                value={draftEnd}
                onChange={(event) => setDraftEnd(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <output className="text-xs font-medium text-studio-text-soft tabular-nums">
              {formatTime(startSeconds)} - {formatTime(endSeconds)}
            </output>
            <div className="flex gap-2">
              <button
                className="h-8 rounded-md border border-studio-border bg-studio-surface px-3 text-sm font-semibold text-studio-text-muted transition hover:border-studio-border-strong hover:bg-studio-surface-muted focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:outline-none motion-reduce:transition-none"
                type="button"
                onClick={handleCancelDraft}
              >
                キャンセル
              </button>
              <button
                className="h-8 rounded-md bg-studio-accent px-3 text-sm font-semibold text-studio-accent-contrast transition hover:bg-studio-accent-hover focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:outline-none disabled:opacity-40 motion-reduce:transition-none"
                type="button"
                disabled={!canSaveDraft}
                onClick={handleSaveDraft}
              >
                {isEditing ? '更新' : '保存'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {sections.length > 0 ? (
        <div className="mt-4 flex flex-1 flex-col gap-2 overflow-y-auto">
          {sections.map((section) => {
            const isSelected = section.id === selectedSectionId

            return (
              <div
                key={section.id}
                className={
                  isSelected
                    ? 'relative cursor-pointer overflow-hidden rounded-md border border-studio-border-strong bg-studio-surface-raised p-2 shadow-sm transition focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:outline-none motion-reduce:transition-none'
                    : 'relative cursor-pointer overflow-hidden rounded-md border border-studio-border bg-studio-surface-muted p-2 transition hover:border-studio-border-strong hover:bg-studio-surface-raised focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:outline-none motion-reduce:transition-none'
                }
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => handleSectionToggle(section, isSelected)}
                onKeyDown={(event) => handleSectionKeyDown(event, section, isSelected)}
              >
                {isSelected ? (
                  <span className="absolute inset-y-0 left-0 w-1 bg-studio-accent" />
                ) : null}
                <div className="w-full rounded-sm pl-1.5 text-left">
                  <span className="flex items-center gap-2">
                    <span className="block min-w-0 flex-1 truncate text-sm font-semibold text-studio-text">
                      {section.name}
                    </span>
                    {isSelected && isLoopEnabled ? (
                      <span className="rounded-full bg-studio-accent px-1.5 py-0.5 text-[0.625rem] font-bold tracking-wide text-studio-accent-contrast">
                        LOOP
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-xs text-studio-text-muted tabular-nums">
                    {formatTime(section.start)} - {formatTime(section.end)} /{' '}
                    {section.speed.toFixed(2)}x
                  </span>
                </div>
                <div className="mt-2 flex justify-end gap-1.5">
                  <button
                    className="grid size-7 place-items-center rounded-md border border-studio-border bg-studio-surface text-studio-text-muted transition hover:border-studio-border-strong hover:bg-studio-surface-raised hover:text-studio-text focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:outline-none motion-reduce:transition-none"
                    type="button"
                    aria-label={`${section.name}を編集`}
                    title="編集"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleEditSection(section)
                    }}
                  >
                    <Pencil aria-hidden="true" size={14} strokeWidth={2} />
                  </button>
                  <button
                    className="grid size-7 place-items-center rounded-md border border-studio-border bg-studio-surface text-studio-text-muted transition hover:border-studio-border-strong hover:bg-studio-surface-raised hover:text-studio-text focus-visible:ring-2 focus-visible:ring-studio-border-strong focus-visible:outline-none motion-reduce:transition-none"
                    type="button"
                    aria-label={`${section.name}を削除`}
                    title="削除"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleRemoveSection(section.id)
                    }}
                  >
                    <Trash2 aria-hidden="true" size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="mt-5 grid flex-1 place-items-center rounded-md border border-dashed border-studio-border bg-studio-surface-muted px-4 py-8 text-center">
          <div>
            <p className="text-sm font-medium text-studio-text-muted">未登録</p>
            <p className="mt-2 text-xs text-studio-text-soft">A / B loop points</p>
          </div>
        </div>
      )}
    </aside>
  )
}
