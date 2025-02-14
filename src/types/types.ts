import { Canvas } from "fabric";

export interface BaseProps {
  canvas: Canvas;
  contentState: ContentState;
  setContentState: React.Dispatch<React.SetStateAction<ContentState>>;
}

export interface ContentState {
  tool: string;
  canvas: Canvas | undefined;
  type: string;
  colorShape: string;
  strokeWidth: number;
  strokeColor: string;
  fillShape: boolean;
  expandElementsMenu: boolean;
  expandDrawMenu: boolean;
  brushType: string;
  undoStack: string[];
  redoStack: string[];
  name: number;
}

export interface CanvasContextProps {
  contentState: ContentState;
  setContentState: React.Dispatch<React.SetStateAction<ContentState>>;
}
