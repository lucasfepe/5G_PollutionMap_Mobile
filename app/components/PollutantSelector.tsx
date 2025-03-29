import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface PollutantSelectorProps {
    selectedPollutant: string;
    onChange: (pollutant: string) => void;
}

const PollutantSelector: React.FC<PollutantSelectorProps> = ({
    selectedPollutant,
    onChange,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select Pollutant:</Text>
            <Picker
                selectedValue={selectedPollutant}
                onValueChange={(itemValue) => onChange(itemValue)}
                style={styles.dropdown}
            >
                <Picker.Item label="PM0.3 Count" value="pm03 count" />
                <Picker.Item label="PM0.3" value="pm03" />
                <Picker.Item label="PM1" value="pm1" />
                <Picker.Item label="PM2.5" value="pm25" />
                <Picker.Item label="PM10" value="pm10" />
                <Picker.Item label="NO2" value="no2" />
                <Picker.Item label="NO" value="no" />
                <Picker.Item label="O3" value="o3" />
                <Picker.Item label="CO" value="co" />
                <Picker.Item label="RH" value="rh" />
                <Picker.Item label="Temperature" value="Temperature (C)" />
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10, // Matches `.selector-container`
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    label: {
        marginRight: 5, // Matches `.selector-label`
        fontSize: 16,
        marginBottom: 5,
        color: "#333",
    },
    dropdown: {
        padding: 5, // Matches `.selector-dropdown`
        fontSize: 14,
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#f9f9f9",
    },
});

export default PollutantSelector;