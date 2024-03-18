import { RootState } from '@/redux/store'
import { DropZone } from '@components/Dropzone/Dropzone'
import Header from '@components/Header/Header'
import SideNavigation from '@components/SideNavigation/SideNavigation'
import { LoadingOverlay } from '@mantine/core'
import React, { FunctionComponent, useState } from 'react'
import { useSelector } from 'react-redux'
import SideNavigationMobile from '../SideNavigation/SideNavigationMobile'

interface BodyProps {
  children: React.ReactNode
  loading: boolean
}

const Body: FunctionComponent<BodyProps> = ({ children, loading }) => {
  const [open, setOpen] = useState<boolean>(false)
  const currentUser = useSelector((state: RootState) => state.auth.account)
  const avatar = useSelector((state: RootState) => state.auth.avatar)
  return (
    <>
      <DropZone />
      <Header setOpen={setOpen} />
      <div className='flex h-[calc(100vh-5rem)] flex-row'>
        {currentUser && <SideNavigation />}
        <SideNavigationMobile
          open={open}
          setOpen={setOpen}
          currentUser={currentUser}
          avatar={avatar}
        />
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <div className='relative w-full overflow-y-auto'>{children}</div>
      </div>
    </>
  )
}

export default Body
