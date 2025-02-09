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
}

export interface CanvasContextProps {
  contentState: ContentState;
  setContentState: React.Dispatch<React.SetStateAction<ContentState>>;
}
