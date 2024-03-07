import { imgStorage } from '@/firebase/config'
import { actions } from '@/redux/slices/auth'
import { RootState } from '@/redux/store'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export function useAvatar() {
  const user = useSelector((state: RootState) => state.auth.account)
  const avatar = useSelector((state: RootState) => state.auth.avatar)
  const dispatch = useDispatch()
  const [file, setFile] = useState<File | null>(null)

  const uploadAvatar = async (file: File | null) => {
    if (file) {
      const storageRef = ref(imgStorage, `avatars/${user?.id}`)
      const uploadTask = uploadBytesResumable(storageRef, file)
      return uploadTask
        .then(() => getDownloadURL(storageRef))
        .then(url => {
          if (typeof url === 'string') {
            dispatch(actions.setAvatarUrl({ avatar: url }))
          }
        })
    }
  }
  useEffect(() => {
    const fetchExistingAvatar = async () => {
      const url = await getDownloadURL(ref(imgStorage, `avatars/${user?.id}`))
      dispatch(actions.setAvatarUrl({ avatar: url }))
    }
    uploadAvatar(file)
    fetchExistingAvatar()
  }, [file])
  return { avatar, setFile }
}
