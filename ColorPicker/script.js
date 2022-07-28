const cursor = document.querySelector(".cursor");
const wheelControl = document.querySelector(".wheel-control");
const canvas1 = document.querySelector("#canvas1");
const canvas1Container = document.querySelector(".canvas1-container");
const copiesButton = document.querySelectorAll(".copy");
const canvas2 = document.querySelector("#canvas2");
const hsl_input = document.querySelector(".hsl .val");
const rgb_input = document.querySelector(".rgb .val");
const cmyk_input = document.querySelector(".cmyk .val");
const hex_input = document.querySelector(".hex .val");
const hexFormat = "0123456789ABCDEF";
const cursorStartOffset = { x: 0, y: cursor.getBoundingClientRect().y };
canvas1.width = 101;
canvas1.height = 101;
canvas2.width = 360;
canvas2.height = 20;

const c1 = canvas1.getContext("2d");
const c2 = canvas2.getContext("2d");

const maxHue = 360;
const maxSaturation = 100;
const maxLightness = 100;

let topRightHsl = "hsl(0,0%,50%)";
let currentH = 0;
const hsl = [];
const cursorPosition = { x: 0, y: 0 };

function drawWheel() {
  // body...
  for (let l = 0; l < canvas2.height; l++) {
    for (let w = 0; w <= maxHue; w++) {
      const h = `hsl(${w},100%,50%)`;
      c2.fillStyle = h;
      c2.fillRect(w, l, 1, 1);
    }
  }
}
drawWheel();

function drawColor() {
  // body...
  for (let i = 0; i <= maxLightness; i++) {
    let lightnessAwal = maxLightness - i;
    let lightnessAkhir = (maxLightness/2) - i / (maxLightness / (maxLightness/2));
    const hslRow = [];
    for (var j = 0; j <= maxSaturation; j++) {
      let lightnessTengah = lightnessAwal - j / (maxLightness / lightnessAkhir);
      const hsl1 = `hsl(${currentH}, ${j}%, ${lightnessTengah}%)`;
      hslRow[j] = `hsl(${currentH}, ${j}%, ${Math.round(lightnessTengah)}%)`;
      c1.fillStyle = hsl1;
      c1.fillRect(j, i, 1, 1);
    }
    hsl[i] = hslRow;
  }
  colorChange();
}

drawColor();
controlPlacer();

function handleCursor(e) {
  const cursorBounding = cursor.getBoundingClientRect();
  const offset = {
    x: cursorBounding.width / 2,
    y: cursorBounding.height / 2 + cursorStartOffset.y,
  };
  const canvasBounding = canvas1.getBoundingClientRect();
  let clientX = e.changedTouches[0].clientX;
  let clientY = e.changedTouches[0].clientY;
  let x, y;
  if (
    clientX > canvasBounding.x &&
    clientX < canvasBounding.x + canvasBounding.width &&
    clientY > canvasBounding.y &&
    clientY < canvasBounding.y + canvasBounding.height
  ) {
    x = clientX;
    y = clientY;
  } else {
    if (clientY > canvasBounding.y + canvasBounding.height) {
      if (
        clientX > canvasBounding.x &&
        clientX < canvasBounding.x + canvasBounding.width
      )
        x = clientX;
      y = canvasBounding.y + canvasBounding.height;
    } else if (clientY < canvasBounding.y) {
      if (
        clientX > canvasBounding.x &&
        clientX < canvasBounding.x + canvasBounding.width
      )
        x = clientX;
      y = canvasBounding.y;
    }
    if (clientX < canvasBounding.x) {
      if (
        clientY > canvasBounding.y &&
        clientY < canvasBounding.y + canvasBounding.height
      )
        y = clientY;
      x = canvasBounding.x;
    } else if (clientX > canvasBounding.x + canvasBounding.width) {
      if (
        clientY > canvasBounding.y &&
        clientY < canvasBounding.y + canvasBounding.height
      )
        y = clientY;
      x = canvasBounding.x + canvasBounding.width;
    }
  }
  cursorPosition.x =
    0 + Math.round((x - canvasBounding.x) / (canvasBounding.width / 100));
  cursorPosition.y =
    0 + Math.round((y - canvasBounding.y) / (canvasBounding.height / 100));
  cursor.style.transform = `translate(${x - offset.x}px,${y - offset.y}px)`;

  colorChange();
}
function handleWheel(e) {
  const wheelBounding = wheelControl.getBoundingClientRect()
  const canvasBounding = canvas2.getBoundingClientRect()
  const offset = {x:wheelBounding.width/2}
  const clientX = e.changedTouches[0].clientX
  let x;
  if (
    clientX > canvasBounding.x &&
    clientX < canvasBounding.x + canvasBounding.width) {
    x = clientX;
  } else {
    if (clientX < canvasBounding.x) {
      x = canvasBounding.x;
    } else if (clientX > canvasBounding.x + canvasBounding.width) {
      x = canvasBounding.x + canvasBounding.width;
    }
  }
  
  wheelControl.style.transform = `translate(${x - offset.x}px,${canvas2.offsetTop}px)`;
  currentH = Math.round(0 + Math.round((x - canvasBounding.x) / (canvasBounding.width / 360)));
  drawColor();
}

cursor.addEventListener("touchmove", (e) => handleCursor(e));
canvas1.addEventListener("touchstart", (e) => handleCursor(e));
canvas1.addEventListener("touchmove", (e) => handleCursor(e));
canvas2.addEventListener("touchstart", (e) => handleWheel(e));
canvas2.addEventListener("touchmove", (e) => handleWheel(e));

wheelControl.addEventListener("touchmove", (e) => handleWheel(e));
function controlPlacer() {
  // body...
  const canvas1Bounding = canvas1.getBoundingClientRect();
  const canvas2Bounding = canvas2.getBoundingClientRect();
  const cursorX = canvas1Bounding.x;
  const cursorY = canvas1Bounding.y;
  const wheelX = canvas2Bounding.x;
  const wheelY = canvas2.offsetTop;
  cursorPosition.x = canvas1Bounding.x - cursor.offsetWidth / 2;
  cursorPosition.y = canvas1Bounding.y;
  cursor.style.transform = `translate(${cursorPosition.x}px,${cursorPosition.y}px)`;
  wheelControl.style.transform = `translate(${wheelX - 10}px,${wheelY}px)`;
}

function getHexValue(num) {
  const temp = num / 16;
  const temp2 = (temp - Math.floor(temp)) * 16;
  return `${hexFormat[Math.floor(temp)]}${hexFormat[temp2]}`;
}

function colorChange() {
  const { data } = c1.getImageData(cursorPosition.x, cursorPosition.y, 2, 2);
  const r = data[0];
  const g = data[1];
  const b = data[2];
  const a = data[3];
  //hsl_input.value = JSON.stringify(cursorPosition);
  hsl_input.value =
  hsl[Math.round(cursorPosition.y)][Math.round(cursorPosition.x)];
  rgb_input.value = `rgba(${r},${g}, ${b}, 1)`;
  const c = 255 - r;
  const m = 255 - g;
  const y = 255 - b;
  const K = Math.min(c, m, y);
  const CMYK = {
    C: c - K,
    M: m - K,
    Y: y - K,
  };
  cmyk_input.value = `CMYK(${CMYK.C}, ${CMYK.M}, ${CMYK.Y}, ${K})`;

  hex_input.value = `#${getHexValue(r)}${getHexValue(g)}${getHexValue(b)}`;

  canvas1Container.style.backgroundColor = rgb_input.value;
}

copiesButton.forEach((el) => {
  el.addEventListener("click", (e) => {
    const val = e.target.previousElementSibling.value;
    navigator.clipboard.writeText(val).then(
      () => {
        alert("tercopy");
      },
      (e) => alert("kesalahan")
    );
  });
});
