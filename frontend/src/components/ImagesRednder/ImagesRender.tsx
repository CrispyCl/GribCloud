import Fancybox from '@/components/LightGallery/Fancybox'
import useAlbums from '@/hooks/useAlbums'
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
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { useSelector } from 'react-redux'
import BodyHeader from '../Header/BodyHeader'

interface ImagesRenderProps {
  userImages: UploadImageResponse[]
  open: () => void
  openMap: () => void
  addTagOpen: () => void
  uploadProgress?: { id: number; progress: number } | undefined
  album?: AlbumResponse
  setFiles?: React.Dispatch<React.SetStateAction<File[]>>
  setUrl?: React.Dispatch<React.SetStateAction<string | undefined>>
  setName?: React.Dispatch<React.SetStateAction<string | undefined>>
  setLatitude?: React.Dispatch<React.SetStateAction<number | undefined>>
  setLongitude?: React.Dispatch<React.SetStateAction<number | undefined>>
  setAddTagId?: React.Dispatch<React.SetStateAction<number | undefined>>
  handleRemoveImageFromAlbum?: (
    album: AlbumResponse,
    image: number,
    path: string,
  ) => void
  handleRemoveImage?: (image: number, path: string) => void
}

const ImagesRender: FunctionComponent<ImagesRenderProps> = ({
  album,
  userImages,
  uploadProgress,
  addTagOpen,
  setAddTagId,
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
  const [check, setCheck] = useState<{ id: number; checked: boolean }[]>([])
  const [allLoading, setAllLoading] = useState(false)
  const [checkedUrls, setCheckedUrls] = useState<string[]>([])
  const { files } = useFiles(window.location.href.split('/'))
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const { loading } = useFiles(window.location.href.split('/'))
  const { albumLoading } = useAlbums()

  userImages.forEach(image => {
    const date = new Date(image.created_at).toLocaleDateString()
    const group = groupedImages.find(group => group.date === date)
    if (group) {
      group.images.push(image)
    } else {
      groupedImages.push({ date, images: [image] })
    }
  })

  // download checked images in zip
  const downloadImages = async () => {
    try {
      setAllLoading(true)
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
      } else {
        const zip = new JSZip()
        const folder = zip.folder('GribCloud_download')

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
      }
    } catch (error) {
      console.error(
        'Ошибка при скачивании изображений:',
        (error as Error).message,
      )
    } finally {
      setAllLoading(false)
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
    setAllLoading(loading || albumLoading)
  }, [loading, albumLoading])

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
        addTagOpen={addTagOpen}
        setAddTagId={setAddTagId}
      >
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
                  return (
                    <Fragment key={imageIndex}>
                      <LoadingOverlay
                        visible={allLoading}
                        zIndex={1000}
                        overlayProps={{ radius: 'sm', blur: 2 }}
                      />
                      <div className='group relative'>
                        <a
                          className='cursor-pointer'
                          data-fancybox='gallery'
                          data-fancybox-map={[
                            `${image.geodata?.latitude}`,
                            `${image.geodata?.longitude}`,
                          ]}
                          data-fancybox-id={image.id}
                          id={image.name}
                          href={image.url}
                          // data-caption={
                          //   image.tags && image.tags.length > 0
                          //     ? image.tags.map(tag => tag.title)
                          //     : 'Нет тегов'
                          // }
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
                    </Fragment>
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
            <Button
              variant='outline'
              onClick={() => {
                downloadImages()
                setCheck([])
              }}
            >
              <span>Скачать</span>
            </Button>
            {(album?.author.id === currentUser?.id ||
              album?.memberships?.find(
                item =>
                  item.member === currentUser?.id && item.is_redactor === true,
              ) ||
              window.location.href.includes('all')) && (
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
                  setCheck([])
                }}
              >
                <span>Удалить выбранные файлы</span>
              </Button>
            )}
          </Group>
        </div>
      </div>
    </>
  )
}

export default ImagesRender
