import { defaults as defaultControls, Zoom } from 'ol/control'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import Map from 'ol/Map'
import 'ol/ol.css'
import { fromLonLat } from 'ol/proj'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import Icon from 'ol/style/Icon'
import Style from 'ol/style/Style'
import View from 'ol/View'
import React, { useEffect } from 'react'

interface MapProps {
  center: [number, number]
}

const MapComponent: React.FC<MapProps> = ({ center }) => {
  const marker = new Feature({
    geometry: new Point(fromLonLat(center)),
  })
  marker.setStyle(
    new Style({
      image: new Icon({
        crossOrigin: 'anonymous',
        src: 'svg/MapPoint.svg',
        scale: 0.05,
      }),
    }),
  )
  useEffect(() => {
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [marker],
          }),
        }),
      ],

      view: new View({
        center: fromLonLat(center), // Установка центра карты
        zoom: 16,
      }),
      controls: defaultControls().extend([new Zoom()]),
    })

    return () => map.setTarget(undefined) // Очистка карты при размонтировании компонента
  }, [center])

  return <div id='map' style={{ width: '100%', height: '700px' }}></div>
}

export default MapComponent
