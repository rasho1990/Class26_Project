import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import useHttpRequest from '../../hooks/http-hook';
import './Map.css';

const Map = ({ center, zoom, style, className }) => {
  const mapContainerRef = useRef(null);
  const [poiPlaces, setPoiPlaces] = useState([]);
  const [address, setAddress] = useState('');
  const { sendRequest } = useHttpRequest();
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

  useEffect(() => {
    const fetchPoiData = async () => {
      try {
        const poiData = await sendRequest(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${center.lng}%2C${center.lat}.json?access_token=${mapboxgl.accessToken}&autocomplete=false&types=poi&limit=200`
        );
        setPoiPlaces(poiData.features);
      } catch (err) {
        console.log('Could not get poi places!', err);
        return [];
      }
    };

    const fetchAddress = async () => {
      try {
        const addressData = await sendRequest(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${center.lng},${center.lat}.json?access_token=${mapboxgl.accessToken}`
        );

        setAddress(addressData.features[0]);
      } catch (err) {
        console.log('Could not get poi places!', err);
        return [];
      }
    };
    fetchPoiData();
    fetchAddress();
  }, [sendRequest, center]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [center.lng, center.lat],
      zoom,
    });

    new mapboxgl.Marker().setLngLat(center).addTo(map);
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    map.on('load', function () {
      map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        function (error, image) {
          if (error) throw error;
          map.addImage('custom-marker', image);
          map.addSource('places', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                ...poiPlaces.map((item) => {
                  return {
                    type: 'Feature',
                    properties: {
                      description: `<strong>${item.text}</strong><p>${item.place_name}</p>`,
                    },
                    geometry: {
                      type: 'Point',
                      coordinates: [item.center[0], item.center[1]],
                    },
                  };
                }),
              ],
            },
          });

          map.addLayer({
            id: 'places',
            type: 'symbol',
            source: 'places',
            layout: {
              'icon-image': 'custom-marker',
              'icon-allow-overlap': true,
              'icon-size': 0.8,
            },
          });
        }
      );

      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on('mouseenter', 'places', function (e) {
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates).setHTML(description).addTo(map);
      });

      map.on('mouseleave', 'places', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });
  }, [center, zoom, poiPlaces]);

  return (
    <React.Fragment>
      <div
        className={`map ${className}`}
        ref={mapContainerRef}
        style={style}
      ></div>
      <h5 style={{ marginLeft: '1rem', marginRight: '10rem' }}>
        Address: {address.place_name}
      </h5>
    </React.Fragment>
  );
};

export default Map;
