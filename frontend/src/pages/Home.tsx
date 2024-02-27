import { useFiles } from '@/hooks/useFiles'
import Body from '@components/Body/Body'
import { Image } from 'antd'
import { FunctionComponent } from 'react'

interface HomeProps {}
const Home: FunctionComponent<HomeProps> = () => {
  const { user, files, uploadedImages, uploadProgress, setFiles } = useFiles()
  return (
    <Body setFiles={setFiles}>
      <div className='m-5 bg-gray-300'>
        <Image.PreviewGroup>
          {uploadedImages.map((image, index) => {
            if (
              image.name.includes('.mp4') ||
              image.name.includes('.mov') ||
              image.name.includes('.webm') ||
              image.name.includes('.ogg')
            ) {
              return (
                <Image
                  width={200}
                  src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                  preview={{
                    imageRender: () => (
                      <video width='100%' controls src={image.url} />
                    ),
                    toolbarRender: () => null,
                  }}
                  key={index}
                />
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
              image.name.includes('.dng') ||
              image.name.includes('.jfif') ||
              image.name.includes('.nef')
            ) {
              return (
                <Image
                  width={200}
                  height={200}
                  className='object-cover'
                  src={image.url}
                  key={index}
                />
              )
            }
          })}
        </Image.PreviewGroup>
        {/* <div className='m-5 mx-auto w-full columns-4 gap-x-5'>
          {uploadedImages.map((image, index) => {
            if (
              image.name.includes('.mp4') ||
              image.name.includes('.mov') ||
              image.name.includes('.webm') ||
              image.name.includes('.ogg')
            ) {
              return (
                <div className='mb-2 w-full break-inside-avoid' key={index}>
                  <video src={image.url} />
                </div>
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
              image.name.includes('.dng') ||
              image.name.includes('.jfif') ||
              image.name.includes('.nef')
            ) {
              return (
                <div className='mb-2 w-full break-inside-avoid' key={index}>
                  <img
                    className='max-w-full rounded-xl'
                    src={image.url}
                    alt={image.name}
                  />
                </div>
              )
            }
          })}
        </div> */}
      </div>
    </Body>
  )
}

export default Home

/* {uploadProgress[index] && (
                    <p>Upload Progress: {uploadProgress[index]}%</p>
                  )} */
