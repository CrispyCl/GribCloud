import Fancybox from '@/components/LightGallery/Fancybox'
import { VideoType } from '@/constants'
import { RootState } from '@/redux/store'
import { GroupedImages, UploadImageResponse } from '@/redux/types'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { LoadingOverlay } from '@mantine/core'
import React, { FunctionComponent } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useSelector } from 'react-redux'

interface ImagesRenderProps {
  userImages?: UploadImageResponse[] | undefined
  uploadProgress?: number[] | undefined
  loading: boolean
  setUrl: React.Dispatch<React.SetStateAction<string | undefined>>
  setName: React.Dispatch<React.SetStateAction<string | undefined>>
  open: () => void
}

const ImagesRender: FunctionComponent<ImagesRenderProps> = ({
  loading,
  userImages,
  uploadProgress,
  setUrl,
  setName,
  open,
}) => {
  const groupedImages: GroupedImages[] = []
  const currentUser = useSelector((state: RootState) => state.auth.account)

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

  const deleteImage = async (name: string) => {
    // await deleteObject(ref(imgStorage, `images/${user?.id}/${name}/`))
  }

  return (
    <Fancybox setUrl={setUrl} setName={setName} open={open}>
      {loading && (
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      )}
      {!userImages ||
        (!userImages.length && (
          <>
            {!currentUser ? (
              <div className='flex h-full flex-col items-center justify-center'>
                <EllipsisHorizontalIcon className='h-16 w-16 text-gray-400' />
                <span className='text-gray-500'>
                  Войдите или зарегистрируйтесь
                </span>
              </div>
            ) : (
              <div className='flex h-full flex-col items-center justify-center'>
                <EllipsisHorizontalIcon className='h-16 w-16 text-gray-400' />
                <span className='text-gray-500'>
                  Нет загруженных изображений
                </span>
              </div>
            )}
          </>
        ))}
      {groupedImages
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((group, index) => (
          <div key={index} className='flex flex-col'>
            <span className='text-gray-500'>{group.date}</span>
            <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {group.images?.map((image, imageIndex) => {
                if (
                  uploadProgress &&
                  uploadProgress[imageIndex] !== undefined
                ) {
                  return (
                    <div key={imageIndex} className='h-64 max-w-64 rounded-lg'>
                      <CircularProgressbar
                        value={uploadProgress[imageIndex]}
                        text={`${uploadProgress[imageIndex]}%`}
                      />
                    </div>
                  )
                } else {
                  return (
                    <div key={imageIndex} className='group relative'>
                      <a
                        className='cursor-pointer'
                        data-fancybox='gallery'
                        id={image.name}
                        href={image.url}
                      >
                        {VideoType.includes(
                          image.name.split('.').pop() as string,
                        ) ? (
                          <img
                            loading='lazy'
                            id={image.name}
                            className='h-full w-full scale-105 transform rounded-lg object-cover transition-transform group-hover:scale-100 sm:h-80'
                            src={image.preview}
                          />
                        ) : (
                          <img
                            loading='lazy'
                            id={image.name}
                            className='h-full w-full scale-105 transform rounded-lg object-cover transition-transform group-hover:scale-100 sm:h-80'
                            src={image.url}
                          />
                        )}
                      </a>
                      <button
                        onClick={() => {
                          deleteImage(image.name)
                        }}
                        className='absolute right-1 top-1 hidden h-10 w-10 items-center justify-center rounded-full bg-gray-50 bg-opacity-100 transition-opacity group-hover:flex'
                      >
                        <EllipsisHorizontalIcon className='h-5 w-5' />
                      </button>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        ))}
    </Fancybox>
  )
}

export default ImagesRender
