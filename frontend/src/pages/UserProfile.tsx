import Body from '@/components/Body/Body'
import BodyHeader from '@/components/Header/BodyHeader'
import ModalUserEdit from '@/components/Modal/ModalUserEdit'
import { useAvatar } from '@/hooks/useAvatar'
import { RootState } from '@/redux/store'
import { AlbumResponse, UserResponse } from '@/redux/types'
import api from '@/utils/axios'
import { FolderIcon } from '@heroicons/react/24/outline'
import { Avatar, LoadingOverlay } from '@mantine/core'
import { FunctionComponent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

interface UserProfileProps {
  user: UserResponse
  userLoading: boolean
}

const UserProfile: FunctionComponent<UserProfileProps> = ({
  user,
  userLoading,
}) => {
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const { avatar, userAvatar } = useAvatar(user)
  const [available, setAvailable] = useState<AlbumResponse[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api
      .get(`/api/v1/albums/?author=${user.id}`)
      .then(res => {
        setAvailable(res.data)
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <Body loading={userLoading}>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <BodyHeader />
      <div className='my-5 flex flex-col items-center justify-center'>
        <Avatar
          src={currentUser?.id === user.id ? avatar : userAvatar}
          h={150}
          w={150}
          variant='transparent'
        />
        <span className='my-3'>
          {currentUser?.id === user.id ? currentUser.username : user?.username}
        </span>
        {user.id === currentUser?.id && <ModalUserEdit />}
      </div>
      {available.length ? (
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
      ) : (
        <div className='flex flex-col items-center justify-center'>
          <span className='text-gray-500'>
            Нет созданных альбомов или доступных вам альбомов
          </span>
        </div>
      )}
    </Body>
  )
}
export default UserProfile
