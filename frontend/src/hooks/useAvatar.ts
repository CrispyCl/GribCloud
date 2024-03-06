import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export function useAvatar() {
  const user = useSelector((state: RootState) => state.auth.account)
  const [avatar, setAvatar] = useState<string | undefined>(undefined)
  const [file, setFile] = useState<File | null>(null)

  const uploadAvatar = async (file: File | null) => {
    if (file) {
      const storageRef = ref(imgStorage, `avatars/${user?.id}`)
      const uploadTask = uploadBytesResumable(storageRef, file)
      return uploadTask
        .then(() => getDownloadURL(storageRef))
        .then(url => {
          if (typeof url === 'string') {
            setAvatar(url)
          }
        })
    }
  }
  useEffect(() => {
    const fetchExistingAvatar = async () => {
      const url = await getDownloadURL(ref(imgStorage, `avatars/${user?.id}`))
      setAvatar(url)
    }
    uploadAvatar(file)
    fetchExistingAvatar()
  }, [file])
  return { avatar, setFile }
}
