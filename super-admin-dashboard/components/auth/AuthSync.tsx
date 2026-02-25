"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, clearCredentials, updateAccessToken } from "@/redux/features/slice/authSlice";
import { RootState } from "@/redux/store/store";
import { RoleType } from "@/types/user";

export default function AuthSync() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const { accessToken: reduxToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    console.log("[AuthSync] status:", status, "| session?.accessToken:", session?.accessToken ? "EXISTS" : "MISSING", "| reduxToken:", reduxToken ? "EXISTS" : "MISSING");
    console.log("[AuthSync] full session:", JSON.stringify(session, null, 2));
    if (status === "authenticated" && session?.user) {
      // Check if we need to update the Redux store
      if (!reduxToken && session?.accessToken && session?.user) {
        // Only dispatch if we have an access token and Redux doesn't have one
        dispatch(
          setCredentials({
            accessToken: session.accessToken,
            user: {
              _id: session.user.id as string,
              email: session.user.email as string,
              name: session.user.name as string,
              image: session.user.image || '',
              role: session.user.role as RoleType,
              // createdAt: '',
              // updatedAt: '',
              accessToken: session.accessToken,
            },
          }),
        );
      } else if (reduxToken && session?.accessToken && session.accessToken !== reduxToken) {
        // Update token if it has changed
        dispatch(updateAccessToken(session.accessToken));
      }
    } else if (status === "unauthenticated") {
      // Clear credentials when user is not authenticated
      dispatch(clearCredentials());
    }
  }, [session, status, dispatch, reduxToken]);

  return null;
}
