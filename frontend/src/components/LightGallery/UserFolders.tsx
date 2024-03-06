import useFolders from '@/hooks/useFolders'
import { Button } from '@mantine/core'
import 'firebase/storage'
import { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
const UserFolders: FunctionComponent = () => {
  const { currentUserFolders, createFolder } = useFolders()
  const handleUpload = async () => {
    const folderName = prompt('enter folder name')
    if (folderName) {
      await createFolder({
        parentFolder: '',
        folderName,
      })
    }
  }
  return (
    <>
      <Button
        onClick={() => handleUpload()}
        variant='outline'
        className='w-15 h-10'
      >
        Create folder
      </Button>
      <div className='flex flex-row'>
        {currentUserFolders &&
          currentUserFolders.map((folder, index) => (
            <Link to={folder} key={index}>
              <Button variant='light' className='flex h-10 p-2 text-black'>
                <span className='flex items-center gap-3'>
                  <img src='/svg/Folder.svg' alt='folder' className='h-5 w-5' />
                  <span>{folder}</span>
                </span>
              </Button>
            </Link>
          ))}
      </div>
    </>
  )
}

export default UserFolders
