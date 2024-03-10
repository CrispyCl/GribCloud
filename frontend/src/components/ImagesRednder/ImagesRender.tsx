import LightGallery from '@/components/LightGallery/LightGallery'
import { ImageType, VideoType } from '@/constants'
import { GroupedImages, UploadImageResponse } from '@/redux/types'
import { FunctionComponent } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface ImagesRenderProps {
  userImages?: UploadImageResponse[] | undefined
  uploadProgress?: number[] | undefined
  files?: File[] | undefined
}

const ImagesRender: FunctionComponent<ImagesRenderProps> = ({
  userImages,
  uploadProgress,
}) => {
  const groupedImages: GroupedImages[] = []

  userImages?.forEach(image => {
    const date = new Date(image.created_at).toDateString() // Преобразование даты в формат строки
    const existingGroup = groupedImages.find(group => group.date === date)

    if (existingGroup) {
      existingGroup.images.push(image)
    } else {
      groupedImages.push({ date, images: [image] })
    }
  })

  groupedImages.forEach(group => {
    group.images.sort((a, b) => b.created_at.getTime() - a.created_at.getTime()) // Сортировка по убыванию даты создания
  })

  return (
    <>
      {groupedImages
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((group, index) => (
          <div key={index} className='flex flex-col'>
            <span className='text-gray-500'>{group.date}</span>
            <LightGallery>
              {group.images?.map((image, imageIndex) => {
                console.log('image', image)
                console.log('userImages', userImages)
                console.log('uploadProgress:', uploadProgress)

                if (
                  uploadProgress &&
                  uploadProgress[imageIndex] !== undefined
                ) {
                  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa')
                  return (
                    <div key={imageIndex} className='h-64 max-w-64 rounded-lg'>
                      <CircularProgressbar
                        value={uploadProgress[imageIndex]}
                        text={`${uploadProgress[imageIndex]}%`}
                      />
                    </div>
                  )
                } else if (
                  VideoType.includes(
                    image.name.split('.').pop()?.toLowerCase() as string,
                  )
                ) {
                  return (
                    <a
                      className='group relative cursor-pointer'
                      key={imageIndex}
                      data-lg-size='1280-720'
                      data-video={`{"source": [{"src":"${image.url}", "type":"video/mp4"}], "attributes": {"preload": false, "controls": true, "playsinline": true}}`}
                      data-sub-html={`<h4>${image.name} ${image.created_at}</h4>`}
                    >
                      <img
                        className='h-full w-full scale-100 transform rounded-lg object-cover transition-transform group-hover:scale-105 sm:h-80'
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
                    <a
                      className='group relative cursor-pointer'
                      href={image.url}
                      key={imageIndex}
                      data-sub-html={`<h4>${image.name} ${image.created_at}</h4>`}
                    >
                      <div className='relative'>
                        <img
                          loading='lazy'
                          className={`h-full w-full scale-100 transform rounded-lg object-cover transition-transform group-hover:scale-105 sm:h-80`}
                          src={image.url}
                        />
                        {/* <a
                          href={image.url}
                          target='_blank'
                          className='absolute inset-0 hidden h-10 w-10 items-center justify-center rounded-full bg-gray-500 bg-opacity-50 transition-opacity group-hover:flex'
                        >
                          <DocumentArrowDownIcon className='h-5 w-5' />
                        </a> */}
                      </div>
                    </a>
                  )
                }
              })}
            </LightGallery>
          </div>
        ))}
    </>
  )
}

export default ImagesRender
