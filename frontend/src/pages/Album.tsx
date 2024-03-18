import Body from '@/components/Body/Body'
import ImagesRender from '@/components/ImagesRednder/ImagesRender'
import ModalImageEdit from '@/components/Modal/ModalImageEdit'
import { useFiles } from '@/hooks/useFiles'
import { AlbumResponse } from '@/redux/types'
import { useDisclosure } from '@mantine/hooks'
import { FunctionComponent, useState } from 'react'

interface AlbumProps {
  currentAlbum: AlbumResponse
}

const Album: FunctionComponent<AlbumProps> = ({ currentAlbum }) => {
  const { loading, uploadedImages, uploadProgress, setFiles } = useFiles(
    window.location.href.split('/'),
    currentAlbum.title,
  )
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [name, setName] = useState<string | undefined>(undefined)
  const [opened, { open, close }] = useDisclosure(false)
  const [key, setKey] = useState(0)
  return (
    <Body key={key} setFiles={setFiles} album={currentAlbum} loading={loading}>
      <div className='m-5'>
        <ImagesRender
          album={currentAlbum}
          open={open}
          setName={setName}
          setUrl={setUrl}
          userImages={uploadedImages}
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
