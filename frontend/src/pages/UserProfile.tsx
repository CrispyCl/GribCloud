import Body from '@/components/Body/Body'
import ImagesRender from '@/components/ImagesRednder/ImagesRender'
import ModalUserEdit from '@/components/Modal/ModalUserEdit'
import { useAvatar } from '@/hooks/useAvatar'
import { useFiles } from '@/hooks/useFiles'
import useFolders from '@/hooks/useFolders'
import { RootState } from '@/redux/store'
import { UserResponse } from '@/redux/types'
import { Avatar, Button } from '@mantine/core'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const UserProfile = ({ user }: { user: UserResponse }) => {
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const { userFolders } = useFolders(user)
  const { userImages } = useFiles(user)
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

        <div className='mb-3 grid grid-cols-4 gap-3'>
          {userFolders.map((folder, index) => {
            return (
              <Link to={folder} key={index}>
                <Button variant='light' className='flex h-10 p-2 text-black'>
                  <span className='flex items-center gap-3'>
                    <img
                      src='/svg/Folder.svg'
                      alt='folder'
                      className='h-5 w-5'
                    />
                    <span>{folder}</span>
                  </span>
                </Button>
              </Link>
            )
          })}
          <ImagesRender userImages={userImages} />
        </div>
      </div>
    </Body>
  )
}
export default UserProfile
