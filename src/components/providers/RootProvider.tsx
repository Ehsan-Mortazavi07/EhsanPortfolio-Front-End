"use client";

import { FC, PropsWithChildren, useEffect } from "react";
import { Toast } from "@heroui/react";
import { storage } from "@/common/utils";
import { autoLogin, setDidTryAutoLogin } from "@/stores/auth/actions";
import { didTryAutoLoginSelector } from "@/stores/auth/selectors";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

const RootProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const didTryAutoLogin = useAppSelector(didTryAutoLoginSelector);

  useEffect(() => {
    if (didTryAutoLogin) return;
    const token = storage.getToken();
    if (!token) {
      dispatch(setDidTryAutoLogin());
      return;
    }
    dispatch(autoLogin(token));
  }, [didTryAutoLogin, dispatch]);

  return (
    <>
      {children}
      <Toast.Provider maxVisibleToasts={5} />
    </>
  );
};

export default RootProvider;
