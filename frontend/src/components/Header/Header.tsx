import { Button, FileButton } from '@mantine/core'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { UserButton } from './UserButton'

interface HeaderProps {
  setFiles?: React.Dispatch<React.SetStateAction<File[]>>
}

const Header: FunctionComponent<HeaderProps> = ({ setFiles }) => {
  return (
    <header className='flex justify-between border-b border-gray-100 px-7 py-4'>
      <Link to='/' className=' flex justify-center'>
        <img src='/svg/GribCloud.svg' alt='logo' />
      </Link>
      <div className='flex items-center gap-4'>
        <FileButton
          onChange={setFiles ? setFiles : () => {}}
          accept='image/png,image/jpeg'
          multiple
        >
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
        <UserButton />
      </div>
    </header>
  )
}

export default Header
