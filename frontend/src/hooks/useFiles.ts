import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import { listAll, ref, uploadBytes } from 'firebase/storage'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export function useFiles() {
  const [files, setFiles] = useState<File[]>([])
  const user = useSelector((state: RootState) => state.auth.account)
  files?.forEach(file => {
    const imgRef = ref(imgStorage, `images/${user?.id}/${file.name}`)
    uploadBytes(imgRef, file as Blob)
    listAll(ref(imgStorage, 'images')).then(res => {
      res.prefixes.map(prefix => {
        if (user?.id !== undefined) {
          if (prefix.name.startsWith(user.id)) {
            console.log(prefix.fullPath + `/${file.name}`)
          }
        }
      })
    })
  })
  return { files, setFiles }
}
