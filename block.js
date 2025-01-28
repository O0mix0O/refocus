const blockTime = 1000; // 10 seconds for holding button

document.body.innerHTML = `
  <div id="blocker" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: white;">
    <h1>You've spent too much time on Reddit!</h1>
    <button id="unblockBtn" style="font-size: 20px;">Press and hold for 10 seconds to unblock</button>
  </div>
`;

const unblockBtn = document.getElementById('unblockBtn');
let holdTimer;
let holdStart;

unblockBtn.addEventListener('mousedown', () => {
  console.log('Button pressed, starting hold timer...');
  holdStart = Date.now();
  holdTimer = setTimeout(() => {
    console.log('Hold timer completed, sending unblock message...');
    chrome.runtime.sendMessage({ action: "unblock" });
  }, blockTime);
});

unblockBtn.addEventListener('mouseup', () => {
  console.log('Button released, clearing hold timer...');
  clearTimeout(holdTimer);
});

unblockBtn.addEventListener('mouseleave', () => {
  console.log('Mouse left button, clearing hold timer...');
  clearTimeout(holdTimer);
});
