import React, { useEffect, useState } from "react";
import MapboxGL from "@rnmapbox/maps";
import { View, StyleSheet } from "react-native";
import PollutantSelector from "./PollutantSelector";
import Legend from "./Legend";
import useHeatmapLayer from "./HeatmapLayer";
import { fetchPollution } from "../utils/fetchPollution";
import { PollutionDataPoint } from "../types";
import Constants from 'expo-constants';
import { HEATMAP_COLORS } from "./constants";


MapboxGL.setAccessToken(Constants?.expoConfig?.extra?.MAPBOX_PUBLIC_TOKEN || "");

const Map = () => {
    const [pollutionData, setPollutionData] = useState<PollutionDataPoint[]>([]);
    const [filteredPollutionData, setFilteredPollutionData] = useState<PollutionDataPoint[]>([]);
    const [selectedPollutant, setSelectedPollutant] = useState<string>("pm25");
    const [maxValue, setMaxValue] = useState<number>(0);
    const [geoJSON, setGeoJSON] = useState<GeoJSON.FeatureCollection | null>(null);

    // Fetch pollution data
    useEffect(() => {
        async function fetchData() {
            const data = await fetchPollution();
            setPollutionData(data);
        }
        fetchData();
    }, []);

    // Use the custom hook to process data
    useHeatmapLayer(pollutionData, selectedPollutant, setMaxValue, setGeoJSON, setFilteredPollutionData);

    return (
        <View style={styles.container}>
            <PollutantSelector
                selectedPollutant={selectedPollutant}
                onChange={setSelectedPollutant}
            />
            <MapboxGL.MapView style={styles.map}>
                <MapboxGL.Camera
                    zoomLevel={10}
                    centerCoordinate={[-114.0719, 51.0447]}
                />
                {geoJSON && (
                    <MapboxGL.ShapeSource id="pollution-data" shape={geoJSON}>
                        <MapboxGL.FillLayer
                            id="pollution-layer"
                            style={{
                                fillColor: [
                                    "interpolate",
                                    ["linear"],
                                    ["get", "value"],
                                    maxValue * HEATMAP_COLORS.HEATMAP_GRADIENT_COLORS_ONLY[0].stop,
                                    HEATMAP_COLORS.HEATMAP_GRADIENT_COLORS_ONLY[0].color,
                                    maxValue * HEATMAP_COLORS.HEATMAP_GRADIENT_COLORS_ONLY[1].stop,
                                    HEATMAP_COLORS.HEATMAP_GRADIENT_COLORS_ONLY[1].color,
                                    maxValue * HEATMAP_COLORS.HEATMAP_GRADIENT_COLORS_ONLY[2].stop,
                                    HEATMAP_COLORS.HEATMAP_GRADIENT_COLORS_ONLY[2].color,
                                    maxValue * HEATMAP_COLORS.HEATMAP_GRADIENT_COLORS_ONLY[3].stop,
                                    HEATMAP_COLORS.HEATMAP_GRADIENT_COLORS_ONLY[3].color,
                                    maxValue * HEATMAP_COLORS.HEATMAP_GRADIENT_COLORS_ONLY[4].stop,
                                    HEATMAP_COLORS.HEATMAP_GRADIENT_COLORS_ONLY[4].color,
                                ],
                                fillOpacity: HEATMAP_COLORS.OPACITY,
                            }}
                        />
                    </MapboxGL.ShapeSource>
                )}
                {filteredPollutionData
                    .filter(station => station.id !== null && station.id !== undefined)
                    .map((station, index) => {
                        // Calculate color based on value using the same interpolation as FillLayer
                        const getColor = (value: number) => {
                            if (value === 0) return HEATMAP_COLORS.HEATMAP_GRADIENT_COLORS_ONLY[0].color;

                            const ratio = value / maxValue;
                            if (ratio <= 0.25) {
                                // Interpolate between WHITE and LIGHT_BLUE
                                return `rgb(
                                    ${Math.round(HEATMAP_COLORS.RGB_VALUES.WHITE.r
                                    + (HEATMAP_COLORS.RGB_VALUES.LIGHT_BLUE.r
                                        - HEATMAP_COLORS.RGB_VALUES.WHITE.r)
                                    * (ratio / 0.25))},
                                    ${Math.round(HEATMAP_COLORS.RGB_VALUES.WHITE.g
                                        + (HEATMAP_COLORS.RGB_VALUES.LIGHT_BLUE.g
                                            - HEATMAP_COLORS.RGB_VALUES.WHITE.g)
                                        * (ratio / 0.25))},
                                    ${Math.round(HEATMAP_COLORS.RGB_VALUES.WHITE.b
                                            + (HEATMAP_COLORS.RGB_VALUES.LIGHT_BLUE.b
                                                - HEATMAP_COLORS.RGB_VALUES.WHITE.b)
                                            * (ratio / 0.25))
                                    })`;
                            } else if (ratio <= 0.5) {
                                // Interpolate between LIGHT_BLUE and YELLOW
                                const subRatio = (ratio - 0.25) / 0.25;
                                return `rgb(${Math.round(HEATMAP_COLORS.RGB_VALUES.LIGHT_BLUE.r + (HEATMAP_COLORS.RGB_VALUES.YELLOW.r - HEATMAP_COLORS.RGB_VALUES.LIGHT_BLUE.r) * subRatio)},${Math.round(HEATMAP_COLORS.RGB_VALUES.LIGHT_BLUE.g + (HEATMAP_COLORS.RGB_VALUES.YELLOW.g - HEATMAP_COLORS.RGB_VALUES.LIGHT_BLUE.g) * subRatio)},${Math.round(HEATMAP_COLORS.RGB_VALUES.LIGHT_BLUE.b + (HEATMAP_COLORS.RGB_VALUES.YELLOW.b - HEATMAP_COLORS.RGB_VALUES.LIGHT_BLUE.b) * subRatio)
                                    })`;
                            } else if (ratio <= 0.75) {
                                // Interpolate between YELLOW and ORANGE
                                const subRatio = (ratio - 0.5) / 0.25;
                                return `rgb(${Math.round(HEATMAP_COLORS.RGB_VALUES.YELLOW.r + (HEATMAP_COLORS.RGB_VALUES.ORANGE.r - HEATMAP_COLORS.RGB_VALUES.YELLOW.r) * subRatio)},${Math.round(HEATMAP_COLORS.RGB_VALUES.YELLOW.g + (HEATMAP_COLORS.RGB_VALUES.ORANGE.g - HEATMAP_COLORS.RGB_VALUES.YELLOW.g) * subRatio)},${Math.round(HEATMAP_COLORS.RGB_VALUES.YELLOW.b + (HEATMAP_COLORS.RGB_VALUES.ORANGE.b - HEATMAP_COLORS.RGB_VALUES.YELLOW.b) * subRatio)
                                    })`;
                            } else {
                                // Interpolate between ORANGE and RED
                                const subRatio = (ratio - 0.75) / 0.25;
                                return `rgb(${Math.round(HEATMAP_COLORS.RGB_VALUES.ORANGE.r + (HEATMAP_COLORS.RGB_VALUES.RED.r - HEATMAP_COLORS.RGB_VALUES.ORANGE.r) * subRatio)},${Math.round(HEATMAP_COLORS.RGB_VALUES.ORANGE.g + (HEATMAP_COLORS.RGB_VALUES.RED.g - HEATMAP_COLORS.RGB_VALUES.ORANGE.g) * subRatio)},${Math.round(HEATMAP_COLORS.RGB_VALUES.ORANGE.b + (HEATMAP_COLORS.RGB_VALUES.RED.b - HEATMAP_COLORS.RGB_VALUES.ORANGE.b) * subRatio)
                                    })`;
                            }
                        };


                        return (
                            <MapboxGL.PointAnnotation
                                key={`${station.id}-${index}`}
                                id={`${station.id}-${index}`}
                                coordinate={[station.lon, station.lat]}
                            >
                                <View style={[
                                    styles.annotation,
                                    {
                                        backgroundColor: getColor(station.value),
                                    }
                                ]} />
                            </MapboxGL.PointAnnotation>
                        );
                    })
                }
            </MapboxGL.MapView>
            <Legend
                maxValue={maxValue}
                unit={pollutionData[0]?.unit || ""}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    annotation: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'black',
    },
});

export default Map;