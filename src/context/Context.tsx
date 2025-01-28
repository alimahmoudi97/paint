import React, { createContext, ReactNode, useContext, useState } from "react";

interface CanvasContextProps {
  contentState: {
    tool: string;
    canvas: HTMLCanvasElement | null;
    type: string;
  };
  setContentState: React.Dispatch<
    React.SetStateAction<{
      tool: string;
      canvas: HTMLCanvasElement | null;
      type: string;
    }>
  >;
}

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

function ContextProvider({ children }: { children: ReactNode }) {
  const [contentState, setContentState] = useState<{
    tool: string;
    canvas: HTMLCanvasElement | null;
    type: string;
  }>({
    tool: "shape",
    canvas: null,
    type: "",
  });
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
