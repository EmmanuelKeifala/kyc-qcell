import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

const MapWithClusters = ({
  userLocations,
}: {
  userLocations: L.LatLngExpression[];
}) => {
  return (
    <div className="map-container w-full h-screen max-h-[600px] sm:h-[400px] lg:h-[500px] rounded-lg shadow-md overflow-hidden">
      <MapContainer
        center={[8.5, -11.5]}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup as={MarkerClusterGroup as any}>
          {userLocations.map((location, index) => (
            <Marker key={index} position={location} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapWithClusters;
