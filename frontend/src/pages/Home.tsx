import ImagesRender from '@/components/ImagesRednder/ImagesRender'
import UserFolders from '@/components/LightGallery/UserFolders'
import { useFiles } from '@/hooks/useFiles'
import Body from '@components/Body/Body'
import { FunctionComponent } from 'react'

interface HomeProps {}
const Home: FunctionComponent<HomeProps> = () => {
  const { uploadedImages, uploadProgress, setFiles } = useFiles()
  return (
    <Body setFiles={setFiles}>
      <div className='m-5 bg-gray-300'>
        <UserFolders />
        <ImagesRender userImages={uploadedImages} />
      </div>
    </Body>
  )
}

export default Home

/* {uploadProgress[index] && (
                    <p>Upload Progress: {uploadProgress[index]}%</p>
                  )} */
