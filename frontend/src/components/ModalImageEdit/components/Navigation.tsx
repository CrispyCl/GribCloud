import cn from 'classnames'
import { FC } from 'react'
import { Button } from './Button'
import './Navigation.scss'

interface Props {
  className?: string
  mode?: string
  onChange?: (mode: string) => void
}

export const Navigation: FC<Props> = ({ className, onChange, mode }) => {
  const setMode = (mode: string) => () => {
    onChange?.(mode)
  }

  return (
    <div className={cn('image-editor-navigation', className)}>
      <div className='image-editor-navigation__buttons'>
        <Button
          className={'image-editor-navigation__button'}
          active={mode === 'crop'}
          onClick={setMode('crop')}
        >
          <div>crop</div>
        </Button>
        <Button
          className={'image-editor-navigation__button'}
          active={mode === 'saturation'}
          onClick={setMode('saturation')}
        >
          <div>saturation</div>
        </Button>
        <Button
          className={'image-editor-navigation__button'}
          active={mode === 'brightness'}
          onClick={setMode('brightness')}
        >
          <div>brightness</div>
        </Button>
        <Button
          className={'image-editor-navigation__button'}
          active={mode === 'contrast'}
          onClick={setMode('contrast')}
        >
          <div>Contrast</div>
        </Button>
        <Button
          className={'image-editor-navigation__button'}
          active={mode === 'hue'}
          onClick={setMode('hue')}
        >
          <div>hue</div>
        </Button>
      </div>
    </div>
  )
}
