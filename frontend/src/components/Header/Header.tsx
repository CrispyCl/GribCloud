import { uploadAccept } from '@/constants'
import { Burger, Button, FileButton } from '@mantine/core'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { UserButton } from './UserButton'

interface HeaderProps {
  setFiles?: React.Dispatch<React.SetStateAction<File[]>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Header: FunctionComponent<HeaderProps> = ({ setFiles, setOpen }) => {
  console.log(uploadAccept.map(item => item).join(','))
  return (
    <header className='flex items-center justify-between border-b border-gray-100 px-7 py-4'>
      <Link to='/' className='self-center'>
        <img src='/svg/GribCloud.svg' alt='logo' />
      </Link>
      <Burger className='md:hidden' onClick={() => setOpen(true)} />
      <div className='hidden items-center gap-4 md:flex'>
        <FileButton
          onChange={setFiles ? setFiles : () => {}}
          accept={`${uploadAccept.map(item => item).join(',')}`}
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
