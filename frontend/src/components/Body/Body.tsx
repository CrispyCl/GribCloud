import { DropZone } from '@components/Dropzone/Dropzone'
import BodyHeader from '@components/Header/BodyHeader'
import Header from '@components/Header/Header'
import SideNavigation from '@components/SideNavigation/SideNavigation'
import React, { FunctionComponent } from 'react'

interface BodyProps {
  children: React.ReactNode
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
}

const Body: FunctionComponent<BodyProps> = ({ children, setFiles }) => {
  return (
    <>
      <DropZone />
      <Header setFiles={setFiles} />
      <div className='flex h-[calc(100vh-5rem)] flex-row'>
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
