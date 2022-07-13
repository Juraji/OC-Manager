export interface OcImage {
  id: string
  sourceName: string
  sourceFileSize: number
  uploadedOn: number
}

export interface OcImageGalleryView extends OcImage {
  parentNodeId: string
  parentNodeLabels: string[]
}
