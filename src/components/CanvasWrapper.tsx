import { Canvas } from "fabric";
import { useEffect, useRef } from "react";
import { useContextCanvas } from "../context/Context";

function CanvasWrapper() {
  const { contentState } = useContextCanvas();
  const canvasRef = useRef(null);
  const fabricRef = useRef<Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, { perPixelTargetFind: true });
    fabricRef.current = canvas;

    canvas.setWidth(Math.floor(window.document.body.offsetWidth / 2));
    canvas.setHeight(Math.floor(window.innerHeight / 2));

    return () => {
      canvas.dispose();
    };
  }, []);

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
