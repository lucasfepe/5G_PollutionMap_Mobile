import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { HEATMAP_COLORS } from "./constants";

interface LegendProps {
    maxValue: number;
    unit: string;
}

const Legend: React.FC<LegendProps> = ({ maxValue, unit }) => {
    return (
        <View style={styles.legend}>
            <View style={styles.legendContent}>
                <LinearGradient
                    colors={HEATMAP_COLORS.HEATMAP_GRADIENT_COLORS_ONLY.map(({ stop, color }) => color)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBar}
                >
                    <Text style={[styles.indicator, styles.indicatorLeft]}>0</Text>
                    <Text style={[styles.indicator, styles.indicatorQuarter]}>
                        {(maxValue * 0.25).toFixed(2)}
                    </Text>
                    <Text style={[styles.indicator, styles.indicatorMid]}>
                        {(maxValue / 2).toFixed(2)}
                    </Text>
                    <Text style={[styles.indicator, styles.indicatorThreeQuarters]}>
                        {(maxValue * 0.75).toFixed(2)}
                    </Text>
                    <Text style={[styles.indicator, styles.indicatorRight]}>
                        {maxValue.toFixed(2)}
                    </Text>
                </LinearGradient>
                <Text style={styles.units}>Units: {unit}</Text>
                <View style={styles.legendExplanation}>
                    <View style={styles.legendItem}>
                        <View style={styles.circleIndicator} />
                        <Text style={styles.legendText}>Real</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={styles.polygonIndicator} />
                        <Text style={styles.legendText}>Interpolated</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    legend: {
        position: "absolute",
        bottom: 10,
        left: 10,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        // textAlign: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5, // For Android shadow
        zIndex: 1,
        color: "#333",
        width: "90%",
        maxWidth: 200
    },
    legendContent: {
        flexDirection: "column",
        alignItems: "center",
        width: "90%",
        position: "relative",
        margin: "auto"
    },
    gradientBar: {
        position: "relative",
        height: 20,
        width: "100%",
        marginBottom: 15,
        borderRadius: 5
    },
    indicator: {
        position: "absolute",
        top: "100%",
        fontSize: 12,
        color: "#000",
        width: 40,
        textAlign: "center"
    },
    indicatorLeft: {
        left: 0,
        transform: [{ translateX: -20 }],
    },
    indicatorQuarter: {
        left: "25%",
        transform: [{ translateX: -20 }],
    },
    indicatorMid: {
        left: "50%",
        transform: [{ translateX: -20 }],
    },
    indicatorThreeQuarters: {
        left: "75%",
        transform: [{ translateX: -20 }],
    },
    indicatorRight: {
        left: "100%",
        transform: [{ translateX: -20 }],
    }
    ,
    units: {
        fontSize: 14,
        color: "gray",
        marginBottom: 5,
    },
    legendExplanation: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        // marginTop: 12,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    circleIndicator: {
        backgroundColor: "rgba(240, 59, 32, 0.6)",
        borderWidth: 2,
        borderColor: "black",
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 3,
    },
    polygonIndicator: {
        backgroundColor: "rgba(103, 169, 207, 0.6)",
        width: 10,
        height: 10,
        marginRight: 3,
        marginLeft: 9
    },
    legendText: {
        fontSize: 12,
        color: "#333",
    },
});

export default Legend;