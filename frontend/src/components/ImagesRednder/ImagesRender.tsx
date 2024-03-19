import ContextMenu from '@/components/ContextMenu/ContextMenu'
import Fancybox from '@/components/LightGallery/Fancybox'
import { useFiles } from '@/hooks/useFiles'
import { RootState } from '@/redux/store'
import {
  AlbumResponse,
  GroupedImages,
  UploadImageResponse,
} from '@/redux/types'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { Button, Checkbox, Group, LoadingOverlay } from '@mantine/core'
import JSZip from 'jszip'
import React, { FunctionComponent, useEffect, useState } from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { useSelector } from 'react-redux'
import BodyHeader from '../Header/BodyHeader'

interface ImagesRenderProps {
  userImages: UploadImageResponse[]
  open: () => void
  openMap: () => void
  uploadProgress?: { id: number; progress: number } | undefined
  album?: AlbumResponse
  setFiles?: React.Dispatch<React.SetStateAction<File[]>>
  setUrl?: React.Dispatch<React.SetStateAction<string | undefined>>
  setName?: React.Dispatch<React.SetStateAction<string | undefined>>
  setLatitude?: React.Dispatch<React.SetStateAction<number | undefined>>
  setLongitude?: React.Dispatch<React.SetStateAction<number | undefined>>
  handleRemoveImageFromAlbum?: (
    album: AlbumResponse,
    image: number,
    path: string,
  ) => void
  handleRemoveImage?: (image: number, path: string) => void
}

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
  image: undefined as UploadImageResponse | undefined,
}

const ImagesRender: FunctionComponent<ImagesRenderProps> = ({
  album,
  userImages,
  uploadProgress,
  handleRemoveImageFromAlbum,
  handleRemoveImage,
  setUrl,
  setFiles,
  setName,
  setLatitude,
  setLongitude,
  open,
  openMap,
}) => {
  const groupedImages: GroupedImages[] = []
  const [contextMenu, setContextMenu] = useState(initialContextMenu)
  const [check, setCheck] = useState<{ id: number; checked: boolean }[]>([])
  const [loading, setLoading] = useState(false)
  const [checkedUrls, setCheckedUrls] = useState<string[]>([])
  const { files } = useFiles(window.location.href.split('/'))
  const currentUser = useSelector((state: RootState) => state.auth.account)

  userImages.forEach(image => {
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
    if (currentUser) {
      e.preventDefault()
      const { clientX, clientY } = e
      setContextMenu({ show: true, x: clientX, y: clientY, image })
    }
  }

  // close context menu
  const closeContextMenu = () => {
    setContextMenu(initialContextMenu)
  }

  // download checked images in zip
  const downloadImages = async () => {
    setLoading(true)
    const checkedImages = userImages.filter(image =>
      check.find(item => item.id === image.id && item.checked === true),
    )
    const newCheckedUrls = [...checkedUrls]
    checkedImages.forEach(image => {
      newCheckedUrls.push(image.url)
    })
    setCheckedUrls(newCheckedUrls)

    if (checkedImages.length === 1) {
      const current = checkedImages[0]
      const link = document.createElement('a')
      const res = await fetch(current.url)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      link.href = url
      link.download = current.name
      link.click()
      setLoading(false)
    } else {
      const zip = new JSZip()
      const folder = zip.folder('images')

      await Promise.all(
        checkedImages.map(async image => {
          const response = await fetch(image.url)
          const blob = await response.blob()
          folder?.file(image.name, blob)
        }),
      )

      const blob = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'images.zip'
      link.click()
      setLoading(false)
    }
  }

  const selectAll = () => {
    setCheck(prev =>
      prev.map(item => {
        return { ...item, checked: true }
      }),
    )
    if (
      userImages.length === check.length &&
      check.every(item => item.checked === true)
    ) {
      setCheck(prev =>
        prev.map(item => {
          return { ...item, checked: false }
        }),
      )
    }
  }

  useEffect(() => {
    if (userImages.length > 0) {
      setCheck(userImages.map(image => ({ id: image.id, checked: false })))
    }
  }, [userImages, files])
  return (
    <>
      <BodyHeader
        setFiles={setFiles}
        album={album}
        selectAll={selectAll}
        check={check}
      />
      <Fancybox
        setUrl={setUrl}
        setName={setName}
        open={open}
        openMap={openMap}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
      >
        {contextMenu.show && currentUser && (
          <ContextMenu
            handleRemoveImage={handleRemoveImage as (image: number) => void}
            handleRemoveImageFromAlbum={
              handleRemoveImageFromAlbum as (
                album: AlbumResponse,
                image: number,
              ) => void
            }
            album={album as AlbumResponse}
            x={contextMenu.x}
            y={contextMenu.y}
            image={contextMenu.image}
            closeContextMenu={closeContextMenu}
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
                <span className='text-gray-500'>
                  Нет загруженных изображений
                </span>
              </div>
            )}
          </>
        )}
        {groupedImages
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map((group, index) => (
            <div key={index} className='flex flex-col'>
              <span className='text-gray-500'>{group.date}</span>
              <div className='grid grid-cols-1 gap-5 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                {group.images.map((image, imageIndex) => {
                  if (uploadProgress) {
                    return (
                      <LoadingOverlay
                        key={imageIndex}
                        visible={
                          (uploadProgress.progress !== 100 &&
                            uploadProgress.id === image.id) ||
                          loading
                        }
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
                        data-fancybox-map={[
                          `${image.geodata?.latitude}`,
                          `${image.geodata?.longitude}`,
                        ]}
                        id={image.name}
                        href={image.url}
                        onContextMenu={e => handleContextMenu(e, image)}
                      >
                        <img
                          loading='lazy'
                          id={image.name}
                          className={`${check.find(item => item.id === image.id)?.checked === true ? 'scale-95' : ''} h-full w-full transform rounded-lg object-cover transition-transform sm:h-80`}
                          src={image.preview}
                        />
                        <div
                          className={`${check.find(item => item.id === image.id)?.checked === true ? 'scale-95' : ''} absolute inset-0 transform rounded-lg transition-all duration-300 group-hover:bg-fade-top`}
                        ></div>
                      </a>
                      <Checkbox
                        className={`${check.find(item => item.id === image.id)?.checked === true ? 'left-3 top-3 block' : 'hidden'} absolute left-1 top-1 transform bg-transparent transition-transform group-hover:block`}
                        variant='filled'
                        onChange={() => {
                          setCheck(prev =>
                            prev.map(item =>
                              item.id === image.id
                                ? { id: item.id, checked: !item.checked }
                                : item,
                            ),
                          )
                        }}
                        checked={
                          check.find(item => item.id === image.id)?.checked ||
                          false
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
      </Fancybox>
      <div
        className={`absolute bottom-0 w-full ${check.some(item => item.checked === true) ? 'block opacity-100' : 'hidden'} 
         opacity-0 transition-opacity duration-300 ease-in-out `}
      >
        <div
          className={`delay-10 fixed bottom-0 flex h-32 w-full border-t border-gray-100 bg-gray-100 px-5 `}
        >
          <Group>
            <Button variant='outline' onClick={downloadImages}>
              <span>Скачать</span>
            </Button>
            <Button
              variant='outline'
              color='red'
              onClick={() => {
                if (window.location.href.includes('album')) {
                  const checkedImages = userImages.filter(image =>
                    check.find(
                      item => item.id === image.id && item.checked === true,
                    ),
                  )
                  checkedImages.forEach(image => {
                    handleRemoveImageFromAlbum?.(
                      album as AlbumResponse,
                      image.id,
                      image.file,
                    )
                  })
                } else {
                  const checkedImages = userImages.filter(image =>
                    check.find(
                      item => item.id === image.id && item.checked === true,
                    ),
                  )
                  checkedImages.forEach(image => {
                    handleRemoveImage?.(image.id, image.file)
                  })
                }
              }}
            >
              <span>Удалить выбранные файлы</span>
            </Button>
          </Group>
        </div>
      </div>
    </>
  )
}

export default ImagesRender
