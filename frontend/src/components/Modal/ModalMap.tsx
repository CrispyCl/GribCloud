import { Modal } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { FunctionComponent } from 'react'
import MapComponent from '../Map/Map'

interface ModalMapProps {
  openedMap: boolean
  closeMap: () => void
  latitude: number
  longitude: number
}

const ModalMap: FunctionComponent<ModalMapProps> = ({
  openedMap,
  closeMap,
  latitude,
  longitude,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return (
    <Modal
      fullScreen={isMobile}
      size='80%'
      opened={openedMap}
      onClose={closeMap}
    >
      <MapComponent center={[longitude, latitude]} />
    </Modal>
  )
}

export default ModalMap
