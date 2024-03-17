import { uploadAccept } from '@/constants'
import useAlbums from '@/hooks/useAlbums'
import { RootState } from '@/redux/store'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button, FileButton } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import React, { FunctionComponent } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ModalAlbums from '../Modal/ModalAlbum'

interface BodyHeaderProps {
  title?: string
  setFiles?: React.Dispatch<React.SetStateAction<File[]>>
}

const BodyHeader: FunctionComponent<BodyHeaderProps> = ({
  title,
  setFiles,
}) => {
  const { loading, createAlbum } = useAlbums()
  const [opened, { open, close }] = useDisclosure(false)
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const navigate = useNavigate()
  return (
    <header className='flex items-center justify-between border-b border-gray-100 p-5'>
      <div className='flex items-center gap-4'>
        {(window.location.href.split('/').includes('album') ||
          window.location.href.split('/').includes('publicalbum')) &&
          !isMobile && (
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
        <h1 className='text-xl'>{title}</h1>
      </div>
      {currentUser && (
        <div className='flex gap-4 '>
          {(window.location.href.split('/').includes('publicalbum') ||
            window.location.href.split('/').includes('album') ||
            window.location.href.split('/').includes('all')) && (
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

          {(window.location.href.split('/').includes('groupalbums') ||
            window.location.href.split('/').includes('albums')) && (
            <Button onClick={open} variant='default'>
              Создать альбом
            </Button>
          )}
          <ModalAlbums
            loading={loading}
            createAlbum={createAlbum}
            close={close}
            opened={opened}
          />
        </div>
      )}
    </header>
  )
}

export default BodyHeader
