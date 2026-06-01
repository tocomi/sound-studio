import { describe, expect, it } from 'vitest'

import { fileKey } from './file-key.ts'

describe('fileKey', () => {
  it('uses file size and lastModified for the storage key', () => {
    expect(fileKey({ size: 12345, lastModified: 67890 })).toBe('ss:file:12345:67890')
  })

  it('does not depend on the file name', () => {
    const firstFile = { name: 'before.mp4', size: 12345, lastModified: 67890 }
    const renamedFile = { name: 'after.mp4', size: 12345, lastModified: 67890 }

    expect(fileKey(firstFile)).toBe(fileKey(renamedFile))
  })
})
