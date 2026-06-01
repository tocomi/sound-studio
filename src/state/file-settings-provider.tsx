import { createContext, useContext, useEffect, useReducer } from 'react'

import { loadFileSettings, saveFileSettings } from '@/settings/file-settings-storage.ts'
import type { MediaKind, Section } from '@/types.ts'

import type { FileSettingsAction, FileSettingsState } from './file-settings-reducer.ts'

import { fileSettingsReducer, initialFileSettingsState } from './file-settings-reducer.ts'

type FileSettingsContextValue = {
  state: FileSettingsState
  actions: {
    loadFile: (file: File) => void
    clearFile: () => void
    createSection: (draft: { name: string; start: number; end: number }, duration?: number) => void
    addSectionAt: (start: number, duration?: number) => void
    addSection: (section: Section, duration?: number) => void
    updateSection: (id: string, changes: Partial<Omit<Section, 'id'>>, duration?: number) => void
    removeSection: (id: string) => void
    selectSection: (id: string | null) => void
    toggleLoop: (enabled?: boolean) => void
    setGlobalSpeed: (speed: number) => void
    setSeekStepSeconds: (seekStepSeconds: number) => void
  }
}

const FileSettingsContext = createContext<FileSettingsContextValue | null>(null)

function mediaKindFor(file: File): MediaKind {
  return file.type.startsWith('video/') ? 'video' : 'audio'
}

function createSectionId() {
  return globalThis.crypto?.randomUUID?.() ?? `section-${Date.now()}`
}

function useRequiredFileSettingsContext() {
  const context = useContext(FileSettingsContext)

  if (!context) {
    throw new Error('useFileSettings must be used within FileSettingsProvider')
  }

  return context
}

/**
 * ファイル単位の練習設定を React state と localStorage の間で同期する。
 * UI は保存先を直接知らず、reducer の編集状態だけを読むための境界として置いている。
 */
export function FileSettingsProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(fileSettingsReducer, initialFileSettingsState)

  function loadFile(file: File) {
    const media = {
      file,
      kind: mediaKindFor(file),
      url: URL.createObjectURL(file),
    }
    const settings = loadFileSettings(window.localStorage, file)

    dispatch({
      type: 'loadFile',
      media,
      settings,
    })
  }

  function dispatchAction(action: FileSettingsAction) {
    dispatch(action)
  }

  function addSectionAt(start: number, duration?: number) {
    const sectionNumber = (state.fileSettings?.sections.length ?? 0) + 1
    const globalSpeed = state.fileSettings?.globalSpeed ?? 1

    dispatchAction({
      type: 'addSection',
      section: {
        id: createSectionId(),
        name: `セクション ${sectionNumber}`,
        start,
        end: start + 8,
        speed: globalSpeed,
      },
      duration,
    })
  }

  function createSection(draft: { name: string; start: number; end: number }, duration?: number) {
    const sectionNumber = (state.fileSettings?.sections.length ?? 0) + 1
    const globalSpeed = state.fileSettings?.globalSpeed ?? 1

    dispatchAction({
      type: 'addSection',
      section: {
        id: createSectionId(),
        name: draft.name || `セクション ${sectionNumber}`,
        start: draft.start,
        end: draft.end,
        speed: globalSpeed,
      },
      duration,
    })
  }

  useEffect(() => {
    if (state.loadedMedia && state.fileSettings) {
      saveFileSettings(window.localStorage, state.loadedMedia.file, state.fileSettings)
    }
  }, [state.fileSettings, state.loadedMedia])

  return (
    <FileSettingsContext
      value={{
        state,
        actions: {
          loadFile,
          clearFile: () => dispatchAction({ type: 'clearFile' }),
          createSection,
          addSectionAt,
          addSection: (section, duration) =>
            dispatchAction({ type: 'addSection', section, duration }),
          updateSection: (id, changes, duration) =>
            dispatchAction({ type: 'updateSection', id, changes, duration }),
          removeSection: (id) => dispatchAction({ type: 'removeSection', id }),
          selectSection: (id) => dispatchAction({ type: 'selectSection', id }),
          toggleLoop: (enabled) => dispatchAction({ type: 'toggleLoop', enabled }),
          setGlobalSpeed: (speed) => dispatchAction({ type: 'setGlobalSpeed', speed }),
          setSeekStepSeconds: (seekStepSeconds) =>
            dispatchAction({ type: 'setSeekStepSeconds', seekStepSeconds }),
        },
      }}
    >
      {children}
    </FileSettingsContext>
  )
}

/**
 * ファイル設定ストアの現在値を読む。
 * 表示コンポーネントが dispatch の詳細へ依存しないよう、読み取り専用の入口を分けている。
 */
export function useFileSettingsState() {
  return useRequiredFileSettingsContext().state
}

/**
 * ファイル設定ストアを更新する action 群を返す。
 * UI イベントから reducer action を直接組み立てずに済むよう、操作名の境界を保つ。
 */
export function useFileSettingsActions() {
  return useRequiredFileSettingsContext().actions
}
