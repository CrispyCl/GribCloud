import { RootState } from '@/redux/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export function useFiles() {
  const [files, setFiles] = useState<File[]>([])
  const [userImgList, setUserImgList] = useState<string[]>([])
  const user = useSelector((state: RootState) => state.auth.account)

  return { user, userImgList, setUserImgList, files, setFiles }
}
