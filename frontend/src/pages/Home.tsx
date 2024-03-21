import ImagesRender from '@/components/ImagesRednder/ImagesRender'
import ModalAddTag from '@/components/Modal/ModalAddTag'
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
  const { loading, uploadedImages, uploadProgress, setFiles, removeFile } =
    useFiles(PATH)
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [name, setName] = useState<string | undefined>(undefined)
  const [opened, { open, close }] = useDisclosure(false)
  const [openedMap, { open: openMap, close: closeMap }] = useDisclosure(false)
  const [addTagOpened, { open: addTagOpen, close: addTagClose }] =
    useDisclosure(false)
  const [addTagId, setAddTagId] = useState<number | undefined>()
  const [latitude, setLatitude] = useState<number | undefined>(undefined)
  const [longitude, setLongitude] = useState<number | undefined>(undefined)
  const [key, setKey] = useState(0)
  const [imageKey, setImageKey] = useState(0)
  const [userImages, setUserImages] = useState<UploadImageResponse[]>([])
  const handleRemoveImage = async (image: number, path: string) => {
    await removeFile(image, path)
    setUserImages(prevImages => prevImages.filter(img => img.id !== image))
  }
  useEffect(() => {
    if (uploadedImages) {
      setUserImages(uploadedImages)
    }
  }, [uploadedImages])
  return (
    <Body loading={loading} key={key}>
      <ImagesRender
        key={imageKey}
        handleRemoveImage={handleRemoveImage}
        openMap={openMap}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        open={open}
        addTagOpen={addTagOpen}
        setAddTagId={setAddTagId}
        setName={setName}
        setUrl={setUrl}
        setFiles={setFiles}
        userImages={userImages}
        uploadProgress={uploadProgress}
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
      {addTagId && (
        <ModalAddTag
          setImageKey={setImageKey}
          addTagClose={addTagClose}
          addTagOpened={addTagOpened}
          id={addTagId}
          userImages={userImages}
          setUserImages={setUserImages}
        />
      )}
    </Body>
  )
}

export default Home
