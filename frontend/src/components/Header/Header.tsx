import { RootState } from '@/redux/store'
import { Burger, Button } from '@mantine/core'
import React, { FunctionComponent } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { UserButton } from './UserButton'

interface HeaderProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Header: FunctionComponent<HeaderProps> = ({ setOpen }) => {
  const currentUser = useSelector((state: RootState) => state.auth.account)
  return (
    <header className='flex items-center justify-between border-b border-gray-100 px-7 py-4'>
      <Link to={currentUser ? '/all' : '/groupalbums'} className='self-center'>
        <img src='/svg/GribCloud.svg' alt='logo' />
      </Link>
      <Burger className='md:hidden' onClick={() => setOpen(true)} />
      {currentUser ? (
        <div className='hidden items-center gap-4 md:flex'>
          <UserButton />
        </div>
      ) : (
        <div className='hidden items-center gap-4 md:flex'>
          {window.location.pathname === '/singin' ||
          window.location.pathname === '/singup' ? null : (
            <>
              <Link to='/singin'>
                <Button variant='light' className='w-20 p-2 text-black'>
                  Войти
                </Button>
              </Link>
              <Link to='/singup'>
                <Button variant='light' className='w-32 p-2 text-black'>
                  Регистрация
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
