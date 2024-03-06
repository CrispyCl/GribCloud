import Body from '@/components/Body/Body'
import LightGallery from '@/components/LightGallery/LightGallery'
import ModalUserEdit from '@/components/Modal/ModalUserEdit'
import { imgStorage } from '@/firebase/config'
import { useFiles } from '@/hooks/useFiles'
import useFolders from '@/hooks/useFolders'
import { RootState } from '@/redux/store'
import { UserResponse } from '@/redux/types'
import { Avatar, Button } from '@mantine/core'
import { getDownloadURL, ref } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const UserProfile = ({ user }: { user: UserResponse }) => {
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const [avatar, setAvatar] = useState<string | undefined>(undefined)
  const { userFolders } = useFolders(user)
  const { userImages } = useFiles(user)
  useEffect(() => {
    const fetchExistingAvatar = async () => {
      const url = await getDownloadURL(ref(imgStorage, `avatars/${user.id}`))
      if (url) {
        setAvatar(url)
      } else {
        setAvatar(undefined)
      }
    }
    fetchExistingAvatar()
  }, [])
  return (
    <Body>
      <div className='my-5 flex flex-col items-center justify-center'>
        <Avatar src={avatar} h={150} w={150} variant='transparent' />
        <span className='my-3'>{user.username}</span>

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

        <p className='mb-3 grid grid-cols-4 gap-3'>
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
          <LightGallery>
            {userImages.map((image, index) => {
              if (
                image.name.includes('.mp4') ||
                image.name.includes('.mov') ||
                image.name.includes('.webm') ||
                image.name.includes('.ogg')
              ) {
                return (
                  <a
                    key={index}
                    data-lg-size='1280-720'
                    data-video={`{"source": [{"src":"${image.url}", "type":"video/mp4"}], "attributes": {"preload": false, "controls": true, "playsinline": true}}`}
                    data-poster='https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg'
                    data-sub-html="<h4>'Peck Pocketed' by Kevin Herron | Disney Favorite</h4>"
                  >
                    <img
                      width='300'
                      height='100'
                      src='https://img.youtube.com/vi/EIUJfXk3_3w/maxresdefault.jpg'
                    />
                  </a>
                )
              } else if (
                image.name.includes('.png') ||
                image.name.includes('.jpg') ||
                image.name.includes('.jpeg') ||
                image.name.includes('.raw') ||
                image.name.includes('.bmp') ||
                image.name.includes('.gif') ||
                image.name.includes('.webp') ||
                image.name.includes('.svg') ||
                image.name.includes('.heif') ||
                image.name.includes('.heic') ||
                image.name.includes('.tiff') ||
                image.name.includes('.tif') ||
                image.name.includes('.ico') ||
                image.name.includes('.jfif') ||
                image.name.includes('.nef')
              ) {
                return (
                  <a href={image.url} key={index}>
                    <img
                      width={200}
                      height={200}
                      className='object-cover'
                      src={image.url}
                    />
                  </a>
                )
              }
            })}
          </LightGallery>
        </p>
      </div>
    </Body>
  )
}
export default UserProfile
