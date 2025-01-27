import { Canvas } from "fabric";
import { useEffect, useRef } from "react";

function CanvasWrapper() {
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

  return (
    <div>
      <canvas ref={canvasRef} id="canvas" className="border border-amber-300" />
    </div>
  );
}
export default CanvasWrapper;
