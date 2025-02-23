import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useContextCanvas } from "../hooks/useContextCanvas";
import { useEffect, useState } from "react";

function Layers() {
  const { contentState } = useContextCanvas();
  const [selectedLayerItem, setSelectedLayerItem] = useState<number>(-1);

  const handleLayerClick = (index: number) => {
    const canvas = contentState.canvas;
    if (!canvas) return;

    const object = canvas.item(index);
    setSelectedLayerItem(index);
    canvas.setActiveObject(object);
    canvas.renderAll();
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    const canvas = contentState.canvas;
    if (!canvas) return;

    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const objects = canvas.getObjects();

    const [draggedObject] = objects.splice(draggedIndex, 1);
    objects.splice(index, 0, draggedObject);

    canvas.clear();
    objects.forEach((obj) => canvas.add(obj));
    canvas.renderAll();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleArrowUpLayer = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;

    const objects = canvas.getObjects();
    const [moveObject] = objects.splice(selectedLayerItem, 1);
    if (selectedLayerItem > 0) {
      objects.splice(selectedLayerItem - 1, 0, moveObject);
      setSelectedLayerItem((prev) => prev - 1);
    } else {
      objects.splice(objects.length - 1, 0, moveObject);
      setSelectedLayerItem(objects.length - 1);
    }

    canvas.clear();
    objects.forEach((obj) => canvas.add(obj));
    canvas.renderAll();
  };

  const handleArrowDwonLayer = () => {
    const canvas = contentState.canvas;
    if (!canvas) return;

    const objects = canvas.getObjects();
    const [moveObject] = objects.splice(selectedLayerItem, 1);
    if (selectedLayerItem <= objects.length - 1) {
      objects.splice(selectedLayerItem + 1, 0, moveObject);
      setSelectedLayerItem((prev) => prev + 1);
    } else {
      objects.splice(0, 0, moveObject);
      setSelectedLayerItem(0);
    }
    canvas.clear();
    objects.forEach((obj) => canvas.add(obj));
    canvas.renderAll();
  };

  useEffect(() => {
    console.log(selectedLayerItem);
  }, [selectedLayerItem]);
  return (
    <div className="mt-4">
      <h2 className="text-base font-semibold mb-4">Layers</h2>
      <div className="flex justify-between">
        <div className="w-full space-y-1 max-h-64 overflow-y-auto  scrollbar">
          {contentState.canvas?.getObjects().map((obj, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              onClick={() => handleLayerClick(index)}
              className={` p-2 rounded-sm cursor-pointer text-xs text-gray-600 font-medium bg-gray-100 ${
                selectedLayerItem === index ? "bg-gray-300" : ""
              }`}
            >
              {obj.type}-{index}
            </div>
          ))}
        </div>
        <div>
          <div className="flex gap-2">
            <button onClick={handleArrowUpLayer} className="cursor-pointer">
              <FaArrowUp className="w-6 h-6" />
            </button>
            <button onClick={handleArrowDwonLayer} className="cursor-pointer">
              <FaArrowDown className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Layers;
