import { Canvas } from "fabric";
import { useEffect, useRef } from "react";
import { useContextCanvas } from "../context/Context";
import { Shape } from "./Shapes";

function CanvasWrapper() {
  const { contentState, setContentState } = useContextCanvas();
  const canvasRef = useRef(null);
  const fabricRef = useRef<Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, { perPixelTargetFind: true });
    fabricRef.current = canvas;

    canvas.setWidth(Math.floor(window.document.body.offsetWidth));
    canvas.setHeight(Math.floor(window.innerHeight / 2));

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
    console.log(contentState);
  }, [contentState]);

  return (
    <div>
      <canvas ref={canvasRef} id="canvas" className="border border-amber-300" />
    </div>
  );
}
export default CanvasWrapper;
