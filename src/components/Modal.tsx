import { FabricImage } from "fabric";
import { FaLink, FaUpload } from "react-icons/fa";
import { useContextCanvas } from "../hooks/useContextCanvas";
import { useEffect, useState } from "react";

function Modal() {
  const { contentState, setContentState } = useContextCanvas();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const image = await FabricImage.fromURL(dataUrl);
        contentState.canvas?.add(image);
        contentState.canvas?.renderAll();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const url = event.target.value;
    const image = await FabricImage.fromURL(url);
    contentState.canvas?.add(image);
    contentState.canvas?.renderAll();
  };

  useEffect(() => {
    if (contentState.showModal) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [contentState.showModal]);

  return (
    isVisible && (
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300
        ${isAnimating ? "opacity-100" : "opacity-0"}
      `}
      >
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={() =>
            setContentState((prev) => ({ ...prev, showModal: false }))
          }
        ></div>
        <div
          className={`bg-white p-4 rounded-lg shadow-lg z-10 w-96 transition-transform duration-300
          ${isAnimating ? "scale-100" : "scale-90"}
          `}
        >
          <div className="border-b text-gray-500 text-2xl font-semibold text-center p-2">
            Import Image
          </div>
          <div className="flex flex-col gap-4 mt-2 ">
            <div className="flex items-center border-dashed border p-8">
              <label htmlFor="fileInput" className="text-xs cursor-pointer">
                <FaUpload className="mr-2 w-6 h-6" />
              </label>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs mb-4 cursor-pointer"
              />
            </div>
            <div className="flex">
              <label htmlFor="urlInput" className="text-base mb-2">
                <FaLink className="mr-2 w-6 h-6" />
              </label>
              <input
                type="text"
                id="urlInput"
                onChange={handleUrlChange}
                className="text-sx mb-4 bg-white w-1/2 text-black"
                placeholder="image URL"
              />
            </div>
          </div>
          <button
            className="bg-red-600 w-full py-2 rounded cursor-pointer text-white"
            onClick={() =>
              setContentState((prev) => ({ ...prev, showModal: false }))
            }
          >
            Close
          </button>
        </div>
      </div>
    )
  );
}

export default Modal;
