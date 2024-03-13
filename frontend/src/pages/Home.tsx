import ImagesRender from '@/components/ImagesRednder/ImagesRender'
import ModalImageEdit from '@/components/ModalImageEdit/ModalImageEdit'
import { useFiles } from '@/hooks/useFiles'
import Body from '@components/Body/Body'
import { useDisclosure } from '@mantine/hooks'
import { FunctionComponent, useState } from 'react'

interface HomeProps {}
const Home: FunctionComponent<HomeProps> = () => {
  const { uploadedImages, uploadProgress, setFiles } = useFiles()
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [name, setName] = useState<string | undefined>(undefined)
  const [opened, { open, close }] = useDisclosure(false)
  const [key, setKey] = useState(0)

  console.log('reload')
  return (
    <Body key={key} setFiles={setFiles}>
      <div className='m-5'>
        <ImagesRender
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

export default Home
