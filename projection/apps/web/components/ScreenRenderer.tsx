import React from "react";
import { Box, Stack } from "@mui/material";
import type {
  FieldGroup,
  ScreenDefinition,
} from "@projection/shared";
import {
  getCustomComponentId,
  getSectionType,
  SectionRenderContext,
} from "@projection/shared";

export type WebSectionRenderer = (context: SectionRenderContext) => React.ReactNode;

export interface CustomComponentRendererMap {
  [componentId: string]: (context: SectionRenderContext, metadata: Record<string, unknown>) => React.ReactNode;
}

export interface SectionRendererMap {
  [type: string]: WebSectionRenderer;
}

export interface ScreenRendererProps {
  screen: ScreenDefinition;
  sectionRenderers: SectionRendererMap;
  customComponentRenderers?: CustomComponentRendererMap;
  beforeSection?: (section: FieldGroup, index: number) => React.ReactNode;
  afterSection?: (section: FieldGroup, index: number) => React.ReactNode;
}

export const ScreenRenderer: React.FC<ScreenRendererProps> = ({
  screen,
  sectionRenderers,
  customComponentRenderers,
  beforeSection,
  afterSection,
}) => {
  return (
    <Stack spacing={4}>
      {screen.sections.map((section, index) => {
        const type = getSectionType(section);
        const customComponentId = getCustomComponentId(section);
        const metadata = (section.metadata as Record<string, unknown>) ?? {};

        const context: SectionRenderContext = {
          screen,
          section,
          index,
          platform: "web",
        };

        let content: React.ReactNode = null;
        if (type && sectionRenderers[type]) {
          content = sectionRenderers[type](context);
        } else if (customComponentId && customComponentRenderers?.[customComponentId]) {
          content = customComponentRenderers[customComponentId](context, metadata);
        } else {
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.warn(
              `[ScreenRenderer] No renderer registered for section "${section.id}" (type: ${type ?? "n/a"}, componentId: ${customComponentId ?? "n/a"})`
            );
          }
          return null;
        }

        return (
          <React.Fragment key={section.id ?? index}>
            {beforeSection?.(section, index)}
            <Box>{content}</Box>
            {afterSection?.(section, index)}
          </React.Fragment>
        );
      })}
    </Stack>
  );
};
