import { useFiles } from '@/hooks/useFiles'
import { UserModalButton } from '@components/UserButton/UserModalButton'
import { Button, FileButton } from '@mantine/core'
import { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  const { files, setFiles } = useFiles()

  return (
    <header className='flex justify-between border-b border-gray-100 px-7 py-4'>
      <Link to='/' className=' flex justify-center'>
        <img src='/svg/GribCloud.svg' alt='logo' />
      </Link>
      <div className='flex items-center gap-4'>
        <FileButton onChange={setFiles} accept='image/png,image/jpeg' multiple>
          {props => (
            <Button {...props} className='hover:bg-gray-100'>
              <span className='flex items-center gap-2 text-black'>
                <img
                  src='/svg/CloudArrowUp.svg'
                  alt='upload'
                  className='h-5 w-5'
                />
                Загрузить
              </span>
            </Button>
          )}
        </FileButton>
        <UserModalButton />
      </div>
    </header>
  )
}

export default Header
