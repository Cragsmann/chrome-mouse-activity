import { useState, useEffect } from "react";
import useD3Styling from "./hooks/useD3Styling";

export type MouseTimeData = {
  hostname: string;
  timeSpent: number;
};

export type MouseTimeResponse = {
  [hostname: string]: number;
};

const Popup = () => {
  const [mouseTimeData, setMouseTimeData] = useState<MouseTimeData[]>([]);
  useD3Styling(mouseTimeData);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { type: "get-data" },
      (response: MouseTimeResponse | null) => {
        if (response) {
          const data = Object.entries(response).map(
            ([hostname, timeSpent]) => ({
              hostname: hostname.replace(/^www\./, ""),
              timeSpent,
            })
          );
          setMouseTimeData(data);
          console.log(data);
        }
      }
    );

    const handleMessage = (message: {
      type: string;
      timeSpent: number;
      hostname: string;
    }) => {
      if (message.type === "mouse-move") {
        setMouseTimeData((prevData) => {
          const updatedData = [...prevData];
          const existingIndex = updatedData.findIndex(
            (item) => item.hostname === message.hostname.replace(/^www\./, "")
          );

          if (existingIndex !== -1) {
            updatedData[existingIndex].timeSpent += message.timeSpent;
          } else {
            updatedData.push({
              hostname: message.hostname.replace(/^www\./, ""),
              timeSpent: message.timeSpent,
            });
          }

          return updatedData;
        });
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <div className="popup">
      <div className="header">Mouse Activity</div>
      <div className="chart-container"></div>
      {mouseTimeData.map(({ hostname, timeSpent }) => (
        <div key={hostname} className="data-field">
          {hostname}: {timeSpent.toFixed(2)} seconds
        </div>
      ))}
    </div>
  );
};

export default Popup;
