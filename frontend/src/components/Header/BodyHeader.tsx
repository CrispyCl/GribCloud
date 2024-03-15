import { uploadAccept } from '@/constants'
import { RootState } from '@/redux/store'
import { Button, FileButton } from '@mantine/core'
import { FunctionComponent } from 'react'
import { useSelector } from 'react-redux'

interface BodyHeaderProps {
  setFiles?: React.Dispatch<React.SetStateAction<File[]>>
}

const BodyHeader: FunctionComponent<BodyHeaderProps> = ({ setFiles }) => {
  const currentUser = useSelector((state: RootState) => state.auth.account)
  return (
    <>
      <header className='flex items-center justify-between border-b border-gray-100 p-5'>
        <span>title</span>
        {currentUser && (
          <FileButton
            onChange={setFiles ? setFiles : () => {}}
            accept={`${uploadAccept.map(item => item).join(',')}`}
            multiple
          >
            {props => (
              <Button
                variant='default'
                {...props}
                className='border-none hover:bg-gray-100'
                leftSection={
                  <img
                    src='/svg/CloudArrowUp.svg'
                    alt='upload'
                    className='h-5 w-5'
                  />
                }
              >
                Загрузить
              </Button>
            )}
          </FileButton>
        )}
      </header>
    </>
  )
}

export default BodyHeader
