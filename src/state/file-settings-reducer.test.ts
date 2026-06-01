import { describe, expect, it } from 'vitest'

import type { FileSettings, LoadedMedia, Section } from '@/types.ts'

import {
  fileSettingsReducer,
  initialFileSettingsState,
  selectedSection,
} from './file-settings-reducer.ts'

const media = {
  file: {
    name: 'practice.mp4',
    size: 12345,
    lastModified: 67890,
  },
  kind: 'video',
  url: 'blob:practice',
} as LoadedMedia

const section: Section = {
  id: 'section-1',
  name: 'Intro',
  start: 10,
  end: 20,
  speed: 0.8,
}

const settings: FileSettings = {
  fileLabel: 'practice.mp4',
  globalSpeed: 0.9,
  sections: [section],
}

describe('fileSettingsReducer', () => {
  it('creates empty settings when loading a new file without saved settings', () => {
    const state = fileSettingsReducer(initialFileSettingsState, {
      type: 'loadFile',
      media,
      settings: null,
    })

    expect(state.fileSettings).toEqual({
      fileLabel: 'practice.mp4',
      globalSpeed: 1,
      sections: [],
    })
    expect(state.loadedMedia).toBe(media)
  })

  it('loads saved settings and resets transient selection state', () => {
    const state = fileSettingsReducer(
      {
        loadedMedia: null,
        fileSettings: null,
        selectedSectionId: 'old-section',
        isLoopEnabled: true,
      },
      {
        type: 'loadFile',
        media,
        settings,
      },
    )

    expect(state.fileSettings).toEqual(settings)
    expect(state.selectedSectionId).toBeNull()
    expect(state.isLoopEnabled).toBe(false)
  })

  it('adds a normalized section and selects it', () => {
    const loadedState = fileSettingsReducer(initialFileSettingsState, {
      type: 'loadFile',
      media,
      settings: null,
    })

    const state = fileSettingsReducer(loadedState, {
      type: 'addSection',
      section: {
        id: 'section-2',
        name: '  ',
        start: 30,
        end: 20,
        speed: 0,
      },
      duration: 60,
    })

    expect(state.fileSettings?.sections).toEqual([
      {
        id: 'section-2',
        name: 'Untitled section',
        start: 30,
        end: 38,
        speed: 1,
      },
    ])
    expect(state.selectedSectionId).toBe('section-2')
  })

  it('updates a section without replacing unrelated sections', () => {
    const state = fileSettingsReducer(
      {
        loadedMedia: media,
        fileSettings: {
          ...settings,
          sections: [
            section,
            {
              id: 'section-2',
              name: 'Solo',
              start: 40,
              end: 50,
              speed: 0.7,
            },
          ],
        },
        selectedSectionId: null,
        isLoopEnabled: false,
      },
      {
        type: 'updateSection',
        id: 'section-1',
        changes: {
          name: 'Intro slow',
          end: 16,
        },
      },
    )

    expect(state.fileSettings?.sections[0]).toEqual({
      ...section,
      name: 'Intro slow',
      end: 16,
    })
    expect(state.fileSettings?.sections[1]?.name).toBe('Solo')
  })

  it('removes a selected section and clears selection', () => {
    const state = fileSettingsReducer(
      {
        loadedMedia: media,
        fileSettings: settings,
        selectedSectionId: 'section-1',
        isLoopEnabled: true,
      },
      {
        type: 'removeSection',
        id: 'section-1',
      },
    )

    expect(state.fileSettings?.sections).toEqual([])
    expect(state.selectedSectionId).toBeNull()
    expect(state.isLoopEnabled).toBe(true)
  })

  it('selects only existing sections', () => {
    const loadedState = {
      loadedMedia: media,
      fileSettings: settings,
      selectedSectionId: null,
      isLoopEnabled: false,
    }

    expect(
      fileSettingsReducer(loadedState, {
        type: 'selectSection',
        id: 'section-1',
      }).selectedSectionId,
    ).toBe('section-1')
    expect(
      fileSettingsReducer(loadedState, {
        type: 'selectSection',
        id: 'missing',
      }).selectedSectionId,
    ).toBeNull()
  })

  it('updates loop and global speed state', () => {
    const loopState = fileSettingsReducer(
      {
        loadedMedia: media,
        fileSettings: settings,
        selectedSectionId: null,
        isLoopEnabled: false,
      },
      {
        type: 'toggleLoop',
      },
    )
    const speedState = fileSettingsReducer(loopState, {
      type: 'setGlobalSpeed',
      speed: 0.75,
    })

    expect(loopState.isLoopEnabled).toBe(true)
    expect(speedState.fileSettings?.globalSpeed).toBe(0.75)
  })
})

describe('selectedSection', () => {
  it('returns the selected section when it exists', () => {
    expect(
      selectedSection({
        loadedMedia: media,
        fileSettings: settings,
        selectedSectionId: 'section-1',
        isLoopEnabled: false,
      }),
    ).toEqual(section)
  })
})
