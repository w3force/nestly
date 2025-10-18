/**
 * SliderField Component (Mobile - React Native)
 * Renders a slider input with schema-driven styling, colors, and range indicators
 * Consumes configuration from DETERMINISTIC_SCREEN.platformVariants.mobile.sliderDefaults
 * and section-level metadata.sliderStyle
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { InputFieldDefinition } from '@projection/shared';

interface SliderFieldProps {
  /** Field definition containing min, max, step, default */
  field: InputFieldDefinition;
  /** Current value */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Slider styling from section metadata */
  sliderStyle?: {
    showRangeIndicator?: boolean;
    rangeIndicatorType?: 'compact' | 'full' | 'minimal';
    showValue?: boolean;
    showMin?: boolean;
    showMax?: boolean;
    displayFormat?: 'inline' | 'tooltip' | 'below';
    trackColor?: {
      filled?: string;
      empty?: string;
    };
    thumbStyle?: {
      size?: 'small' | 'medium' | 'large';
      color?: string;
      showLabel?: boolean;
    };
  };
  /** Platform defaults from mobile variant */
  platformDefaults?: {
    heightPixels?: number;
    thumbSize?: number;
    trackHeight?: number;
  };
  /** Global theme configuration */
  theme?: {
    light?: {
      trackFilledColor?: string;
      trackEmptyColor?: string;
      thumbColor?: string;
      thumbBorderColor?: string;
      thumbBorderWidth?: number;
      textColor?: string;
    };
  };
}

/**
 * Map thumb size string to pixels
 */
const getThumbSizePixels = (size?: 'small' | 'medium' | 'large', platformDefault?: number): number => {
  const sizeMap = {
    small: 24,
    medium: 28,
    large: 32,
  };
  return sizeMap[size || 'medium'] || platformDefault || 28;
};

/**
 * Map container height to pixels
 */
const getContainerHeightPixels = (platformHeightPixels?: number): number => {
  return platformHeightPixels || 64;
};

export const SliderField: React.FC<SliderFieldProps> = ({
  field,
  value,
  onChange,
  sliderStyle,
  platformDefaults,
  theme,
}) => {
  // Merge defaults: global theme < platform defaults < section-level styling
  const mergedTrackColor = {
    filled: sliderStyle?.trackColor?.filled || theme?.light?.trackFilledColor || '#69B47A',
    empty: sliderStyle?.trackColor?.empty || theme?.light?.trackEmptyColor || 'rgba(105, 180, 122, 0.2)',
  };

  const mergedThumbColor = sliderStyle?.thumbStyle?.color || theme?.light?.thumbColor || '#69B47A';
  const mergedTextColor = theme?.light?.textColor || '#30403A';

  const thumbSizePixels = getThumbSizePixels(sliderStyle?.thumbStyle?.size, platformDefaults?.thumbSize);
  const containerHeightPixels = getContainerHeightPixels(platformDefaults?.heightPixels);
  const trackHeightPixels = platformDefaults?.trackHeight || 10;

  // Extract constraints from field definition
  const min = (field as any)?.constraints?.min ?? 0;
  const max = (field as any)?.constraints?.max ?? 100;
  const step = (field as any)?.constraints?.step ?? 1;

  // Determine display format
  const displayFormat = sliderStyle?.displayFormat || 'below';
  const showRangeIndicator = sliderStyle?.showRangeIndicator !== false;
  const rangeIndicatorType = sliderStyle?.rangeIndicatorType || 'full';
  const showValue = sliderStyle?.showValue !== false;
  const showMin = sliderStyle?.showMin !== false;
  const showMax = sliderStyle?.showMax !== false;

  // Format value with currency or percentage
  const formatValue = (val: number) => {
    // Currency if field name contains 'balance', 'contribution', 'return', etc.
    const currencyFields = ['balance', 'contribution', 'return'];
    const isCurrency = currencyFields.some(term => field.id?.toLowerCase().includes(term));

    if (isCurrency) {
      return `$${Math.round(val).toLocaleString()}`;
    }

    // Percentage if field name contains 'rate', 'return', 'inflation'
    const percentFields = ['rate', 'return', 'inflation', 'expectedReturn'];
    const isPercent = percentFields.some(term => field.id?.toLowerCase().includes(term));

    if (isPercent) {
      return `${val.toFixed(2)}%`;
    }

    return Math.round(val).toString();
  };

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: 16,
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: mergedTextColor,
    },
    value: {
      fontSize: 14,
      fontWeight: '700',
      color: mergedThumbColor,
    },
    rangeIndicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
      paddingHorizontal: 2,
    },
    rangeIndicatorText: {
      fontSize: 12,
      color: 'rgba(48, 64, 58, 0.6)',
    },
    sliderContainer: {
      height: containerHeightPixels,
      justifyContent: 'center',
      paddingHorizontal: 0,
    },
    slider: {
      width: '100%',
      height: containerHeightPixels,
    },
    valueDisplayBelow: {
      marginTop: 8,
      alignItems: 'center',
    },
    valueDisplayText: {
      fontSize: 14,
      fontWeight: '700',
      color: mergedThumbColor,
    },
  });

  return (
    <View style={styles.container}>
      {/* Label and inline value */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>{field.label}</Text>
        {displayFormat !== 'inline' && showValue && (
          <Text style={styles.value}>{formatValue(value)}</Text>
        )}
      </View>

      {/* Range indicators */}
      {showRangeIndicator && (rangeIndicatorType === 'full' || rangeIndicatorType === 'compact') && (
        <View style={styles.rangeIndicatorContainer}>
          {showMin && <Text style={styles.rangeIndicatorText}>{formatValue(min)}</Text>}
          {rangeIndicatorType === 'full' && (
            <Text style={[styles.rangeIndicatorText, { textAlign: 'center', flex: 1 }]}>Range</Text>
          )}
          {showMax && <Text style={styles.rangeIndicatorText}>{formatValue(max)}</Text>}
        </View>
      )}

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor={mergedTrackColor.filled}
          maximumTrackTintColor={mergedTrackColor.empty}
          thumbTintColor={mergedThumbColor}
          accessible={true}
          accessibilityLabel={`${field.label} slider`}
          accessibilityValue={{
            min: min,
            max: max,
            now: value,
            text: `${formatValue(value)}`,
          }}
          accessibilityHint={`Adjust ${field.label} between ${formatValue(min)} and ${formatValue(max)}`}
        />
      </View>

      {/* Value display below */}
      {displayFormat === 'below' && showValue && (
        <View style={styles.valueDisplayBelow}>
          <Text style={styles.valueDisplayText}>
            {field.label}: {formatValue(value)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default SliderField;
