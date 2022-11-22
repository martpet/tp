import { ColorScheme } from './ColorScheme';
import { Language } from './Language';
import { ToolbarPosition } from './ToolbarPosition';

export type UserSettings = {
  language?: Language;
  colorScheme?: ColorScheme;
  toolbarPosition?: ToolbarPosition;
};
