import useAlbums from '@/hooks/useAlbums'
import { fetchAlbumsSuccess } from '@/redux/slices/albums'
import { fetchPublicAlbumsSuccess } from '@/redux/slices/publicAlbums'
import { AlbumResponse } from '@/redux/types'
import { TrashIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Checkbox,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { FunctionComponent } from 'react'
import { useNavigate } from 'react-router-dom'
import MembersList from '../MembersList/MembersList'
interface ModalSettingAlbumProps {
  album: AlbumResponse
  loading: boolean
  openedAddMember: boolean
  openedSettings: boolean
  openAddMember: () => void
  closeAddMember: () => void
  closeSettings: () => void
  setKey: React.Dispatch<React.SetStateAction<number>>
}

const ModalSettingAlbum: FunctionComponent<ModalSettingAlbumProps> = ({
  album,
  openedAddMember,
  openedSettings,
  openAddMember,
  closeAddMember,
  closeSettings,
  setKey,
}) => {
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { loading, fetchMembers, editAlbum, removeAlbum } = useAlbums()
  const navigate = useNavigate()

  const form = useForm({
    initialValues: {
      title: album?.title,
      is_public: album?.is_public,
    },
    validate: values => ({
      title: values.title?.length === 0 ? 'Обязательное поле' : null,
    }),
  })
  const handleSubmit = () => {
    if (album) {
      if (form.values.is_public) {
        // @ts-ignore
        fetchAlbumsSuccess((prev: AlbumResponse[]) => {
          return prev.map(item => {
            if (item.id === album.id && !item.is_public) {
              return { ...item, is_public: true }
            } else if (item.id === album.id && item.title !== album.title) {
              return { ...item, title: form.values.title as string }
            } else if (
              item.id === album.id &&
              !item.is_public &&
              item.title !== album.title
            ) {
              return {
                ...item,
                title: form.values.title as string,
                is_public: true,
              }
            }
            return item
          })
        })
      } else if (!form.values.is_public) {
        // @ts-ignore
        fetchPublicAlbumsSuccess((prev: AlbumResponse[]) => {
          return prev.map(item => {
            if (item.id === album.id && !item.is_public) {
              return { ...item, is_public: false }
            } else if (item.id === album.id && item.title !== album.title) {
              return { ...item, title: form.values.title as string }
            } else if (
              item.id === album.id &&
              !item.is_public &&
              item.title !== album.title
            ) {
              return {
                ...item,
                title: form.values.title as string,
                is_public: false,
              }
            }
            return item
          })
        })
      }
      editAlbum(
        album.id,
        form.values.title as string,
        form.values.is_public as boolean,
      )
      if (!loading) {
        closeSettings()
      }
      setKey(prev => prev + 1)
    }
  }
  return (
    <Modal
      opened={openedSettings}
      onClose={closeSettings}
      title='Настройки альбома'
      centered
      fullScreen={isMobile}
      size={'xl'}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <div className='flex flex-col'>
        <div className='flex items-center justify-center gap-5'>
          <Group className='flex gap-5'>
            <Input.Wrapper w={'100%'} label='Название альбома' withAsterisk>
              <TextInput
                placeholder='Пример: Мои фото'
                value={form.values.title}
                onChange={event =>
                  form.setFieldValue('title', event.currentTarget.value)
                }
                error={form.errors.title}
              />
            </Input.Wrapper>
            <Checkbox
              label='Публичный'
              checked={form.values?.is_public}
              onChange={event =>
                form.setFieldValue('is_public', event.currentTarget.checked)
              }
            />
          </Group>
        </div>
        <div className='px-0 md:px-10'>
          <div className='mt-5 flex items-center justify-between'>
            <Text size='xl'>Участники</Text>
            <div>
              <Button variant='default' onClick={openAddMember}>
                Добавить
              </Button>
            </div>
          </div>
          <MembersList />
        </div>
        <div className='mt-5 flex justify-end'>
          <div className='flex gap-5'>
            <Button
              variant='subtle'
              color='red'
              onClick={openDelete}
              leftSection={<TrashIcon className='h-5 w-5' />}
            >
              Удалить альбом
            </Button>
            <Button
              className='border-blue-500 text-blue-500'
              onClick={handleSubmit}
            >
              Изменить данные
            </Button>
          </div>
        </div>
      </div>
      <Modal
        opened={openedAddMember}
        onClose={closeAddMember}
        title='Добавить участника'
        centered
        fullScreen={isMobile}
        size={'xl'}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      </Modal>
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title='Удалить альбом?'
        centered
        fullScreen={isMobile}
        size={'xl'}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <Text size='xl'>
          Вы уверены, что хотите удалить альбом? Все фотографии будут удалены.
        </Text>
        <div className='mt-5 flex justify-end'>
          <div className='flex gap-5'>
            <Button
              variant='subtle'
              color='red'
              leftSection={<TrashIcon className='h-5 w-5' />}
              onClick={() => {
                removeAlbum(album)
                if (!loading) {
                  navigate('/albums')
                }
              }}
            >
              Удалить
            </Button>
            <Button
              className='border-blue-500 text-blue-500'
              onClick={closeDelete}
            >
              Отмена
            </Button>
          </div>
        </div>
      </Modal>
    </Modal>
  )
}

export default ModalSettingAlbum
