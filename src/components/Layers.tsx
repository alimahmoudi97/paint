import { FaArrowDown, FaArrowUp, FaGripVertical } from "react-icons/fa";
import { useContextCanvas } from "../hooks/useContextCanvas";
import { useState } from "react";
import { IconButton, SettingCard } from "./SettingControls";

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

  const objects = contentState.canvas?.getObjects() || [];

  return (
    <SettingCard title="Layers">
      {objects.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          No objects on the canvas yet
        </p>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1 space-y-1.5 max-h-56 overflow-y-auto scrollbar pr-1">
            {objects.map((obj, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                onClick={() => handleLayerClick(index)}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-xs font-medium border transition-colors duration-150 ${
                  selectedLayerItem === index
                    ? "bg-purple-50 border-purple-200 text-purple-700"
                    : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FaGripVertical className="w-3 h-3 text-gray-300 shrink-0" />
                <span className="capitalize truncate">
                  {obj.type} {index}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <IconButton title="Move up" onClick={handleArrowUpLayer}>
              <FaArrowUp className="w-3.5 h-3.5" />
            </IconButton>
            <IconButton title="Move down" onClick={handleArrowDwonLayer}>
              <FaArrowDown className="w-3.5 h-3.5" />
            </IconButton>
          </div>
        </div>
      )}
    </SettingCard>
  );
}
export default Layers;
