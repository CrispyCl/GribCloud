import cn from 'classnames'
import { useState } from 'react'
import {
  CropperBackgroundWrapperProps,
  TransformableImage,
  TransformableImageEvent,
  isWheelEvent,
  useMoveImageOptions,
  useScaleImageOptions,
} from 'react-advanced-cropper'
import { useDebouncedCallback } from 'use-debounce'
import './BackgroundWrapperWithNotifications.scss'

export const BackgroundWrapperWithNotifications = ({
  cropper,
  scaleImage = true,
  moveImage = true,
  children,
  className,
  style,
}: CropperBackgroundWrapperProps) => {
  const moveImageOptions = useMoveImageOptions(moveImage)

  const scaleImageOptions = useScaleImageOptions(scaleImage)

  const transitions = cropper.getTransitions()

  const [notificationType, setNotificationType] = useState<string>('wheel')

  const [notificationVisible, setNotificationVisible] = useState(false)

  const debouncedHideNotification = useDebouncedCallback(() => {
    setNotificationVisible(false)
  }, 1500)

  const eventsHandler = (
    event: TransformableImageEvent,
    nativeEvent: Event,
  ) => {
    if (isWheelEvent(nativeEvent)) {
      if (!event.active && !nativeEvent.ctrlKey) {
        setNotificationVisible(true)
        setNotificationType('wheel')
        debouncedHideNotification()
        event.preventDefault()
      } else {
        setNotificationVisible(false)
      }
    }
    if (!event.defaultPrevented) {
      nativeEvent.preventDefault()
      nativeEvent.stopPropagation()
    }
  }

  return (
    <TransformableImage
      className={className}
      style={style}
      onTransform={cropper.transformImage}
      onTransformEnd={cropper.transformImageEnd}
      onEvent={eventsHandler}
      mouseMove={moveImageOptions.mouse}
      touchScale={scaleImageOptions.touch}
      disabled={transitions.active}
    >
      {children}
      <div
        className={cn(
          'cropper-event-notification',
          notificationVisible && 'cropper-event-notification--visible',
        )}
      >
        {notificationType === 'wheel' &&
          'Используйте ctrl + колесо мышки, чтобы увеличить/уменьшить изображение'}
      </div>
    </TransformableImage>
  )
}
