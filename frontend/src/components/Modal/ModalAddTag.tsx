import { RootState } from '@/redux/store'
import { Tag, UploadImageResponse } from '@/redux/types'
import api from '@/utils/axios'
import { Button, Input, LoadingOverlay, Modal, TagsInput } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { FunctionComponent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface ModalAddTagProps {
  addTagClose: () => void
  addTagOpened: boolean
  id: number
  setTagKey: React.Dispatch<React.SetStateAction<number>>
}

const ModalAddTag: FunctionComponent<ModalAddTagProps> = ({
  addTagClose,
  setTagKey,
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
  const currentUser = useSelector((state: RootState) => state.auth.account)

  //  fetch all tags
  const fetchAllTags = async () => {
    if (!currentUser || !addTagOpened) return
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
  useEffect(() => {
    fetchAllTags()
  }, [key])

  // fetch current tags
  const fetchCurrentTags = async () => {
    if (!currentUser || !addTagOpened) return
    try {
      const res = await api.get(`api/v1/files/${id}/`)
      const currentTags: Tag[] = res.data.tags
      setInitialTags(currentTags)
      setCurrentTags(currentTags)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchCurrentTags()
  }, [id, key])

  const addTag = async () => {
    if (!currentUser || !addTagOpened) return
    try {
      setLoading(true)
      if (newTag !== '') {
        api
          .post(`api/v1/files/${id}/tags/${newTag}/`)
          .then(res => {
            console.log(res.data.tags.find((t: Tag) => t.title === newTag))
            setCurrentTags([
              ...currentTags,
              res.data.tags.find((t: Tag) => t.title === newTag),
            ])
          })
          .then(() => {
            setNewTag('')
            setKey(key + 1)
          })
      }

      const deletedTags = initialTags.filter(
        tag => !currentTags.find(t => t.id === tag.id),
      )

      const addedTags = currentTags.filter(
        tag => !initialTags.find(t => t.id === tag.id),
      )

      const deletePromises = deletedTags.map(tag =>
        api.delete(`api/v1/files/${id}/tags/${tag.title}/`).then(() => {
          setCurrentTags(currentTags.filter(t => t.id !== tag.id))
        }),
      )

      const addPromises = addedTags.map(tag => {
        api.post(`api/v1/files/${id}/tags/${tag.title}/`).then(res => {
          setCurrentTags([
            ...currentTags,
            res.data.tags.find((t: Tag) => t.title === tag.title),
          ])
        })
      })

      await Promise.all([...deletePromises, ...addPromises])
      setTimeout(() => {
        setTagKey(k => k + 1)
        setKey(k => k + 1)
      }, 1000)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
      if (newTag === '') addTagClose()
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
            <Button className='w-1/4' variant='default' onClick={addTag}>
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
