import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { toggleTheme } from "@/redux/features/slice/uiSlice";

export const useTheme = () => {
  const { theme } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const toggleCurrentTheme = () => {
    dispatch(toggleTheme());
  };

  return {
    theme,
    toggleCurrentTheme,
  };
};
