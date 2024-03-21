import { UploadImageResponse } from '@/redux/types'
import api from '@/utils/axios'
import { Button, Input, LoadingOverlay, Modal, TagsInput } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { FunctionComponent, useEffect, useState } from 'react'

interface ModalAddTagProps {
  addTagClose: () => void
  addTagOpened: boolean
  id: number
  setImageKey: (key: number) => void
  userImages: UploadImageResponse[]
  setUserImages: (images: UploadImageResponse[]) => void
}

interface Tag {
  id: number
  title: string
}

const ModalAddTag: FunctionComponent<ModalAddTagProps> = ({
  userImages,
  setUserImages,
  addTagClose,
  setImageKey,
  addTagOpened,
  id,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [initialTags, setInitialTags] = useState<Tag[]>([])
  const [currentTags, setCurrentTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState('')
  const [key, setKey] = useState(0)

  //  fetch all tags
  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const res = await api.get(`api/v1/files/`)
        const newTags: Tag[] = []
        res.data.forEach((image: UploadImageResponse) => {
          image.tags.forEach((tag: Tag) => {
            if (!newTags.find(t => t.id === tag.id)) {
              newTags.push(tag)
            }
          })
        })
        setTags(newTags)
      } catch (err) {
        console.log(err)
      }
    }

    fetchAllTags()
  }, [key])

  // fetch current tags
  useEffect(() => {
    const fetchCurrentTags = async () => {
      try {
        const res = await api.get(`api/v1/files/${id}/`)
        const currentTags: Tag[] = res.data.tags
        setInitialTags(currentTags)
        setCurrentTags(currentTags)
      } catch (err) {
        console.log(err)
      }
    }
    fetchCurrentTags()
  }, [id, key])

  const addTag = async () => {
    try {
      setLoading(true)

      // определить, какие теги были удалены
      const deletedTags = initialTags.filter(
        tag => !currentTags.find(t => t.id === tag.id),
      )

      // определить, какие теги были добавлены
      const addedTags = currentTags.filter(
        tag =>
          !initialTags.find(t => t.id === tag.id) &&
          !tags.find(t => t.title === tag.title),
      )

      // удалить удаленные теги
      const deletePromises = deletedTags.map(tag =>
        api.delete(`api/v1/files/${id}/tags/${tag.title}/`).then(() => {
          const newUserImages = [...userImages]
          newUserImages.forEach((image, index) => {
            if (image.id === id) {
              newUserImages[index].tags = newUserImages[index].tags.filter(
                t => t.id !== tag.id,
              )
            }
          })
          setUserImages(newUserImages)
          setTags(tags.filter(t => t.id !== tag.id))
        }),
      )
      // добавить новые теги
      const addPromises = addedTags.map(tag => {
        return api.post(`api/v1/files/${id}/tags/${tag.title}/`).then(res => {
          const newUserImages = [...userImages]
          newUserImages.forEach((image, index) => {
            if (image.id === id) {
              newUserImages[index].tags = [
                ...newUserImages[index].tags,
                res.data.tags.find((tag: Tag) => tag.title === tag.title),
              ]
            }
          })
          setUserImages(newUserImages)
          setTags([
            ...tags,
            res.data.tags.find((tag: Tag) => tag.title === tag.title),
          ])
        })
      })

      // дождаться выполнения всех запросов
      await Promise.all([...deletePromises, ...addPromises])
      setTimeout(() => {
        setKey(key + 1)
      }, 1000)
      setImageKey(key + 1)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
      addTagClose()
    }
  }

  const addNewTag = async () => {
    try {
      const res = await api.post(`api/v1/files/${id}/tags/${newTag}/`)
      setCurrentTags([
        ...currentTags,
        res.data.tags.find((tag: Tag) => tag.title === newTag),
      ])
      setTags([...tags, res.data.tags.find((tag: Tag) => tag.title === newTag)])
      userImages.forEach((image, index) => {
        if (image.id === id) {
          userImages[index].tags = [
            ...userImages[index].tags,
            res.data.tags.find((tag: Tag) => tag.title === newTag),
          ]
        }
      })

      setNewTag('')
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Modal
      key={key}
      fullScreen={isMobile}
      size='100%'
      opened={addTagOpened}
      onClose={addTagClose}
      title='Изменить теги'
    >
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <div className='p-5'>
        <div className='mb-5'>
          <Input.Wrapper w={'100%'} label='Название тегов'>
            <TagsInput
              placeholder='Пример: дом, дерево, машина'
              data={tags?.map(tag => tag.title)}
              value={currentTags?.map(tag => tag.title)}
              onChange={newTags => {
                const selectedTags = tags.filter(tag =>
                  newTags.includes(tag.title),
                )
                setCurrentTags(selectedTags)
              }}
            />
          </Input.Wrapper>
          <div className='mt-2 flex gap-5'>
            <Input
              value={newTag}
              onChange={event => setNewTag(event.currentTarget.value)}
              placeholder='Новый тег'
              className='w-3/4'
            />
            <Button className='w-1/4' variant='default' onClick={addNewTag}>
              Добавить
            </Button>
          </div>
        </div>
        <div className='mt-5 flex justify-end'>
          <Button
            variant='subtle'
            onClick={() => {
              addTag()
            }}
            className='border-blue-500 text-blue-500'
          >
            Изменить теги
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ModalAddTag
