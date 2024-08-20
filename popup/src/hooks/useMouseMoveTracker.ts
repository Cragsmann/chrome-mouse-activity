import { useState, useEffect, useRef } from "react";
import { throttle } from "lodash";

type MouseData = {
  hostname: string;
  timeSpent: number;
};

const useMouseMoveTracker = () => {
  const [mouseData, setMouseData] = useState<MouseData[]>([]);

  const [mouseMoving, setMouseMoving] = useState(false);
  const moveStartTimeRef = useRef<number | null>(null);
  const moveTimerRef = useRef<number | null>(null);
  const inactivityTimerRef = useRef<number | null>(null);
  const siteDataRef = useRef<Record<string, number>>({}); // Persistent data across re-renders

  useEffect(() => {
    const handleMouseMove = throttle(() => {
      if (!mouseMoving) {
        setMouseMoving(true);
        moveStartTimeRef.current = Date.now();
      }

      if (inactivityTimerRef.current !== null) {
        clearTimeout(inactivityTimerRef.current);
      }

      inactivityTimerRef.current = window.setTimeout(() => {
        if (moveStartTimeRef.current !== null) {
          const moveEndTime = Date.now();
          const elapsedTime = (moveEndTime - moveStartTimeRef.current) / 1000;

          // Update siteDataRef
          const hostname = window.location.hostname;
          if (!siteDataRef.current[hostname]) {
            siteDataRef.current[hostname] = 0;
          }
          siteDataRef.current[hostname] += elapsedTime;

          // Store data in Chrome storage
          chrome.storage.local.set({ siteData: siteDataRef.current });
        }

        setMouseMoving(false);
      }, 200);
    }, 100); // Throttle mousemove events to reduce performance impact

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (moveTimerRef.current !== null) {
        clearTimeout(moveTimerRef.current);
      }
      if (inactivityTimerRef.current !== null) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [mouseMoving]);

  useEffect(() => {
    // Request data from the background script once the component is mounted
    chrome.runtime.sendMessage(
      { type: "get-data" },
      (response: Record<string, number> | undefined) => {
        if (response) {
          console.log("Response:", response);
          const data: MouseData[] = Object.entries(response).map(
            ([hostname, timeSpent]) => ({
              hostname: hostname.replace(/^www\./, ""),
              timeSpent,
            })
          );
          setMouseData(data);
        } else {
          console.warn("No data received from background script.");
        }
      }
    );
  }, []);

  return mouseData;
};

export default useMouseMoveTracker;
