import Fancybox from '@/components/LightGallery/Fancybox'
import { uploadAccept } from '@/constants'
import useAlbums from '@/hooks/useAlbums'
import { useFiles } from '@/hooks/useFiles'
import { RootState } from '@/redux/store'
import {
  AlbumResponse,
  GroupedImages,
  Tag,
  UploadImageResponse,
} from '@/redux/types'
import api from '@/utils/axios'
import {
  CloudArrowUpIcon,
  Cog6ToothIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  Button,
  CheckIcon,
  Checkbox,
  FileButton,
  Group,
  LoadingOverlay,
  Pill,
  Select,
} from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import JSZip from 'jszip'
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react'
import 'react-circular-progressbar/dist/styles.css'
import { useSelector } from 'react-redux'
import BodyHeader from '../Header/BodyHeader'
import InputWithButton from '../Header/TextInput'
import ModalAddTag from '../Modal/ModalAddTag'

interface ImagesRenderProps {
  userImages: UploadImageResponse[]
  open: () => void
  openMap: () => void
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
  tagKey: number
  setTagKey: React.Dispatch<React.SetStateAction<number>>
}

const ImagesRender: FunctionComponent<ImagesRenderProps> = ({
  tagKey,
  setTagKey,
  album,
  userImages,
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
  const [searchValue, setSearchValue] = useState('')
  const [sortBy, setSortBy] = useState<string | null>('')
  const [tags, setTags] = useState<string[]>([])
  const [addTagOpen, { open: openAddTag, close: closeAddTag }] =
    useDisclosure(false)
  const [addTagId, setAddTagId] = useState<number | undefined>(undefined)

  const [openedCreate, { open: openCreate, close: closeCreate }] =
    useDisclosure(false)
  const [openedSettings, { open: openSettings, close: closeSettings }] =
    useDisclosure(false)

  const { files } = useFiles(window.location.href.split('/'))
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const { loading } = useFiles(window.location.href.split('/'))
  const { albumLoading } = useAlbums()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const w960 = useMediaQuery('(max-width: 960px)')

  // fetch all tags
  const fetchAllTags = async () => {
    try {
      if (window.location.href.split('/').includes('all')) {
        const res = await api.get(`api/v1/files/`)
        const newTags: Tag[] = []
        res.data.forEach((image: UploadImageResponse) => {
          image.tags.forEach((tag: Tag) => {
            if (!newTags.find(t => t.id === tag.id)) {
              newTags.push(tag)
            }
          })
        })
        setTags(newTags.map(tag => tag.title))
      } else if (window.location.href.split('/').includes('album')) {
        const res = await api.get(`api/v1/albums/`)
        const newTags: Tag[] = []
        res.data.flatMap((album: AlbumResponse) => {
          album.files.map((image: UploadImageResponse) => {
            image.tags.forEach((tag: Tag) => {
              if (!newTags.find(t => t.id === tag.id)) {
                newTags.push(tag)
              }
            })
          })
        })
        setTags(newTags.map(tag => tag.title))
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchAllTags()
  }, [tagKey])

  // Sort images by tag
  const sortImages = (images: UploadImageResponse[]) => {
    if (sortBy) {
      return images
        .filter(image => {
          const tag = image.tags.find(tag => tag.title === sortBy)
          return tag !== undefined
        })
        .sort((a, b) => {
          const aTag = a.tags.find(tag => tag.title === sortBy)!
          const bTag = b.tags.find(tag => tag.title === sortBy)!
          return aTag.id - bTag.id
        })
    }
    return images
  }

  let sortedImages = sortImages(userImages)

  if (searchValue !== '') {
    const filteredImages = sortedImages.filter(image => {
      const city = image.geodata?.city || ''
      const country = image.geodata?.country || ''
      return (
        city.toLowerCase().includes(searchValue.toLowerCase()) ||
        country.toLowerCase().includes(searchValue.toLowerCase())
      )
    })

    filteredImages.forEach(image => {
      const date = new Date(image.created_at).toLocaleDateString()
      const group = groupedImages.find(group => group.date === date)
      if (group) {
        group.images.push(image)
      } else {
        groupedImages.push({ date, images: [image] })
      }
    })
  } else {
    sortedImages.forEach(image => {
      const date = new Date(image.created_at).toLocaleDateString()
      const group = groupedImages.find(group => group.date === date)
      if (group) {
        group.images.push(image)
      } else {
        groupedImages.push({ date, images: [image] })
      }
    })
  }

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
    if (userImages.length > 0) {
      setCheck(
        userImages
          .filter(image => image !== undefined)
          .map(image => ({ id: image.id, checked: false })),
      )
    }
  }, [userImages, files, tagKey])

  useEffect(() => {
    setAllLoading(loading || albumLoading)
  }, [loading, albumLoading])

  return (
    <Fragment key={tagKey}>
      <ModalAddTag
        setTagKey={setTagKey}
        addTagClose={closeAddTag}
        addTagOpened={addTagOpen}
        id={addTagId as number}
      />
      <BodyHeader
        openSettings={openSettings}
        openCreate={openCreate}
        openedCreate={openedCreate}
        closeCreate={closeCreate}
        openedSettings={openedSettings}
        closeSettings={closeSettings}
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
        addTagOpen={openAddTag}
        setAddTagId={setAddTagId}
      >
        <LoadingOverlay
          visible={allLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <div className='flex items-center justify-end'>
          <div className='flex items-center gap-5'>
            {(window.location.href.split('/').includes('album') ||
              window.location.href.split('/').includes('all')) &&
              !isMobile && (
                <>
                  <InputWithButton setSearchValue={setSearchValue} />
                  {tags && tags.length !== 0 && (
                    <Select data={tags} value={sortBy} onChange={setSortBy} />
                  )}
                </>
              )}
          </div>
        </div>
        {isMobile && (
          <div className='m-auto mb-5 flex w-3/4 flex-col justify-center gap-5'>
            {(window.location.href.split('/').includes('album') ||
              window.location.href.split('/').includes('all')) && (
              <>
                <InputWithButton setSearchValue={setSearchValue} />
                {tags && tags.length !== 0 && (
                  <Select data={tags} value={sortBy} onChange={setSortBy} />
                )}
              </>
            )}
          </div>
        )}
        {}
        {(!userImages || !userImages.length) && allLoading === false && (
          <>
            {(!userImages || !userImages.length) && searchValue === '' && (
              <div className='flex h-full flex-col items-center justify-center'>
                <EllipsisHorizontalIcon className='h-16 w-16 text-gray-400' />
                <span className='text-gray-500'>
                  Нет загруженных изображений
                </span>
              </div>
            )}
          </>
        )}
        {groupedImages.length === 0 &&
          allLoading === false &&
          searchValue !== '' && (
            <div className='flex h-full flex-col items-center justify-center'>
              <EllipsisHorizontalIcon className='h-16 w-16 text-gray-400' />
              <span className='text-gray-500'>
                Нет загруженных изображений сделанных в этом городе/стране
              </span>
            </div>
          )}
        {groupedImages
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map((group, index) => (
            <div key={index} className='flex flex-col'>
              {w960 && currentUser !== null && (
                <div className=' mb-8 flex flex-col gap-2'>
                  {((window.location.href.split('/').includes('album') &&
                    (album?.memberships?.find(
                      item =>
                        item.member === currentUser.id &&
                        item.is_redactor === true,
                    ) ||
                      currentUser.id === album?.author.id)) ||
                    window.location.href.split('/').includes('all')) && (
                    <FileButton
                      onChange={setFiles ? setFiles : () => {}}
                      accept={`${uploadAccept.map(item => item).join(',')}`}
                      multiple
                    >
                      {props => (
                        <Button
                          variant='outline'
                          {...props}
                          leftSection={<CloudArrowUpIcon className='h-5 w-5' />}
                        >
                          Загрузить
                        </Button>
                      )}
                    </FileButton>
                  )}
                  {(window.location.href.split('/').includes('album') ||
                    window.location.href.split('/').includes('all')) &&
                    check?.length !== 0 && (
                      <Button
                        variant='outline'
                        onClick={selectAll}
                        leftSection={
                          check?.every(item => item.checked) ? (
                            <XMarkIcon className='h-5 w-5' />
                          ) : (
                            <CheckIcon className='h-5 w-5' />
                          )
                        }
                      >
                        {check?.every(item => item.checked)
                          ? 'Убрать выделение'
                          : 'Выбрать все файлы'}
                      </Button>
                    )}
                  {window.location.href.split('/').includes('album') &&
                    currentUser.id === album?.author.id && (
                      <Button
                        variant='outline'
                        onClick={openSettings}
                        leftSection={<Cog6ToothIcon className='h-5 w-5' />}
                      >
                        Настройки
                      </Button>
                    )}
                  {(window.location.href.split('/').includes('groupalbums') ||
                    window.location.href.split('/').includes('albums')) &&
                    currentUser && (
                      <Button onClick={openCreate} variant='outline'>
                        Создать альбом
                      </Button>
                    )}
                </div>
              )}

              <div className='flex items-center justify-between'>
                <span className='text-gray-500'>{group.date}</span>
              </div>
              <div className='grid grid-cols-1 gap-5 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                {group.images.map((image, imageIndex) => {
                  return (
                    <Fragment key={imageIndex}>
                      <div className='group relative overflow-hidden'>
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
                          <div
                            className={` ${check.find(item => item.id === image.id)?.checked === true ? 'bottom-5 left-5' : ''} absolute bottom-3 left-3 flex max-h-20 transform flex-wrap gap-1 pr-3 transition-all duration-300`}
                          >
                            {image.tags && image.tags.length > 0 ? (
                              image.tags.map((tag, index) => (
                                <Pill key={index} className='bg-blue-100'>
                                  {tag.title}
                                </Pill>
                              ))
                            ) : (
                              <Pill key={index} className='bg-red-100'>
                                Нет тегов
                              </Pill>
                            )}
                          </div>
                        </a>
                        <Checkbox
                          className={`${check.find(item => item.id === image.id)?.checked === true ? 'left-3 top-3 block' : 'hidden'} absolute left-1 top-1 transform bg-transparent transition-all group-hover:block`}
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
    </Fragment>
  )
}

export default ImagesRender
