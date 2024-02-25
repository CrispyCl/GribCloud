import { useConvert } from '@/hooks/useConvert'
import { Button, FileButton } from '@mantine/core'
import { useLocation } from 'react-router-dom'

const BodyHeader = () => {
  const title = useLocation().pathname.split('/')[1]
  const { base64, files, setFiles } = useConvert()
  console.log(base64)
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
      {files.map((_, i) => {
        return <img key={i} src={base64} />
      })}
    </>
  )
}

export default BodyHeader
