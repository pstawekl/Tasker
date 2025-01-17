type AppMode = 'light' | 'dark';

export class SettingsUtils {
  private static instance: SettingsUtils;
  appMode: AppMode;

  public static getInstance() {
    if (!SettingsUtils.instance) {
      SettingsUtils.instance = new SettingsUtils();
    }
    return SettingsUtils.instance;
  }
}
