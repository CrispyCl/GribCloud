import useAlbums from '@/hooks/useAlbums'
import Body from '@components/Body/Body'
import { EllipsisHorizontalIcon, FolderIcon } from '@heroicons/react/24/outline'
import { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

interface AlbumsProps {}

const Albums: FunctionComponent<AlbumsProps> = () => {
  const { albums } = useAlbums()

  return (
    <Body>
      {!albums.length && (
        <div className='flex flex-col items-center justify-center'>
          <EllipsisHorizontalIcon className='h-16 w-16 text-gray-400' />
          <span className='text-gray-500'>
            Нет созданных/доступных альбомов
          </span>
        </div>
      )}
      <div className='m-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
        {albums.map((item, index) => {
          console.log('item log', item)
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

export default Albums
