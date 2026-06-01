import { beforeEach, describe, expect, it } from 'vitest'

import { fileKey } from '@/lib/file-key.ts'
import type { FileSettings } from '@/types.ts'

import { loadFileSettings, saveFileSettings } from './file-settings-storage.ts'

function createStorage(): Storage {
  let values = new Map<string, string>()

  return {
    get length() {
      return values.size
    },
    clear() {
      values = new Map()
    },
    getItem(key: string) {
      return values.get(key) ?? null
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null
    },
    removeItem(key: string) {
      values.delete(key)
    },
    setItem(key: string, value: string) {
      values.set(key, value)
    },
  }
}

const file = { name: 'practice.mp4', size: 12345, lastModified: 67890 }

const settings: FileSettings = {
  fileLabel: 'practice.mp4',
  globalSpeed: 0.8,
  loopEnabled: false,
  seekStepSeconds: 10,
  sections: [
    {
      id: 'section-1',
      name: 'Intro',
      start: 12.5,
      end: 28,
      speed: 0.7,
    },
  ],
}

describe('file settings storage', () => {
  let storage: Storage

  beforeEach(() => {
    storage = createStorage()
  })

  it('saves and loads settings by file key', () => {
    saveFileSettings(storage, file, settings)

    expect(loadFileSettings(storage, file)).toEqual(settings)
  })

  it('returns null when settings are missing', () => {
    expect(loadFileSettings(storage, file)).toBeNull()
  })

  it('returns null for broken JSON', () => {
    storage.setItem(fileKey(file), '{broken')

    expect(loadFileSettings(storage, file)).toBeNull()
  })

  it('loads legacy settings without seek step seconds', () => {
    storage.setItem(
      fileKey(file),
      JSON.stringify({
        fileLabel: 'practice.mp4',
        globalSpeed: 0.8,
        sections: [],
      }),
    )

    expect(loadFileSettings(storage, file)).toEqual({
      fileLabel: 'practice.mp4',
      globalSpeed: 0.8,
      loopEnabled: true,
      seekStepSeconds: 2,
      sections: [],
    })
  })

  it('returns null when the saved shape is invalid', () => {
    storage.setItem(
      fileKey(file),
      JSON.stringify({
        fileLabel: 'practice.mp4',
        globalSpeed: 0.8,
        sections: 'not sections',
      }),
    )

    expect(loadFileSettings(storage, file)).toBeNull()
  })
})
