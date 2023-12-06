import React from "react";
import { useEffect } from "react";

export const useKey = (action, key) => {
  useEffect(() => {
    const callBackFnc = (e) => {
      if (e.code.toLocaleLowerCase() === key.toLocaleLowerCase()) {
        action();
      }
    };

    document.addEventListener("keydown", callBackFnc);

    return () => {
      document.removeEventListener("keydown", callBackFnc);
    };
  }, [action, key]);
};
