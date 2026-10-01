import { useEffect, useState } from "react";
import { Marker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { useTranslation } from "react-i18next";

const GoogleMap = ({
  markerPosition,
  setMarkerPosition,
  isEditable = false, // renamed from onlyForShow
  onChangeMap,
  placeUrl,
}) => {
  const { t } = useTranslation();
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
    // Anywhere on the map, not only the pin -- nobody hunts for a 26px target
    // to find out where a place is.
    if (!isEditable) {
      openInGoogleMaps();
      return;
    }
    const lat = event.detail.latLng.lat;
    const lng = event.detail.latLng.lng;
    setPosition({ lat, lng });
    setMarkerPosition([lat, lng]);
    onChangeMap([lat, lng]);
  };

  // Tapping the pin hands the visitor over to Google Maps, where they can get
  // directions -- the embedded map cannot. Suppressed while editing, since
  // there the pin is being dragged to set a location, not followed.
  const openInGoogleMaps = () => {
    if (isEditable) return;
    // The listing when we have it: that opens Ken by name, with its photos and
    // a directions button. The coordinates only ever drop a nameless pin.
    window.open(
      placeUrl ||
        `https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`,
      "_blank",
      "noopener,noreferrer"
    );
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
      <div
        className={`h-[240px] w-full ${isEditable ? "" : "cursor-pointer"}`}
        title={isEditable ? undefined : t("open_in_google_maps")}
      >
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
            clickable={!isEditable}
            title={isEditable ? undefined : t("open_in_google_maps")}
            onClick={openInGoogleMaps}
          />
        </Map>
      </div>
    </APIProvider>
  );
};

export default GoogleMap;
