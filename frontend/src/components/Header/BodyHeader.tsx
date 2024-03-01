import { useLocation } from 'react-router-dom'

const BodyHeader = () => {
  const title = useLocation().pathname.split('/')[1]
  return (
    <>
      <header className='flex items-center justify-between border-b border-gray-100 p-5'>
        <div>{title}</div>
      </header>
    </>
  )
}

export default BodyHeader