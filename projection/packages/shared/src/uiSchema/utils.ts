/**
 * UI Schema utilities
 * Helpers to safely access screen and field definitions with platform awareness.
 */

import { FIELD_DEFINITIONS } from './inputFields';
import { SCREEN_DEFINITIONS } from './screens';
import { PRIMARY_NAVIGATION } from './navigation';
import {
  FieldGroup,
  InputFieldDefinition,
  NavigationDefinition,
  ScreenDefinition,
  SliderMetadata,
  SliderMilestoneConfig,
  SliderRangeIndicatorConfig,
  SliderStateDisplay,
  SliderSuggestionConfig,
} from './types';

export type PlatformKey = 'web' | 'mobile';

/**
 * Return the screen definition for a given screen id.
 */
export function getScreenDefinition(screenId: string): ScreenDefinition {
  const screen = SCREEN_DEFINITIONS[screenId];
  if (!screen) {
    throw new Error(`Screen definition not found for id "${screenId}"`);
  }
  return screen;
}

/**
 * Return a field definition by id.
 */
export function getFieldDefinition(fieldId: string): InputFieldDefinition {
  const field = FIELD_DEFINITIONS[fieldId];
  if (!field) {
    throw new Error(`Field definition not found for id "${fieldId}"`);
  }
  return field;
}

export function getNavigationDefinition(navId: string = 'primary'): NavigationDefinition {
  if (navId === PRIMARY_NAVIGATION.id || navId === 'primary') {
    return PRIMARY_NAVIGATION;
  }
  throw new Error(`Navigation definition not found for id "${navId}"`);
}

/**
 * Merge platform-specific overrides into a cloned screen definition.
 * Does not mutate the original schema object.
 */
export function resolveScreenForPlatform(
  screen: ScreenDefinition,
  platform: PlatformKey,
): ScreenDefinition {
  const variant = screen.platformVariants?.[platform] ?? {};
  return {
    ...screen,
    metadata: {
      ...(screen.metadata ?? {}),
      ...(variant as Record<string, unknown>),
    },
  };
}

/**
 * Utility to expand field ids in sections into their concrete field definitions.
 */
export function getSectionFields(section: FieldGroup): string[] {
  return section.fields;
}

export interface SliderStateContext {
  value: number;
  formState?: Record<string, any>;
  dynamicMax?: number;
}

export interface ResolvedRangeIndicator {
  label: string;
  value: number;
}

export function getSliderMetadata(field: InputFieldDefinition): SliderMetadata | undefined {
  return field.metadata?.slider;
}

export function resolveSliderState(
  metadata: SliderMetadata | undefined,
  context: SliderStateContext,
): SliderStateDisplay | undefined {
  if (!metadata?.states || metadata.states.length === 0) {
    return undefined;
  }

  const { value, formState, dynamicMax } = context;
  const age = typeof formState?.age === 'number' ? formState.age : undefined;

  const matchesState = (state: SliderStateDisplay) => {
    const thresholds = state.thresholds ?? {};

    if (thresholds.aboveDynamicMax) {
      if (typeof dynamicMax === 'number') {
        return value > dynamicMax;
      }
      // Without dynamic max we can't evaluate this condition
      return false;
    }

    if (thresholds.minAge != null && (age == null || age < thresholds.minAge)) {
      return false;
    }

    if (thresholds.maxAge != null && (age == null || age > thresholds.maxAge)) {
      return false;
    }

    if (thresholds.min != null && value < thresholds.min) {
      return false;
    }

    if (thresholds.max != null && value > thresholds.max) {
      return false;
    }

    return true;
  };

  const matched = metadata.states.find(matchesState);
  if (matched) {
    return matched;
  }

  // As a safety net, return the last defined state which is typically the most permissive.
  return metadata.states[metadata.states.length - 1];
}

export function resolveSliderRangeIndicators(
  metadata: SliderMetadata | undefined,
  context: { formState?: Record<string, any> },
): ResolvedRangeIndicator[] {
  if (!metadata?.rangeIndicators) {
    return [];
  }

  const age = typeof context.formState?.age === 'number' ? context.formState.age : undefined;

  return metadata.rangeIndicators
    .filter((indicator: SliderRangeIndicatorConfig) => {
      if (indicator.minAge != null && (age == null || age < indicator.minAge)) {
        return false;
      }
      if (indicator.maxAge != null && (age == null || age > indicator.maxAge)) {
        return false;
      }
      return true;
    })
    .map(({ minAge, maxAge, ...rest }) => rest);
}

export function resolveSliderMilestones(metadata: SliderMetadata | undefined): SliderMilestoneConfig[] {
  return metadata?.milestones ?? [];
}

export function resolveSliderSuggestions(metadata: SliderMetadata | undefined): SliderSuggestionConfig[] {
  return metadata?.suggestions ?? [];
}
