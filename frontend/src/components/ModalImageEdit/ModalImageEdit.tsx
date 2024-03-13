import { imgStorage } from '@/firebase/config'
import { RootState } from '@/redux/store'
import { Modal } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import cn from 'classnames'
import { ref, uploadString } from 'firebase/storage'
import React, { FunctionComponent, useRef, useState } from 'react'
import {
  Cropper as CropperDesktop,
  CropperRef as CropperRefDesktop,
} from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css'
import {
  Cropper as CropperMobile,
  CropperRef as CropperRefMobile,
} from 'react-mobile-cropper'
import 'react-mobile-cropper/dist/style.css'
import { useSelector } from 'react-redux'
import { AdjustableCropperBackground } from './components/AdjustableCropperBackground'
import { BackgroundWrapperWithNotifications } from './components/BackgroundWrapperWithNotifications'
import { Button } from './components/Button'
import { Navigation } from './components/Navigation'
import { Slider } from './components/Slider'
import './styles.scss'

interface ModalImageEdit {
  url: string
  name: string
  close: () => void
  opened: boolean
  setKey: React.Dispatch<React.SetStateAction<number>>
}

export const ModalImageEdit: FunctionComponent<ModalImageEdit> = ({
  url,
  name,
  close,
  opened,
  setKey,
}) => {
  const user = useSelector((state: RootState) => state.auth.account)
  const cropperRefDesktop = useRef<CropperRefDesktop>(null)
  const cropperRefMobile = useRef<CropperRefMobile>(null)
  const [mode, setMode] = useState('crop')
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    hue: 0,
    saturation: 0,
    contrast: 0,
  })

  const onChangeValue = (value: number) => {
    if (mode in adjustments) {
      setAdjustments(previousValue => ({
        ...previousValue,
        [mode]: value,
      }))
    }
  }

  const onReset = () => {
    setMode('crop')
    setAdjustments({
      brightness: 0,
      hue: 0,
      saturation: 0,
      contrast: 0,
    })
  }

  const handleClose = () => {
    close()
    onReset()
  }
  const onDownload = () => {
    if (cropperRefDesktop.current) {
      const link = document.createElement('a')
      link.download = name
      if (cropperRefDesktop.current.getCanvas() !== null) {
        const canvas = cropperRefDesktop.current.getCanvas()
        if (canvas !== null) {
          link.href = canvas.toDataURL()
          uploadString(
            ref(imgStorage, `images/${user?.id}/${name}/`),
            link.href,
            'data_url',
          )
            .then(() => {
              close()
            })
            .then(() => {
              setKey(k => k + 1)
            })
        }
      }
    }
  }

  const changed = Object.values(adjustments).some(el => Math.floor(el * 100))
  const cropperEnabled = mode === 'crop'

  return (
    <Modal
      fullScreen={isMobile}
      size='80%'
      opened={opened}
      onClose={handleClose}
      title={
        <div className=' text-xl font-semibold'>Редактирование изображения</div>
      }
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      centered
    >
      {isMobile ? (
        <div className='mobile'>
          <div className='mobile__cropper-wrapper'>
            <CropperMobile
              ref={cropperRefMobile}
              className='mobile__cropper'
              backgroundClassName='mobile__cropper-background'
              src={url}
            />
          </div>
        </div>
      ) : (
        <div className='image-editor'>
          <div className='image-editor__cropper'>
            <CropperDesktop
              src={url}
              ref={cropperRefDesktop}
              stencilProps={{
                movable: cropperEnabled,
                resizable: cropperEnabled,
                lines: cropperEnabled,
                handlers: cropperEnabled,
                overlayClassName: cn(
                  'image-editor__cropper-overlay',
                  !cropperEnabled && 'image-editor__cropper-overlay--faded',
                ),
              }}
              backgroundWrapperProps={{
                scaleImage: cropperEnabled,
                moveImage: cropperEnabled,
              }}
              backgroundComponent={AdjustableCropperBackground}
              backgroundProps={adjustments}
              backgroundWrapperComponent={BackgroundWrapperWithNotifications}
            />
            {mode !== 'crop' && (
              <Slider
                className='image-editor__slider'
                // @ts-ignore
                value={adjustments[mode]}
                onChange={onChangeValue}
              />
            )}
            <Button
              className={cn(
                'image-editor__reset-button',
                !changed && 'image-editor__reset-button--hidden',
              )}
              onClick={onReset}
            >
              reset
            </Button>
            <Button
              className={cn(
                'image-editor__reset-button',
                !changed && 'image-editor__reset-button--hidden',
              )}
              onClick={onDownload}
            >
              <div>download</div>
            </Button>
          </div>
          <Navigation mode={mode} onChange={setMode} />
        </div>
      )}
    </Modal>
  )
}

export default ModalImageEdit
