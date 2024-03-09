import Body from '@/components/Body/Body'
import ModalUserEdit from '@/components/Modal/ModalUserEdit'
import { useAvatar } from '@/hooks/useAvatar'
import { RootState } from '@/redux/store'
import { UserResponse } from '@/redux/types'
import { Avatar } from '@mantine/core'
import { useSelector } from 'react-redux'

const UserProfile = ({ user }: { user: UserResponse }) => {
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const { avatar } = useAvatar()

  return (
    <Body>
      <div className='my-5 flex flex-col items-center justify-center'>
        <Avatar src={avatar} h={150} w={150} variant='transparent' />
        <span className='my-3'>{currentUser?.username}</span>

        <div className='flex gap-10 text-sm'>
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
        </div>
        {user.id === currentUser?.id && <ModalUserEdit />}
      </div>
    </Body>
  )
}
export default UserProfile
