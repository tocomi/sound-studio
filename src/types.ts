export type MediaKind = 'audio' | 'video'

export type LoadedMedia = {
  file: File
  kind: MediaKind
  url: string
}
