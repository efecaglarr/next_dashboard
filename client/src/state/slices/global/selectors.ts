import { RootState } from "../../store";

export const selectIsSidebarCollapsed = (state: RootState) =>
  state.global.isSidebarCollapsed;
export const selectIsDarkMode = (state: RootState) => state.global.isDarkMode;
