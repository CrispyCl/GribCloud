import { uploadAccept } from '@/constants'
import useAlbums from '@/hooks/useAlbums'
import { RootState } from '@/redux/store'
import { AlbumResponse } from '@/redux/types'
import {
  ArrowLeftIcon,
  CheckIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Button, FileButton } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import React, { FunctionComponent } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ModalCreateAlbum from '../Modal/ModalCreateAlbum'
import ModalSettingAlbum from '../Modal/ModalSettingAlbum'

interface BodyHeaderProps {
  check?: { id: number; checked: boolean }[]
  album?: AlbumResponse
  setFiles?: React.Dispatch<React.SetStateAction<File[]>>
  selectAll?: () => void
}

const BodyHeader: FunctionComponent<BodyHeaderProps> = ({
  check,
  album,
  setFiles,
  selectAll,
}) => {
  const { albumLoading } = useAlbums()
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
          {((window.location.href.split('/').includes('album') &&
            (album?.memberships?.find(
              item =>
                item.member === currentUser.id && item.is_redactor === true,
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

          <ModalCreateAlbum close={closeCreate} opened={openedCreate} />
          <ModalSettingAlbum
            setKey={setKey}
            openedAddMember={openedAddMember}
            openAddMember={openAddMember}
            closeAddMember={closeAddMember}
            closeSettings={closeSettings}
            openedSettings={openedSettings}
            album={album as AlbumResponse}
            loading={albumLoading}
          />
        </div>
      )}
    </header>
  )
}

export default BodyHeader
