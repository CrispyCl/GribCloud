import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export function useConvert() {
  const [convertFiles, setFiles] = useState<File[]>([])
  const [base64, setBase64] = useState<string>('')
  const [userImgList, setUserImgList] = useState<string[]>([])
  const user = useSelector((state: RootState) => state.auth.account)
  convertFiles?.forEach(file => {
    if (file.name !== undefined) {
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
        getDownloadURL(ref(imgStorage, res.ref.fullPath)).then(url => {
          setUserImgList(prev => [...prev, url])
        })
      })
    }
  })
  return { userImgList, convertFiles, setFiles }
}
