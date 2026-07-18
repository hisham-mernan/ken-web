import { useEffect, useState } from "react";
import { Marker, APIProvider, Map } from "@vis.gl/react-google-maps";

const GoogleMap = ({
  markerPosition,
  setMarkerPosition,
  isEditable = false, // renamed from onlyForShow
  onChangeMap,
}) => {
  const [position, setPosition] = useState(
    markerPosition
      ? { lat: markerPosition[0], lng: markerPosition[1] }
      : { lat: 23.8859, lng: 45.0792 } // default: Saudi Arabia
  );

  useEffect(() => {
    if (markerPosition) {
      setPosition({ lat: markerPosition[0], lng: markerPosition[1] });
    }
  }, [markerPosition]);

  const handleMapClick = (event) => {
    if (!isEditable) return;
    const lat = event.detail.latLng.lat;
    const lng = event.detail.latLng.lng;
    setPosition({ lat, lng });
    setMarkerPosition([lat, lng]);
    onChangeMap([lat, lng]);
  };

  const handleMapDrag = (event) => {
    if (!isEditable) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setPosition({ lat, lng });
    setMarkerPosition([lat, lng]);
    onChangeMap([lat, lng]);
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_REACT_GOOGLE_MAP}>
      <div className="h-[240px] w-full">
        <Map
          defaultCenter={position}
          defaultZoom={9}
          gestureHandling="greedy"
          onClick={handleMapClick}
        >
          <Marker
            position={position}
            draggable={isEditable}
            onDragEnd={handleMapDrag}
          />
        </Map>
      </div>
    </APIProvider>
  );
};

export default GoogleMap;
