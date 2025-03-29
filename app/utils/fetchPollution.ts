import AsyncStorage from '@react-native-async-storage/async-storage';
import { PollutionDataPoint } from "../types";


// Cache duration constants
const CACHE_DURATION = {
    ONE_MINUTE: 60 * 1000,
    ONE_HOUR: 60 * 60 * 1000,
    ONE_DAY: 24 * 60 * 60 * 1000,
    NEVER: Infinity,
} as const;

export async function fetchPollution(): Promise<PollutionDataPoint[]> {
    try {
        const cacheExpiration = CACHE_DURATION.ONE_DAY;

        // Check cached interpolated data
        try {
            const cachedInterpolatedData = await AsyncStorage.getItem('interpolatedPollutionData');
            if (cachedInterpolatedData) {
                const { data, timestamp } = JSON.parse(cachedInterpolatedData);
                const now = Date.now();

                if (now - timestamp < cacheExpiration) {
                    console.log('Using cached interpolated data');
                    return data;
                }
            }
        } catch (error) {
            console.warn('Error reading interpolated cache:', error);
        }

        // Check cached original data
        try {
            const cachedData = await AsyncStorage.getItem('pollutionData');
            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                const now = Date.now();

                if (now - timestamp < cacheExpiration) {
                    console.log('Using cached original data to generate interpolated data');
                    const interpolatedData = generateInterpolatedData(data);

                    await AsyncStorage.setItem(
                        'interpolatedPollutionData',
                        JSON.stringify({ data: interpolatedData, timestamp: Date.now() })
                    );

                    return interpolatedData;
                }
            }
        } catch (error) {
            console.warn('Error reading original data cache:', error);
        }

        // Fetch fresh data
        const response = await fetch("http://192.168.4.30:5000/api/pollution");
        if (!response.ok) {
            throw new Error("Failed to fetch pollution data");
        }

        const data = await response.json();
        const interpolatedData = generateInterpolatedData(data);

        // Save both original and interpolated data
        try {
            await AsyncStorage.setItem(
                'pollutionData',
                JSON.stringify({ data, timestamp: Date.now() })
            );
            await AsyncStorage.setItem(
                'interpolatedPollutionData',
                JSON.stringify({ data: interpolatedData, timestamp: Date.now() })
            );
        } catch (error) {
            console.warn('Error saving to cache:', error);
        }

        return interpolatedData;

    } catch (error) {
        console.error("Error fetching pollution data:", error);
        return [];
    }
}

function generateInterpolatedData(data: PollutionDataPoint[]): PollutionDataPoint[] {
    const interpolatedData: PollutionDataPoint[] = [];

    // Group data by unit and pollutant
    const groupedByUnitAndPollutant: Record<string, PollutionDataPoint[]> = data.reduce((groups, point) => {
        const key = `${point.unit}-${point.pollutant}`;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(point);
        return groups;
    }, {} as Record<string, PollutionDataPoint[]>);

    // Interpolate data for each group
    Object.keys(groupedByUnitAndPollutant).forEach((key) => {
        const groupData = groupedByUnitAndPollutant[key];

        for (let i = 0; i < groupData.length - 1; i++) {
            const currentPoint = groupData[i];
            const nextPoint = groupData[i + 1];

            // Add the current point
            interpolatedData.push(currentPoint);

            // Generate 9 interpolated points between current and next point
            for (let j = 1; j <= 9; j++) {
                const fraction = j / 10;
                const interpolatedPoint: PollutionDataPoint = {
                    name: `${currentPoint.name}-interpolated-${j}`,
                    lat: currentPoint.lat + fraction * (nextPoint.lat - currentPoint.lat),
                    lon: currentPoint.lon + fraction * (nextPoint.lon - currentPoint.lon),
                    pollutant: currentPoint.pollutant,
                    value: currentPoint.value + fraction * (nextPoint.value - currentPoint.value),
                    unit: currentPoint.unit,
                };
                interpolatedData.push(interpolatedPoint);
            }
        }

        // Add the last point of the group
        interpolatedData.push(groupData[groupData.length - 1]);
    });

    return interpolatedData;
}
