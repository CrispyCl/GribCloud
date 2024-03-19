import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import { UserResponse } from '@/redux/types'
import { listAll, ref, uploadString } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface CreateFolderProps {
  parentFolder: string // Родительская папка
  folderName: string // Имя создаваемой папки
}

const useFolders = (user?: UserResponse, users?: UserResponse[]) => {
  const [currentUserFolders, setCurrentUserFolders] = useState<string[]>([])
  const [userFolders, setUserFolders] = useState<string[]>([])
  const currentUser = useSelector((state: RootState) => state.auth.account)

  //   fetching
  const fetchCurrentUserFolders = async () => {
    const storageRef = ref(imgStorage, `images/${currentUser?.id}/`)
    const listResult = await listAll(storageRef)
    const folders = listResult.prefixes.map(folderRef => folderRef.name)
    setCurrentUserFolders(folders.sort())
  }

  const fetchUserFolders = async (user: UserResponse | undefined) => {
    const storageRef = ref(imgStorage, `images/${user?.id}/`)
    const listResult = await listAll(storageRef)
    const folders = listResult.prefixes.map(folderRef => folderRef.name)
    setUserFolders(folders)
  }

  const createFolder = async ({
    parentFolder,
    folderName,
  }: CreateFolderProps) => {
    try {
      const storageRef = ref(
        imgStorage,
        `images/${currentUser?.id}/${parentFolder}/${folderName}/.folder`,
      )
      await uploadString(storageRef, JSON.stringify({ isFolder: true }))
    } catch (error) {
      console.error('Ошибка при создании папки:', (error as Error).message)
    }
  }

  useEffect(() => {
    fetchCurrentUserFolders()
    fetchUserFolders(user)
  }, [])

  return { currentUserFolders, userFolders, createFolder }
}

export default useFolders
