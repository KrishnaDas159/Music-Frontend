import React, { useRef } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";

interface WebcamProps {
  setCapturedImage: (img: string | null) => void;
  renderFooter?: React.ReactNode;
}

const ReactWebcamCapture: React.FC<WebcamProps> = ({ setCapturedImage, renderFooter }) => {
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  };

  return (
    <div className="space-y-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-lg w-full"
      />
      <div className="flex justify-between items-center mt-4">
  <Button onClick={handleCapture} className="bg-green-700 hover:bg-green-800">
    Capture
  </Button>
  {renderFooter}
</div>

    </div>
  );
};

export default ReactWebcamCapture;


