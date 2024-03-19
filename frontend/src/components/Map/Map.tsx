import React, { useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import { defaults as defaultControls, Zoom } from 'ol/control';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';



interface MapProps {
    center: [number, number];
}

const MapComponent: React.FC<MapProps> = ({ center }) => {
    useEffect(() => {
        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                new VectorLayer({
                    source: new VectorSource({
                        features: [new Feature({
                            geometry: new Point(fromLonLat(center)),
                            style: new Style({
                                    image: new Icon({
                                    anchor: [0.5, 1],
                                    src: 'https://openlayers.org/en/latest/examples/data/icon.png'
                                })
                            })
                        })
                    ]
                }),
                })],
                
            view: new View({
                center: fromLonLat([center[1], center[0]]), // Установка центра карты
                zoom: 11
            }),
            controls: defaultControls().extend([
                new Zoom(),
            ])
        });

        return () => map.setTarget(undefined); // Очистка карты при размонтировании компонента
    }, [center]);

    return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default MapComponent;