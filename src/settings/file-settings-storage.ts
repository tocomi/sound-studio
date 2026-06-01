import { fileKey } from '@/lib/file-key.ts'
import type { FileSettings, Section } from '@/types.ts'

import { DEFAULT_SEEK_STEP_SECONDS } from './file-settings-defaults.ts'

type FileSettingsStorage = Pick<Storage, 'getItem' | 'setItem'>
type FileSettingsSource = Parameters<typeof fileKey>[0]

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isSection(value: unknown): value is Section {
  if (!value || typeof value !== 'object') {
    return false
  }

  const section = value as Record<string, unknown>

  return (
    typeof section.id === 'string' &&
    typeof section.name === 'string' &&
    isFiniteNumber(section.start) &&
    isFiniteNumber(section.end) &&
    isFiniteNumber(section.speed)
  )
}

function isFileSettings(value: unknown): value is FileSettings {
  if (!value || typeof value !== 'object') {
    return false
  }

  const settings = value as Record<string, unknown>

  return (
    typeof settings.fileLabel === 'string' &&
    isFiniteNumber(settings.globalSpeed) &&
    (settings.seekStepSeconds === undefined || isFiniteNumber(settings.seekStepSeconds)) &&
    Array.isArray(settings.sections) &&
    settings.sections.every(isSection)
  )
}

function normalizeStoredFileSettings(settings: FileSettings): FileSettings {
  return {
    ...settings,
    seekStepSeconds: settings.seekStepSeconds ?? DEFAULT_SEEK_STEP_SECONDS,
  }
}

/**
 * localStorage からファイル単位の練習設定を復元する。
 * 保存データはユーザー環境で壊れうるため、読めない値は新規ファイル扱いにして UI を落とさない。
 */
export function loadFileSettings(storage: FileSettingsStorage, file: FileSettingsSource) {
  const savedValue = storage.getItem(fileKey(file))

  if (!savedValue) {
    return null
  }

  try {
    const parsedValue: unknown = JSON.parse(savedValue)
    return isFileSettings(parsedValue) ? normalizeStoredFileSettings(parsedValue) : null
  } catch {
    return null
  }
}

/**
 * ファイル単位の練習設定を localStorage に保存する。
 * ファイル本体は保存せず、fileKey で作った同定キーに設定値だけをぶら下げる。
 */
export function saveFileSettings(
  storage: FileSettingsStorage,
  file: FileSettingsSource,
  settings: FileSettings,
) {
  storage.setItem(fileKey(file), JSON.stringify(settings))
}
