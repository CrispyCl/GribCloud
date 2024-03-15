import Body from '@/components/Body/Body'
import ModalUserEdit from '@/components/Modal/ModalUserEdit'
import { useAvatar } from '@/hooks/useAvatar'
import { RootState } from '@/redux/store'
import { UserResponse } from '@/redux/types'
import { Avatar, LoadingOverlay } from '@mantine/core'
import { FunctionComponent } from 'react'
import { useSelector } from 'react-redux'

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

  return (
    <Body>
      {userLoading && (
        <LoadingOverlay
          visible={userLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      )}
      <div className='my-5 flex flex-col items-center justify-center'>
        <Avatar
          src={currentUser ? avatar : userAvatar}
          h={150}
          w={150}
          variant='transparent'
        />
        <span className='my-3'>
          {currentUser ? currentUser.username : user?.username}
        </span>

        {/* <div className='flex gap-10 text-sm'>
          <div className='flex flex-col items-center'>
            <span className='font-bold'>10</span>
            <span>Following</span>
          </div>
          <div className='flex flex-col items-center'>
            <span className='font-bold'>1.20 K</span>
            <span>Followers</span>
          </div>
          <div className='flex flex-col items-center'>
            <span className='font-bold'>100 K</span>
            <span>Likes</span>
          </div>
        </div> */}
        {user.id === currentUser?.id && <ModalUserEdit />}
      </div>
    </Body>
  )
}
export default UserProfile
