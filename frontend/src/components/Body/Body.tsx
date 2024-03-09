import { RootState } from '@/redux/store'
import { DropZone } from '@components/Dropzone/Dropzone'
import BodyHeader from '@components/Header/BodyHeader'
import Header from '@components/Header/Header'
import SideNavigation from '@components/SideNavigation/SideNavigation'
import React, { FunctionComponent, useState } from 'react'
import { useSelector } from 'react-redux'
import SideNavigationMobile from '../SideNavigation/SideNavigationMobile'

interface BodyProps {
  children: React.ReactNode
  setFiles?: React.Dispatch<React.SetStateAction<File[]>>
}

const Body: FunctionComponent<BodyProps> = ({ children, setFiles }) => {
  const [open, setOpen] = useState<boolean>(false)
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const avatar = useSelector((state: RootState) => state.auth.avatar)
  return (
    <>
      <DropZone />
      <Header setOpen={setOpen} setFiles={setFiles} />
      <div className='flex h-[calc(100vh-5rem)] flex-row'>
        <SideNavigationMobile
          open={open}
          setOpen={setOpen}
          currentUser={currentUser}
          avatar={avatar}
        />
        <SideNavigation />
        <div className='w-full overflow-y-auto'>
          <BodyHeader />
          {children}
        </div>
      </div>
    </>
  )
}

export default Body
