"use client";

import { Provider } from "react-redux";
import { getStore } from "@/redux/store/store";
import { useMemo } from "react";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useMemo(() => {
    return getStore();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
