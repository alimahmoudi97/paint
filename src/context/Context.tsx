import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas } from "fabric";
interface CanvasContextProps {
  contentState: {
    tool: string;
    canvas: Canvas | undefined;
    type: string;
    colorShape: string;
    strokeWidth: number;
    strokeColor: string;
    fillShape: boolean;
  };
  setContentState: React.Dispatch<
    React.SetStateAction<{
      tool: string;
      canvas: Canvas | undefined;
      type: string;
      colorShape: string;
      strokeWidth: number;
      strokeColor: string;
      fillShape: boolean;
    }>
  >;
}

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

function ContextProvider({ children }: { children: ReactNode }) {
  const [contentState, setContentState] = useState<{
    tool: string;
    canvas: Canvas | undefined;
    type: string;
    colorShape: string;
    strokeWidth: number;
    strokeColor: string;
  }>({
    tool: "shape",
    canvas: undefined,
    type: "f",
    colorShape: "#000",
    strokeWidth: 2,
    strokeColor: "#000",
  });
  const contentStateRef = useRef<{
    tool: string;
    canvas: Canvas | undefined;
    type: string;
    colorShape: string;
    strokeWidth: number;
    strokeColor: string;
  } | null>(null);

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

export const useContextCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useContextCanvas must be used within a ContextProvider");
  }
  return context;
};
