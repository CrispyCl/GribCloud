import ImagesRender from '@/components/ImagesRednder/ImagesRender'
import ModalImageEdit from '@/components/Modal/ModalImageEdit'
import { useFiles } from '@/hooks/useFiles'
import { UploadImageResponse } from '@/redux/types'
import Body from '@components/Body/Body'
import { useDisclosure } from '@mantine/hooks'
import { FunctionComponent, useEffect, useState } from 'react'

interface HomeProps {}
const PATH = window.location.href.split('/')
const Home: FunctionComponent<HomeProps> = () => {
  const { loading, uploadedImages, uploadProgress } = useFiles(
    window.location.href.split('/'),
  )
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [name, setName] = useState<string | undefined>(undefined)
  const [opened, { open, close }] = useDisclosure(false)
  const [key, setKey] = useState(0)
  const { removeFile } = useFiles(PATH)
  const [userImages, setUserImages] = useState<UploadImageResponse[]>([])
  const handleRemoveImage = async (image: number) => {
    await removeFile(image)
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
        handleRemoveImage={handleRemoveImage}
        open={open}
        setName={setName}
        setUrl={setUrl}
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
    </Body>
  )
}

export default Home
