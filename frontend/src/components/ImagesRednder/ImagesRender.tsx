import LightGallery from '@/components/LightGallery/LightGallery'
import { ImageType, VideoType } from '@/constants'
import { UploadImage } from '@/hooks/useFiles'
import { FunctionComponent } from 'react'

interface ImagesRenderProps {
  userImages?: UploadImage[] | undefined
}

const ImagesRender: FunctionComponent<ImagesRenderProps> = ({ userImages }) => {
  return (
    <LightGallery>
      {userImages?.map((image, index) => {
        if (
          VideoType.includes(
            image.name.split('.').pop()?.toLowerCase() as string,
          )
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
          ImageType.includes(
            image.name.split('.').pop()?.toLowerCase() as string,
          )
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
  )
}

export default ImagesRender
