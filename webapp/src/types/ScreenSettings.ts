export type ScreenSettings = {
  screenWidth: number;
  screenHeight: number;
  guiScale: number;
  screenScale: number;
  showGrid: boolean;
  gridSize: number;
  currentPresetIndex: number;
};

export type ScreenSettingsStorageData = {
  version: string;
  settings: ScreenSettings;
};
