/**
 * UI Schema utilities
 * Helpers to safely access screen and field definitions with platform awareness.
 */

import { FIELD_DEFINITIONS } from './inputFields';
import { SCREEN_DEFINITIONS } from './screens';
import { FieldGroup, InputFieldDefinition, ScreenDefinition } from './types';

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
