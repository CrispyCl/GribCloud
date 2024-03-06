import LightGallery from '@/components/LightGallery/LightGallery'
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
        <LightGallery>
          {uploadedImages.map((image, index) => {
            if (
              image.name.includes('.mp4') ||
              image.name.includes('.mov') ||
              image.name.includes('.webm') ||
              image.name.includes('.ogg')
            ) {
              return (
                <a
                  key={index}
                  data-lg-size='1280-720'
                  data-video={`{"source": [{"src":"${image.url}", "type":"video/mp4"}], "attributes": {"preload": false, "controls": true, "playsinline": true}}`}
                  data-poster='https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg'
                  data-sub-html="<h4>'Peck Pocketed' by Kevin Herron | Disney Favorite</h4>"
                >
                  <img
                    width='300'
                    height='100'
                    src='https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg'
                  />
                </a>
              )
            } else if (
              image.name.includes('.png') ||
              image.name.includes('.jpg') ||
              image.name.includes('.jpeg') ||
              image.name.includes('.raw') ||
              image.name.includes('.bmp') ||
              image.name.includes('.gif') ||
              image.name.includes('.webp') ||
              image.name.includes('.svg') ||
              image.name.includes('.heif') ||
              image.name.includes('.heic') ||
              image.name.includes('.tiff') ||
              image.name.includes('.tif') ||
              image.name.includes('.ico') ||
              image.name.includes('.jfif') ||
              image.name.includes('.nef')
            ) {
              return (
                <a href={image.url} key={index}>
                  <img
                    width={200}
                    height={200}
                    className='object-cover'
                    src={image.url}
                  />
                </a>
              )
            }
          })}
        </LightGallery>
      </div>
    </Body>
  )
}

export default Home

/* {uploadProgress[index] && (
                    <p>Upload Progress: {uploadProgress[index]}%</p>
                  )} */
