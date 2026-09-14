import { z } from "zod";
import { HEX_COLOR_PATTERN } from "@/lib/theme/palette";

export const themeSettingsSchema = z.object({
  primaryColor: z.string().regex(HEX_COLOR_PATTERN, "invalid_color"),
  accentColor: z.string().regex(HEX_COLOR_PATTERN, "invalid_color"),
});

export type ThemeSettingsInput = z.infer<typeof themeSettingsSchema>;
