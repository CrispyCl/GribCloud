import { uploadAccept } from '@/constants'
import useAlbums from '@/hooks/useAlbums'
import { RootState } from '@/redux/store'
import { AlbumResponse } from '@/redux/types'
import { ArrowLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Button, FileButton } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import React, { FunctionComponent } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ModalCreateAlbum from '../Modal/ModalCreateAlbum'
import ModalSettingAlbum from '../Modal/ModalSettingAlbum'

interface BodyHeaderProps {
  album?: AlbumResponse
  setFiles?: React.Dispatch<React.SetStateAction<File[]>>
}

const BodyHeader: FunctionComponent<BodyHeaderProps> = ({
  album,
  setFiles,
}) => {
  const { loading } = useAlbums()
  const [openedCreate, { open: openCreate, close: closeCreate }] =
    useDisclosure(false)
  const [openedSettings, { open: openSettings, close: closeSettings }] =
    useDisclosure(false)
  const [openedAddMember, { open: openAddMember, close: closeAddMember }] =
    useDisclosure(false)
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const navigate = useNavigate()
  const [key, setKey] = React.useState(0)
  return (
    <header
      key={key}
      className='flex  h-[75px] items-center justify-between border-b border-gray-100 p-5'
    >
      <div className='flex items-center gap-4'>
        {window.location.href.split('/').includes('album') && !isMobile && (
          <Button
            variant='default'
            className='border-none'
            leftSection={<ArrowLeftIcon className='h-5 w-5' />}
            onClick={e => {
              e.preventDefault()
              navigate(-1)
            }}
          >
            Назад
          </Button>
        )}
        <h1 className='text-xl'>{album?.title}</h1>
      </div>
      {currentUser && (
        <div className='flex gap-4 '>
          {(window.location.href.split('/').includes('album') ||
            window.location.href.split('/').includes('all')) &&
            currentUser.id === album?.author.id && (
              <FileButton
                onChange={setFiles ? setFiles : () => {}}
                accept={`${uploadAccept.map(item => item).join(',')}`}
                multiple
              >
                {props => (
                  <Button
                    variant='default'
                    {...props}
                    className='border-none hover:bg-gray-100'
                    leftSection={
                      <img
                        src='/svg/CloudArrowUp.svg'
                        alt='upload'
                        className='h-5 w-5'
                      />
                    }
                  >
                    Загрузить
                  </Button>
                )}
              </FileButton>
            )}
          {window.location.href.split('/').includes('album') &&
            currentUser.id === album?.author.id && (
              <Button
                variant='default'
                onClick={openSettings}
                className='border-none hover:bg-gray-100'
                leftSection={<Cog6ToothIcon className='h-5 w-5' />}
              >
                Настройки
              </Button>
            )}

          {(window.location.href.split('/').includes('groupalbums') ||
            window.location.href.split('/').includes('albums')) && (
            <Button onClick={openCreate} variant='default'>
              Создать альбом
            </Button>
          )}
          <ModalCreateAlbum close={closeCreate} opened={openedCreate} />
          <ModalSettingAlbum
            setKey={setKey}
            openedAddMember={openedAddMember}
            openAddMember={openAddMember}
            closeAddMember={closeAddMember}
            closeSettings={closeSettings}
            openedSettings={openedSettings}
            album={album as AlbumResponse}
            loading={loading}
          />
        </div>
      )}
    </header>
  )
}

export default BodyHeader
