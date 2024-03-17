import ContextMenu from '@/components/ContextMenu/ContextMenu'
import Fancybox from '@/components/LightGallery/Fancybox'
import { VideoType } from '@/constants'
import { RootState } from '@/redux/store'
import { GroupedImages, UploadImageResponse } from '@/redux/types'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { LoadingOverlay } from '@mantine/core'
import React, { FunctionComponent, useState } from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { useSelector } from 'react-redux'

interface ImagesRenderProps {
  loading: boolean
  open: () => void
  userImages?: UploadImageResponse[] | undefined
  uploadProgress?: { id: number; progress: number } | undefined
  setUrl?: React.Dispatch<React.SetStateAction<string | undefined>>
  setName?: React.Dispatch<React.SetStateAction<string | undefined>>
}

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
  image: undefined as UploadImageResponse | undefined,
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
  const [contextMenu, setContextMenu] = useState(initialContextMenu)
  const currentUser = useSelector((state: RootState) => state.auth.account)
  userImages?.forEach(image => {
    const date = new Date(image.created_at).toLocaleDateString()
    const group = groupedImages.find(group => group.date === date)
    if (group) {
      group.images.push(image)
    } else {
      groupedImages.push({ date, images: [image] })
    }
  })

  // custom right click on image menu
  const handleContextMenu = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    image: UploadImageResponse,
  ) => {
    if (currentUser && !window.location.href.split('/').includes('all')) {
      e.preventDefault()
      const { clientX, clientY } = e
      setContextMenu({ show: true, x: clientX, y: clientY, image })
    }
  }

  // close context menu
  const closeContextMenu = () => {
    setContextMenu(initialContextMenu)
  }
  return (
    <Fancybox setUrl={setUrl} setName={setName} open={open}>
      {contextMenu.show &&
        currentUser &&
        !window.location.href.split('/').includes('all') && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            image={contextMenu.image}
            closeContextMenu={closeContextMenu}
          />
        )}
      {loading && (
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      )}
      {(!userImages || !userImages.length) && (
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
              <span className='text-gray-500'>Нет загруженных изображений</span>
            </div>
          )}
        </>
      )}
      {groupedImages
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((group, index) => (
          <div key={index} className='flex flex-col'>
            <span className='text-gray-500'>{group.date}</span>
            <div className='grid grid-cols-1 gap-14 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {group.images.map((image, imageIndex) => {
                if (uploadProgress) {
                  console.log(12312312, uploadProgress)
                  return (
                    <LoadingOverlay
                      key={imageIndex}
                      visible={uploadProgress.progress !== 100}
                      zIndex={1000}
                      overlayProps={{ radius: 'sm', blur: 2 }}
                    />
                  )
                }
                return (
                  <div key={imageIndex} className='group relative'>
                    <a
                      className='cursor-pointer'
                      data-fancybox='gallery'
                      id={image.name}
                      href={image.url}
                      onContextMenu={e => handleContextMenu(e, image)}
                    >
                      {image.name &&
                      VideoType.includes(
                        ('video/' + image.name.split('.').pop()) as string,
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
                  </div>
                )
              })}
            </div>
          </div>
        ))}
    </Fancybox>
  )
}

export default ImagesRender
