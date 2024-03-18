import Body from '@/components/Body/Body'
import ImagesRender from '@/components/ImagesRednder/ImagesRender'
import ModalImageEdit from '@/components/Modal/ModalImageEdit'
import { useFiles } from '@/hooks/useFiles'
import { AlbumResponse } from '@/redux/types'
import { useDisclosure } from '@mantine/hooks'
import { FunctionComponent, useState } from 'react'

interface GroupAlbumProps {
  currentPublicAlbum: AlbumResponse
}

const GroupAlbum: FunctionComponent<GroupAlbumProps> = ({
  currentPublicAlbum,
}) => {
  const { loading, uploadedImages, uploadProgress, setFiles } = useFiles(
    window.location.href.split('/'),
    currentPublicAlbum.title,
  )
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [name, setName] = useState<string | undefined>(undefined)
  const [opened, { open, close }] = useDisclosure(false)
  const [key, setKey] = useState(0)
  return (
    <Body
      key={key}
      setFiles={setFiles}
      album={currentPublicAlbum}
      loading={loading}
    >
      <div className='m-5'>
        <ImagesRender
          album={currentPublicAlbum}
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

export default GroupAlbum
