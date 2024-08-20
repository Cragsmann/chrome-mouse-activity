let mouseMoving: boolean = false;
let moveStartTime: number;
let moveTimer: number;

document.addEventListener("mousemove", () => {
  if (!mouseMoving) {
    mouseMoving = true;
    moveStartTime = Date.now();
  }

  clearTimeout(moveTimer);
  moveTimer = window.setTimeout(() => {
    const moveEndTime = Date.now();
    const elapsedTime = (moveEndTime - moveStartTime) / 1000;
    chrome.runtime.sendMessage({
      type: "mouse-move",
      timeSpent: elapsedTime,
      hostname: location.hostname,
    });
    mouseMoving = false;
  }, 200);
});
