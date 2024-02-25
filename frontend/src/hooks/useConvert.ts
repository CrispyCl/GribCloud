import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export function useConvert() {
  const [files, setFiles] = useState<File[]>([])
  const [base64, setBase64] = useState<string>('')
  const user = useSelector((state: RootState) => state.auth.account)
  files?.forEach(file => {
    const toBase64 = (file: File) => {
      const reader = new FileReader()
      reader.onload = () => {
        setBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
    toBase64(file)
    const imgRef = ref(imgStorage, `images/${user?.id}/${file.name}`)
    uploadBytes(imgRef, file as Blob).then(res => {
      console.log(res)
      getDownloadURL(res.ref).then(url => {
        console.log(url)
      })
    })
    listAll(ref(imgStorage, 'images')).then(res => {
      res.prefixes.map(prefix => {
        console.log(prefix)
      })
    })
  })
  axios.get(base64).then(res => console.log(res))

  return { base64, files, setFiles }
}
