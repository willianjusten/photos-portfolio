export interface ImageProps {
  id: number
  height?: string
  width?: string
  aspect_ratio?: string
  public_id: string
  format?: string
  folder?: string
  blurDataUrl?: string
}

export interface SharedModalProps {
  index: number
  images?: ImageProps[]
  currentPhoto?: ImageProps
  changePhotoId: (newVal: number) => void
  closeModal: () => void
  navigation: boolean
  direction?: number
}
