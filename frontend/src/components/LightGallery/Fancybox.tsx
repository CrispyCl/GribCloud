import React, { FunctionComponent, useEffect, useRef } from 'react'

import { Fancybox as NativeFancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

interface Fancybox {
  children: React.ReactNode
  setUrl: React.Dispatch<React.SetStateAction<string | undefined>>
  setName: React.Dispatch<React.SetStateAction<string | undefined>>
  open: () => void
}

const Fancybox: FunctionComponent<Fancybox> = ({
  children,
  setUrl,
  setName,
  open,
}) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const delegate = '[data-fancybox]'
    const options = {
      Carousel: {
        infinite: false,
      },
      Toolbar: {
        items: {
          edit: {
            tpl: '<button data-fancybox-download data-fancybox-id id="javascript:;" href="javascript:;" class="f-button" type="button" title="Edit">✎</button>',
            click: () => {
              const current = NativeFancybox.getSlide()
              setUrl(current?.src as string)
              setName(current?.triggerEl?.id as string)
              open()
            },
          },
        },
        display: {
          left: ['infobar'],
          middle: [
            'zoomIn',
            'zoomOut',
            'toggle1to1',
            'rotateCCW',
            'rotateCW',
            'flipX',
            'flipY',
          ],
          right: ['edit', 'download', 'thumbs', 'close'],
        },
      },
    }
    // @ts-ignore
    NativeFancybox.bind(container, delegate, options)

    return () => {
      NativeFancybox.unbind(container)
      NativeFancybox.close()
    }
  })

  return <div ref={containerRef}>{children}</div>
}

export default Fancybox
