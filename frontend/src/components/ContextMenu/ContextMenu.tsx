import useAlbums from '@/hooks/useAlbums'
import { AlbumResponse, UploadImageResponse } from '@/redux/types'
import { Button, Card, LoadingOverlay, Modal } from '@mantine/core'
import { useClickOutside, useDisclosure } from '@mantine/hooks'
import { FunctionComponent } from 'react'

interface ContextMenuProps {
  album: AlbumResponse
  x: number
  y: number
  image: UploadImageResponse | undefined
  closeContextMenu: () => void
  handleRemoveImageFromAlbum: (album: AlbumResponse, image: number) => void
  handleRemoveImage: (image: number) => void
}

const ContextMenu: FunctionComponent<ContextMenuProps> = ({
  handleRemoveImageFromAlbum,
  handleRemoveImage,
  album,
  x,
  y,
  image,
  closeContextMenu,
}) => {
  const { loading } = useAlbums(window.location.href.split('/'))
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
      <Modal
        opened={opened}
        onClose={() => {
          close()
          setTimeout(() => {
            closeContextMenu()
          }, 100)
        }}
        title='Удаление'
        size='sm'
      >
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <div className='flex flex-col'>
          <p className='flex flex-col text-gray-500'>
            {window.location.href.includes('all') ? (
              <>
                <span>Вы уверены, что хотите удалить {image?.name}? </span>
                <span className='mt-2'>
                  Он удалиться из всех альбомов, в которых он находится.
                </span>
              </>
            ) : (
              <span>Вы уверены, что хотите удалить {image?.name}?</span>
            )}
          </p>
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
                  if (album) {
                    handleRemoveImageFromAlbum(album, image.id)
                  } else {
                    handleRemoveImage(image.id)
                  }
                  close()
                  setTimeout(() => {
                    closeContextMenu()
                  }, 100)
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
