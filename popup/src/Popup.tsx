import { useState, useEffect } from "react";

const Popup = () => {
  const [mouseTimeData, setMouseTimeData] = useState<
    { hostname: string; timeSpent: number }[]
  >([]);

  interface MouseTimeData {
    [hostname: string]: number;
  }

  useEffect(() => {
    console.log("popup");

    // Send a message to get data when the component mounts
    chrome.runtime.sendMessage(
      { type: "get-data" },
      (response: MouseTimeData | null) => {
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
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <>
      <div>Mouse Activity</div>
      {mouseTimeData.map(({ hostname, timeSpent }) => (
        <div key={hostname}>
          {hostname}: {timeSpent}
        </div>
      ))}
    </>
  );
};

export default Popup;
