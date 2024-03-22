import BodyHeader from '@/components/Header/BodyHeader'
import useAlbums from '@/hooks/useAlbums'
import { RootState } from '@/redux/store'
import Body from '@components/Body/Body'
import { EllipsisHorizontalIcon, FolderIcon } from '@heroicons/react/24/outline'
import { Button } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { FunctionComponent } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

interface AvailableAlbumsProps {}

const AvailableAlbums: FunctionComponent<AvailableAlbumsProps> = () => {
  const { available, albumLoading } = useAlbums()
  const [openedCreate, { open: openCreate, close: closeCreate }] =
    useDisclosure(false)
  const w960 = useMediaQuery('(max-width: 960px)')
  const currentUser = useSelector((state: RootState) => state.auth.account)
  return (
    <Body loading={albumLoading}>
      <BodyHeader
        openCreate={openCreate}
        closeCreate={closeCreate}
        openedCreate={openedCreate}
      />
      {w960 && currentUser !== null && (
        <div className=' mx-10 mb-8 flex flex-col'>
          {(window.location.href.split('/').includes('availablealbums') ||
            window.location.href.split('/').includes('albums')) &&
            currentUser && (
              <Button onClick={openCreate} variant='outline'>
                Создать альбом
              </Button>
            )}
        </div>
      )}
      {!available.length && (
        <div className='flex flex-col items-center justify-center'>
          <EllipsisHorizontalIcon className='h-16 w-16 text-gray-400' />
          <span className='text-gray-500'>
            Нет созданных/доступных альбомов
          </span>
        </div>
      )}
      <div className='m-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
        {available.map((item, index) => {
          return (
            <Link to={`/album/${item.id}`} key={index}>
              <div className='flex flex-col items-center gap-4 rounded-xl border border-slate-200 p-4'>
                <FolderIcon className='h-16 w-16' />
                <div className='flex flex-1 flex-col'>
                  <p>{item.title}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </Body>
  )
}

export default AvailableAlbums
