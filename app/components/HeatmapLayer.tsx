import { useEffect } from "react";
import * as turf from "@turf/turf"; // Turf.js for GeoJSON manipulation
import * as turfVoronoi from "@turf/voronoi"; // Import voronoi from @turf/voronoi
import { PollutionDataPoint } from "../types";


const useHeatmapLayer = (
    pollutionData: PollutionDataPoint[],
    selectedPollutant: string,
    setMaxValue: (value: number) => void,
    setGeoJSON: (geoJSON: GeoJSON.FeatureCollection) => void,
    setFilteredPollutionData: (data: PollutionDataPoint[]) => void
) => {
    useEffect(() => {
        if (pollutionData.length === 0) return;

        // Filter the data for the selected pollutant
        const filteredPollutionData = pollutionData.filter(
            (station) =>
                station.pollutant.toUpperCase().replace(".", "") ===
                selectedPollutant.toUpperCase() && station.value !== undefined
        );
        setFilteredPollutionData(filteredPollutionData);

        // Calculate the maximum value for the selected pollutant
        const max = Math.max(...filteredPollutionData.map((station) => station.value));
        setMaxValue(max);

        // Create GeoJSON points
        const pollutionGeoJSON: GeoJSON.FeatureCollection<GeoJSON.Point, GeoJSON.GeoJsonProperties> = {
            type: "FeatureCollection",
            features: filteredPollutionData.map((station) =>
                turf.point([station.lon, station.lat], { value: station.value })
            ),
        };

        // Define the bounding box for the Voronoi polygons
        const bbox = turf.bbox(pollutionGeoJSON) as [number, number, number, number];

        // Generate Voronoi polygons
        const voronoiPolygons = turfVoronoi.default(pollutionGeoJSON, { bbox });

        if (voronoiPolygons && voronoiPolygons.features) {
            // Assign pollution values to each Voronoi polygon
            voronoiPolygons.features.forEach((polygon, index) => {
                polygon.properties = {
                    value: pollutionGeoJSON.features[index]?.properties?.value || 0,
                };
            });

            // Pass the GeoJSON data to the parent component
            setGeoJSON(voronoiPolygons);
        }
    }, [pollutionData, selectedPollutant, setMaxValue, setGeoJSON]);
};

export default useHeatmapLayer;