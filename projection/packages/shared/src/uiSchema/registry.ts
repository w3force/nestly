import type { FieldGroup, ScreenDefinition } from './types';

export type SectionType = string;
export type CustomComponentId = string;

/**
 * Extract the schema-defined section type from a section's metadata.
 */
export function getSectionType(section: FieldGroup): SectionType | undefined {
  const metadata = section.metadata as Record<string, unknown> | undefined;
  const type = metadata?.type;
  return typeof type === 'string' ? type : undefined;
}

/**
 * Extract the custom component identifier from a section's metadata.
 */
export function getCustomComponentId(section: FieldGroup): CustomComponentId | undefined {
  const metadata = section.metadata as Record<string, unknown> | undefined;
  const componentId = metadata?.componentId;
  return typeof componentId === 'string' ? componentId : undefined;
}

export interface SectionRenderContext {
  screen: ScreenDefinition;
  section: FieldGroup;
  index: number;
  platform: 'web' | 'mobile';
}

export type SectionRenderer<T = unknown> = (context: SectionRenderContext) => T;

export interface CustomComponentRenderContext extends SectionRenderContext {
  componentId: CustomComponentId;
  metadata: Record<string, unknown>;
}

export type CustomComponentRenderer<T = unknown> = (context: CustomComponentRenderContext) => T;
