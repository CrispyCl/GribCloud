import useAlbums from '@/hooks/useAlbums'
import { RootState } from '@/redux/store'
import { AccountResponse } from '@/redux/types'
import {
  Button,
  Checkbox,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import { FunctionComponent } from 'react'
import { useSelector } from 'react-redux'

interface ModalCreateAlbumProps {
  opened: boolean
  close: () => void
}

const ModalCreateAlbum: FunctionComponent<ModalCreateAlbumProps> = ({
  opened,
  close,
}) => {
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { loading, createAlbum } = useAlbums()

  const form = useForm({
    initialValues: {
      name: '',
      isPublic: window.location.href.split('/').includes('groupalbums')
        ? true
        : false,
    },
  })

  const handleClose = () => {
    close()
    form.reset()
  }
  return (
    <Modal
      opened={opened}
      onClose={close}
      title='Создание альбома'
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
      <Group className='flex flex-col gap-5'>
        <Group className='flex-start flex gap-5'>
          <Input.Wrapper w={'100%'} label='Название альбома' withAsterisk>
            <TextInput
              value={form.values.name}
              onChange={event =>
                form.setFieldValue('name', event.currentTarget.value)
              }
              placeholder='Пример: Мои фото'
            />
          </Input.Wrapper>
          <Checkbox
            checked={form.values.isPublic}
            onChange={event =>
              form.setFieldValue('isPublic', event.currentTarget.checked)
            }
            label='Публичный'
          />
        </Group>
        <Button
          onClick={() => {
            createAlbum(
              form.values.name,
              currentUser as AccountResponse,
              form.values.isPublic,
            )
            if (!loading) {
              handleClose()
            }
          }}
          variant='default'
        >
          Создать альбом
        </Button>
      </Group>
    </Modal>
  )
}

export default ModalCreateAlbum
