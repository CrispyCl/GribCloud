import Body from '@/components/Body/Body'
import ImagesRender from '@/components/ImagesRednder/ImagesRender'
import ModalImageEdit from '@/components/Modal/ModalImageEdit'
import useAlbums from '@/hooks/useAlbums'
import { useFiles } from '@/hooks/useFiles'
import { AlbumResponse, UploadImageResponse } from '@/redux/types'
import { useDisclosure } from '@mantine/hooks'
import { FunctionComponent, useEffect, useState } from 'react'

interface AlbumProps {
  currentAlbum: AlbumResponse
}

const Album: FunctionComponent<AlbumProps> = ({ currentAlbum }) => {
  const { loading, uploadProgress, uploadedImages, setFiles } = useFiles(
    window.location.href.split('/'),
    currentAlbum.title,
  )
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [name, setName] = useState<string | undefined>(undefined)
  const [opened, { open, close }] = useDisclosure(false)
  const [key, setKey] = useState(0)
  const { removeImageFromAlbum } = useAlbums()
  const [userImages, setUserImages] = useState<UploadImageResponse[]>([])
  const handleRemoveImageFromAlbum = async (
    album: AlbumResponse,
    image: number,
  ) => {
    await removeImageFromAlbum(album, image)
    setUserImages(prevImages => prevImages.filter(img => img.id !== image))
  }
  useEffect(() => {
    if (uploadedImages) {
      setUserImages(uploadedImages)
    }
  }, [uploadedImages])
  return (
    <Body key={key} setFiles={setFiles} album={currentAlbum} loading={loading}>
      <div className='m-5'>
        <ImagesRender
          handleRemoveImageFromAlbum={handleRemoveImageFromAlbum}
          album={currentAlbum}
          open={open}
          setName={setName}
          setUrl={setUrl}
          userImages={userImages}
          uploadProgress={uploadProgress}
        />
      </div>
      {url && name && (
        <ModalImageEdit
          setKey={setKey}
          opened={opened}
          close={close}
          url={url}
          name={name}
        />
      )}
    </Body>
  )
}

export default Album
