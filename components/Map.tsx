import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
// We need to use require for MarkerClusterGroup due to how it's exported
// @ts-ignore
const MarkerClusterGroupComponent =
  require("react-leaflet-markercluster").default;

// Fix Leaflet icon issue
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

interface MapWithClustersProps {
  userLocations: [number, number][];
  center?: [number, number];
  zoom?: number;
}

const MapWithClusters = ({
  userLocations,
  center = [8.5, -11.5],
  zoom = 8,
}: MapWithClustersProps) => {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  return (
    <div className="w-full h-screen max-h-[600px] sm:h-[400px] lg:h-[500px] rounded-lg shadow-md overflow-hidden">
      <MapContainer center={center} zoom={zoom} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroupComponent>
          {userLocations.map((location, index) => (
            <Marker key={index} position={location} />
          ))}
        </MarkerClusterGroupComponent>
      </MapContainer>
    </div>
  );
};

export default MapWithClusters;
