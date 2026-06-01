import type { FileSettings, LoadedMedia, Section } from '@/types.ts'

const DEFAULT_GLOBAL_SPEED = 1
const DEFAULT_SECTION_LENGTH = 8

export type FileSettingsState = {
  loadedMedia: LoadedMedia | null
  fileSettings: FileSettings | null
  selectedSectionId: string | null
  isLoopEnabled: boolean
}

export type FileSettingsAction =
  | {
      type: 'loadFile'
      media: LoadedMedia
      settings: FileSettings | null
    }
  | {
      type: 'clearFile'
    }
  | {
      type: 'addSection'
      section: Section
      duration?: number
    }
  | {
      type: 'updateSection'
      id: string
      changes: Partial<Omit<Section, 'id'>>
      duration?: number
    }
  | {
      type: 'removeSection'
      id: string
    }
  | {
      type: 'selectSection'
      id: string | null
    }
  | {
      type: 'toggleLoop'
      enabled?: boolean
    }
  | {
      type: 'setGlobalSpeed'
      speed: number
    }

export const initialFileSettingsState: FileSettingsState = {
  loadedMedia: null,
  fileSettings: null,
  selectedSectionId: null,
  isLoopEnabled: false,
}

function isFinitePositive(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function normalizeSpeed(speed: number) {
  return Number.isFinite(speed) && speed > 0 ? speed : DEFAULT_GLOBAL_SPEED
}

function normalizeSection(section: Section, duration?: number): Section {
  const limit = isFinitePositive(duration) ? duration : Number.POSITIVE_INFINITY
  const fallbackEnd = Number.isFinite(section.start)
    ? section.start + DEFAULT_SECTION_LENGTH
    : DEFAULT_SECTION_LENGTH
  const rawStart = Number.isFinite(section.start) ? section.start : 0
  const rawEnd = Number.isFinite(section.end) ? section.end : fallbackEnd
  let start = clamp(rawStart, 0, limit)
  let end = clamp(rawEnd, 0, limit)

  if (start >= end) {
    if (Number.isFinite(limit)) {
      end = clamp(start + DEFAULT_SECTION_LENGTH, 0, limit)
      start = end > 0 ? Math.min(start, end - Math.min(DEFAULT_SECTION_LENGTH, end)) : 0
    } else {
      end = start + DEFAULT_SECTION_LENGTH
    }
  }

  return {
    ...section,
    name: section.name.trim() || 'Untitled section',
    start,
    end,
    speed: normalizeSpeed(section.speed),
  }
}

function createInitialSettings(media: LoadedMedia): FileSettings {
  return {
    fileLabel: media.file.name,
    globalSpeed: DEFAULT_GLOBAL_SPEED,
    sections: [],
  }
}

function normalizeSettings(settings: FileSettings, duration?: number): FileSettings {
  return {
    fileLabel: settings.fileLabel,
    globalSpeed: normalizeSpeed(settings.globalSpeed),
    sections: settings.sections.map((section) => normalizeSection(section, duration)),
  }
}

/**
 * ファイルごとに保存される練習設定と、その選択状態を更新する reducer。
 * 再生の現在時刻は持たず、localStorage に保存できる編集状態の真実だけを扱う。
 */
export function fileSettingsReducer(
  state: FileSettingsState,
  action: FileSettingsAction,
): FileSettingsState {
  switch (action.type) {
    case 'loadFile': {
      return {
        loadedMedia: action.media,
        fileSettings: action.settings
          ? normalizeSettings(action.settings)
          : createInitialSettings(action.media),
        selectedSectionId: null,
        isLoopEnabled: false,
      }
    }

    case 'clearFile': {
      return initialFileSettingsState
    }

    case 'addSection': {
      if (!state.fileSettings) {
        return state
      }

      const section = normalizeSection(action.section, action.duration)

      return {
        ...state,
        fileSettings: {
          ...state.fileSettings,
          sections: [...state.fileSettings.sections, section],
        },
        selectedSectionId: section.id,
      }
    }

    case 'updateSection': {
      if (!state.fileSettings) {
        return state
      }

      const nextSections = state.fileSettings.sections.map((section) => {
        if (section.id !== action.id) {
          return section
        }

        return normalizeSection({ ...section, ...action.changes }, action.duration)
      })

      return {
        ...state,
        fileSettings: {
          ...state.fileSettings,
          sections: nextSections,
        },
      }
    }

    case 'removeSection': {
      if (!state.fileSettings) {
        return state
      }

      return {
        ...state,
        fileSettings: {
          ...state.fileSettings,
          sections: state.fileSettings.sections.filter((section) => section.id !== action.id),
        },
        selectedSectionId: state.selectedSectionId === action.id ? null : state.selectedSectionId,
      }
    }

    case 'selectSection': {
      const sectionExists = state.fileSettings?.sections.some((section) => section.id === action.id)

      return {
        ...state,
        selectedSectionId: action.id && sectionExists ? action.id : null,
      }
    }

    case 'toggleLoop': {
      return {
        ...state,
        isLoopEnabled: action.enabled ?? !state.isLoopEnabled,
      }
    }

    case 'setGlobalSpeed': {
      if (!state.fileSettings) {
        return state
      }

      return {
        ...state,
        fileSettings: {
          ...state.fileSettings,
          globalSpeed: normalizeSpeed(action.speed),
        },
      }
    }
  }
}

/**
 * 選択中セクションの実体を返す。
 * UI や再生エンジンへ渡すときに、ID と配列探索の重複を各所へ散らさないための小さな境界。
 */
export function selectedSection(state: FileSettingsState) {
  return (
    state.fileSettings?.sections.find((section) => section.id === state.selectedSectionId) ?? null
  )
}
