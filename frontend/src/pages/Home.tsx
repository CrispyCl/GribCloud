import ImagesRender from '@/components/ImagesRednder/ImagesRender'
import ModalImageEdit from '@/components/Modal/ModalImageEdit'
import ModalMap from '@/components/Modal/ModalMap'
import { useFiles } from '@/hooks/useFiles'
import { UploadImageResponse } from '@/redux/types'
import Body from '@components/Body/Body'
import { useDisclosure } from '@mantine/hooks'
import { FunctionComponent, useEffect, useState } from 'react'

interface HomeProps {}
const PATH = window.location.href.split('/')
const Home: FunctionComponent<HomeProps> = () => {
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [name, setName] = useState<string | undefined>(undefined)
  const [opened, { open, close }] = useDisclosure(false)
  const [openedMap, { open: openMap, close: closeMap }] = useDisclosure(false)
  const [latitude, setLatitude] = useState<number | undefined>(undefined)
  const [longitude, setLongitude] = useState<number | undefined>(undefined)
  const [key, setKey] = useState(0)
  const [tagKey, setTagKey] = useState(0)
  const { loading, uploadedImages, setFiles, removeFile } = useFiles(
    PATH,
    '',
    tagKey,
  )
  const [userImages, setUserImages] = useState<UploadImageResponse[]>([])
  const handleRemoveImage = async (image: number, path: string) => {
    await removeFile(image, path)
    setUserImages(prevImages => prevImages.filter(img => img.id !== image))
  }
  useEffect(() => {
    if (uploadedImages) {
      setUserImages(uploadedImages)
    }
  }, [uploadedImages, tagKey])
  return (
    <Body loading={loading} key={key}>
      <ImagesRender
        tagKey={tagKey}
        setTagKey={setTagKey}
        handleRemoveImage={handleRemoveImage}
        openMap={openMap}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        open={open}
        setName={setName}
        setUrl={setUrl}
        setFiles={setFiles}
        userImages={userImages}
      />
      {url && name && (
        <ModalImageEdit
          setKey={setKey}
          opened={opened}
          close={close}
          url={url}
          name={name}
        />
      )}
      {latitude && longitude && (
        <ModalMap
          openedMap={openedMap}
          closeMap={closeMap}
          latitude={latitude}
          longitude={longitude}
        />
      )}
    </Body>
  )
}

export default Home
