import BodyHeader from '@/components/Header/BodyHeader'
import { imgStorage } from '@/firebase/config'
import useAlbums from '@/hooks/useAlbums'
import { RootState } from '@/redux/store'
import { UserResponse } from '@/redux/types'
import api from '@/utils/axios'
import Body from '@components/Body/Body'
import { EllipsisHorizontalIcon, FolderIcon } from '@heroicons/react/24/outline'
import { Avatar, Button } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { getDownloadURL, ref } from 'firebase/storage'
import { FunctionComponent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

interface GroupAlbumsProps {}

const GroupAlbums: FunctionComponent<GroupAlbumsProps> = () => {
  const { publicAlbums, albumLoading } = useAlbums()
  const [openedCreate, { open: openCreate, close: closeCreate }] =
    useDisclosure(false)
  const w960 = useMediaQuery('(max-width: 960px)')
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const [usersData, setUsersData] = useState<Record<string, UserResponse>>({})
  const [avatars, setAvatars] = useState<Record<number, string>>({})
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAvatars = async () => {
      const usersData: Record<string, UserResponse> = {}
      const avatars: Record<number, string> = {}

      // Для каждого альбома получите информацию об авторе
      for (const album of publicAlbums) {
        const authorId = album.author.id
        if (!usersData[authorId]) {
          const userData = await api.get(
            `api/v1/user/?username=${album.author.username}`,
          )
          // @ts-ignore
          usersData[authorId] = userData
          const avatarUrl = await getDownloadURL(
            ref(imgStorage, `avatars/${authorId}`),
          )
          avatars[album.id] = avatarUrl
        }
      }

      setUsersData(usersData)
      setAvatars(avatars)
    }

    fetchAvatars()
  }, [publicAlbums])

  return (
    <Body loading={albumLoading}>
      <BodyHeader
        openCreate={openCreate}
        closeCreate={closeCreate}
        openedCreate={openedCreate}
      />
      {w960 && currentUser !== null && (
        <div className=' mx-10 mb-8 flex flex-col'>
          {(window.location.href.split('/').includes('groupalbums') ||
            window.location.href.split('/').includes('albums')) &&
            currentUser && (
              <Button onClick={openCreate} variant='outline'>
                Создать альбом
              </Button>
            )}
        </div>
      )}
      {!publicAlbums.length && (
        <div className='flex flex-col items-center justify-center'>
          <EllipsisHorizontalIcon className='h-16 w-16 text-gray-400' />
          <span className='text-gray-500'>
            Нет созданных/доступных альбомов
          </span>
        </div>
      )}
      <div className='relative m-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
        {publicAlbums.map((item, index) => {
          return (
            <Link to={`/album/${item.id}`} key={index}>
              <div className='relative flex min-h-40 flex-col items-center gap-4 rounded-xl border border-slate-200 p-4'>
                <FolderIcon className='h-16 w-16' />
                <div className='flex flex-1 flex-col'>
                  <p>{item.title}</p>
                </div>

                <div className='absolute bottom-2 right-2 z-50 rounded-full'>
                  <button
                    onClick={event => {
                      event.preventDefault()
                      event.stopPropagation()
                      navigate(`/user/${item.author.id}`)
                    }}
                  >
                    <Avatar src={avatars[item.id]} />
                  </button>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </Body>
  )
}

export default GroupAlbums
