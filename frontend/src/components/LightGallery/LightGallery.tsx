import lgHash from 'lightgallery/plugins/hash'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgVideo from 'lightgallery/plugins/video'
import lgZoom from 'lightgallery/plugins/zoom'
import LightGallery from 'lightgallery/react'
import React, { FunctionComponent } from 'react'
// import styles
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-video.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lightgallery.css'

interface LightGalleryProps {
  children?: React.ReactNode
}

const LightGalleryComponent: FunctionComponent<LightGalleryProps> = props => {
  return (
    <LightGallery
      plugins={[lgThumbnail, lgZoom, lgHash, lgVideo]}
      elementClassNames='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-4'
      speed={500}
      hash={true}
    >
      {props.children}
    </LightGallery>
  )
}

export default LightGalleryComponent
