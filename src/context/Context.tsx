import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { CanvasContextProps, ContentState } from "../types/types";

export const CanvasContext = createContext<CanvasContextProps | undefined>(
  undefined
);

function ContextProvider({ children }: { children: ReactNode }) {
  const [contentState, setContentState] = useState<ContentState>({
    tool: "",
    canvas: undefined,
    type: "",
    colorShape: "#000",
    strokeWidth: 2,
    strokeColor: "#000",
    fillShape: false,
    expandDrawMenu: false,
    expandElementsMenu: false,
    brushType: "",
    undoStack: [],
    redoStack: [],
    name: 0,
    showModal: false,
    fontSize: 16,
    fontColor: "#000000",
    fontFamily: "Arial",
    canvasBackgroundColor: "white",
  });
  const contentStateRef = useRef<ContentState | null>(null);

  useEffect(() => {
    contentStateRef.current = contentState;
  }, [contentState]);
  return (
    <CanvasContext.Provider value={{ contentState, setContentState }}>
      {children}
    </CanvasContext.Provider>
  );
}
export default ContextProvider;
