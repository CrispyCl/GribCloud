import { UserModalButton } from '@components/UserButton/UserModalButton'
import { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  return (
    <header className='flex justify-between border-b border-gray-100 px-7 py-4'>
      <Link to='/' className=' flex justify-center'>
        <img src='/svg/GribCloud.svg' alt='logo' />
      </Link>

      <UserModalButton />
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
