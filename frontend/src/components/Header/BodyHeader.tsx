import { imgStorage } from '@/firebase/config'
import { useFiles } from '@/hooks/useFiles'
import { Button, FileButton } from '@mantine/core'
import { getDownloadURL, listAll, ref } from 'firebase/storage'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BodyHeader = () => {
  const title = useLocation().pathname.split('/')[1]
  const { user, userImgList, setUserImgList, files, setFiles } = useFiles()
  useEffect(() => {
    listAll(ref(imgStorage, `images/${user?.id}/`)).then(res => {
      res.items.forEach(item => {
        getDownloadURL(item).then(url => {
          setUserImgList(prev => [...prev, url])
        })
      })
    })
  }, [])

  return (
    <>
      <header className='flex items-center justify-between border-b border-gray-100 p-5'>
        <div>{title}</div>
        <FileButton onChange={setFiles} multiple>
          {props => (
            <Button {...props} className='hover:bg-gray-100'>
              <span className='flex items-center gap-2 text-black'>
                <img
                  src='/svg/CloudArrowUp.svg'
                  alt='upload'
                  className='h-5 w-5'
                />
                Загрузить
              </span>
            </Button>
          )}
        </FileButton>
      </header>
      {userImgList.map((url, i) => {
        return <img src={url} key={i} />
      })}
    </>
  )
}

export default BodyHeader
