import { Canvas } from "fabric";
import { useEffect, useRef } from "react";
import { useContextCanvas } from "../context/Context";
import { Shape } from "./Shapes";
import PenTool from "./PenTool";

function CanvasWrapper() {
  const { contentState, setContentState } = useContextCanvas();
  const canvasRef = useRef(null);
  const fabricRef = useRef<Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, { perPixelTargetFind: true });
    fabricRef.current = canvas;

    canvas.setWidth(Math.floor(window.document.body.offsetWidth * 0.9));
    canvas.setHeight(Math.floor(window.innerHeight * 0.9));

    setContentState((prev) => ({ ...prev, canvas: canvas }));

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricRef.current) return;
    const shapeEventListener = Shape({
      canvas: fabricRef.current,
      contentState,
      setContentState,
    });

    return () => {
      shapeEventListener.removeEventListener();
    };
  }, [contentState]);

  useEffect(() => {
    if (fabricRef.current && contentState.tool == "pen") {
      PenTool({ canvas: fabricRef.current, contentState, setContentState });
      console.log(contentState.tool);
    }
  }, [contentState.tool]);

  useEffect(() => {
    if (!canvasRef.current) return;
    console.log(
      "contentState canvas",
      fabricRef.current === contentState.canvas
    );
  }, [contentState]);

  return (
    <div>
      <canvas ref={canvasRef} id="canvas" className="border border-amber-300" />
    </div>
  );
}
export default CanvasWrapper;
