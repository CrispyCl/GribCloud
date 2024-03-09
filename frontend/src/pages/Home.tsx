import ImagesRender from '@/components/ImagesRednder/ImagesRender'
import { useFiles } from '@/hooks/useFiles'
import Body from '@components/Body/Body'
import { FunctionComponent } from 'react'

interface HomeProps {}
const Home: FunctionComponent<HomeProps> = () => {
  const { files, uploadedImages, uploadProgress, setFiles } = useFiles()
  return (
    <Body setFiles={setFiles}>
      <div className='m-5'>
        <ImagesRender
          files={files}
          userImages={uploadedImages}
          uploadProgress={uploadProgress}
        />
      </div>
    </Body>
  )
}

export default Home
