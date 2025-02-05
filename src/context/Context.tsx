import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CanvasContextProps, ContentState } from "../types/types";

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

function ContextProvider({ children }: { children: ReactNode }) {
  const [contentState, setContentState] = useState<ContentState>({
    tool: "",
    canvas: undefined,
    type: "",
    colorShape: "#000",
    strokeWidth: 2,
    strokeColor: "#000",
    fillShape: false,
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

export const useContextCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useContextCanvas must be used within a ContextProvider");
  }
  return context;
};
