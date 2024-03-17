import useAlbums from '@/hooks/useAlbums'
import { UploadImageResponse } from '@/redux/types'
import { Button, Card, LoadingOverlay, Modal } from '@mantine/core'
import { useClickOutside, useDisclosure } from '@mantine/hooks'
import { FunctionComponent } from 'react'

interface ContextMenuProps {
  x: number
  y: number
  image: UploadImageResponse | undefined
  closeContextMenu: () => void
}

const ContextMenu: FunctionComponent<ContextMenuProps> = ({
  x,
  y,
  image,
  closeContextMenu,
}) => {
  const { loading, removeImageFromAlbum } = useAlbums(
    window.location.href.split('/'),
  )
  const ref = useClickOutside(() => {
    if (!opened) {
      closeContextMenu()
    }
  })
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <>
      <Card
        ref={ref}
        className='absolute z-20 w-40 rounded-md bg-white p-2 shadow-lg'
        style={{ top: `${y}px`, left: `${x}px` }}
      >
        <Button
          size='sm'
          variant='outline'
          color='red'
          fullWidth
          onClick={() => {
            open()
          }}
        >
          Удалить
        </Button>
      </Card>
      <Modal opened={opened} onClose={close} title='Удаление' size='sm'>
        {loading && (
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
        )}
        <div className='flex flex-col'>
          <p className='text-gray-500'>Вы уверены, что хотите удалить?</p>
          <div className='mt-5 flex justify-end gap-5'>
            <Button
              onClick={() => {
                close()
                setTimeout(() => {
                  closeContextMenu()
                }, 100)
              }}
              variant='outline'
              color='gray'
            >
              Отмена
            </Button>
            <Button
              onClick={() => {
                if (image) {
                  removeImageFromAlbum(image.id).then(() => {
                    close()
                    setTimeout(() => {
                      closeContextMenu()
                    }, 100)
                  })
                }
              }}
              variant='outline'
              color='red'
            >
              Удалить
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ContextMenu
