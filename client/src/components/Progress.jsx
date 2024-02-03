import io from "socket.io-client";

import ProgressBar from "@ramonak/react-progress-bar";
import { useEffect, useState } from "react";

const Progress = ({ progress, setProgress }) => {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("progress", (data) => {
      console.log(data.progress);
      setProgress(data.progress);
    });

    return () => socket.disconnect();
  }, []);
  return (
    <div className="p-2">
      <ProgressBar className="" bgColor="green" completed={progress} />
    </div>
  );
};

export default Progress;
