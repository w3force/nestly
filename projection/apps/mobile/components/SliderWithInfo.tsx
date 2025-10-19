/**
 * SliderWithInfo Component
 * Reusable slider with contextual info box, status badge, and dynamic range indicators
 * 
 * Better UX: Shows milestone info inline below slider with smooth fade transitions
 * instead of popup that causes layout jumps
 */

import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import { Text, useTheme } from 'react-native-paper';

interface SliderWithInfoProps {
  title: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onValueChange: (value: number) => void;
  badge?: {
    label: string;
    color: string;
  };
  rangeIndicators?: {
    label: string;
    value: number;
  }[];
  infoBox?: {
    title: string;
    description: string;
    backgroundColor: string;
  };
  trackColor?: string;
  activeMarkerLabel?: string;
  activeMarkerDescription?: string;
  milestones?: Array<{
    value: number;
    label: string;
    description: string;
  }>;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  titleText: {
    fontWeight: '500',
    fontSize: 15,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  sliderContainer: {
    height: 50,
    justifyContent: 'center',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeIndicatorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rangeIndicator: {
    alignItems: 'center',
  },
  rangeIndicatorLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  // Info box wrapper - allows absolute positioning of milestone overlay
  infoBoxWrapper: {
    position: 'relative',
    minHeight: 68, // Fixed height for static content
  },
  // Fixed-height container to prevent jumping
  infoBoxContainer: {
    minHeight: 68, // Allocate space for 2-line description + title
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    justifyContent: 'center',
  },
  // Static info box that shows when no milestone is active
  staticInfoContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  // Milestone info - fades in/out smoothly, replaces static info
  milestoneInfoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(105, 180, 122, 0.12)',
    borderLeftWidth: 4,
    borderLeftColor: '#69B47A',
    justifyContent: 'center',
  },
  milestoneLabel: {
    fontWeight: '600',
    fontSize: 12,
    color: '#30403A',
    marginBottom: 3,
  },
  milestoneDescription: {
    fontSize: 11,
    color: '#60706A',
    lineHeight: 15,
  },
  infoBox: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  infoBoxTitle: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 4,
  },
  infoBoxDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  activeMarkerBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: 'rgba(105, 180, 122, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#69B47A',
    minHeight: 50,
  },
  activeMarkerLabel: {
    fontWeight: '600',
    fontSize: 13,
    color: '#30403A',
    marginBottom: 2,
  },
  activeMarkerDescription: {
    fontSize: 12,
    color: '#60706A',
    lineHeight: 16,
  },
});

export const SliderWithInfo: React.FC<SliderWithInfoProps> = ({
  title,
  value,
  min,
  max,
  step,
  suffix,
  onValueChange,
  badge,
  rangeIndicators = [],
  infoBox,
  trackColor = '#69B47A',
  activeMarkerLabel,
  activeMarkerDescription,
  milestones = [],
}) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  
  // Animated value for fade transition between static and milestone info
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Find closest milestone to current value for smooth inline display
  const closestMilestone = useMemo(() => {
    if (milestones.length === 0) return null;
    const proximity = 0.5; // How close value needs to be to show milestone
    return milestones.find((m) => Math.abs(m.value - value) <= proximity) || null;
  }, [value, milestones]);

  // Animate fade when milestone changes
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: closestMilestone ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [closestMilestone, fadeAnim]);

  return (
    <View style={styles.container}>
      {/* Header with title and badge */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>
            {title} {value.toFixed(value > 100 ? 0 : 1)}{suffix}
          </Text>
          {badge && (
            <View style={[styles.badge, { backgroundColor: badge.color }]}>
              <Text style={styles.badgeText}>{badge.label}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor={trackColor}
          maximumTrackTintColor="#E0E0E0"
        />
      </View>

      {/* Range indicators */}
      {rangeIndicators.length > 0 && (
        <View style={styles.rangeIndicatorsRow}>
          {rangeIndicators.map((indicator) => (
            <View key={indicator.label} style={styles.rangeIndicator}>
              <Text style={styles.rangeIndicatorLabel}>{indicator.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Info box with milestone overlay - milestone appears on top without pushing layout */}
      <View style={styles.infoBoxWrapper}>
        {/* Static info box background */}
        <View style={[styles.infoBoxContainer, infoBox ? { backgroundColor: infoBox.backgroundColor } : {}]} />

        {/* Static info - fades out when milestone appears */}
        <Animated.View style={[
          styles.staticInfoContent,
          infoBox ? { backgroundColor: infoBox.backgroundColor } : {},
          { opacity: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
        ]}>
          {infoBox && (
            <>
              <Text style={styles.infoBoxTitle}>{infoBox.title}</Text>
              <Text style={styles.infoBoxDescription}>{infoBox.description}</Text>
            </>
          )}
        </Animated.View>

        {/* Milestone overlay - fades in when milestone is active */}
        <Animated.View style={[
          styles.milestoneInfoContainer,
          { opacity: fadeAnim }
        ]}>
          <Text style={styles.milestoneLabel}>{closestMilestone?.label}</Text>
          <Text style={styles.milestoneDescription}>{closestMilestone?.description}</Text>
        </Animated.View>
      </View>
    </View>
  );
};
