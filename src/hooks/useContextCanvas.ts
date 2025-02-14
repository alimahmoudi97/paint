import { useContext } from "react";
import { CanvasContext } from "../context/Context";

export const useContextCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useContextCanvas must be used within a ContextProvider");
  }
  return context;
};
