import { UserModalButton } from '@components/UserButton/UserModalButton'
import { Button, FileButton } from '@mantine/core'
import { FunctionComponent, useState } from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  const [file, setFile] = useState<File | null>(null)
  // console.log(file)

  return (
    <header className='flex justify-between border-b border-gray-100 px-7 py-4'>
      <Link to='/' className=' flex justify-center'>
        <img src='/svg/GribCloud.svg' alt='logo' />
      </Link>
      <div className='flex items-center gap-4'>
        <FileButton onChange={setFile} accept='image/png,image/jpeg'>
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

{
  /* <div className='flex gap-4'>
          <Button className='border-blue-500 text-blue-500 hover:border-blue-600 hover:bg-blue-600 hover:text-white'>
            Sing In
          </Button>
          <Button className='bg-blue-500 text-white hover:bg-blue-600'>
            Sing Up
          </Button>
        </div> */
}
