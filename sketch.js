let spriteImg;
let spriteFrame = 0;
const totalFrames = 6;
const frameDuration = 100; // 每幀毫秒
let lastFrameTime1 = 0;

// 動畫開關（預設關閉）
let animating = false;

// 第二個角色
let spriteImg2;
let spriteFrame2 = 0;
const totalFrames2 = 8;
let lastFrameTime2 = 0;

function preload() {
  // 請確認檔案存在：3/all.png
  spriteImg = loadImage('3/all.png');
  // 第二個角色圖片（資料夾 4）
  spriteImg2 = loadImage('4/all3.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 使用 copy() 時維持預設座標系（左上角），不改 imageMode
}

function draw() {
  background('#1b263b');

  if (!spriteImg) return;

  if (!spriteImg2) return;

  const fw = spriteImg.width / totalFrames;
  const fh = spriteImg.height;

  // 取得目前時間，但只有在 animating 為 true 時更新幀
  const now = millis();
  if (animating) {
    // 更新幀（角色一）
    if (now - lastFrameTime1 > frameDuration) {
      spriteFrame = (spriteFrame + 1) % totalFrames;
      lastFrameTime1 = now;
    }
  }
  const sx = spriteFrame * fw;

  // 第二個角色的尺寸資訊
  const fw2 = spriteImg2.width / totalFrames2;
  const fh2 = spriteImg2.height;

  // 目標高度：以視窗短邊的 18% 作為預設顯示高度
  const targetH = min(width, height) * 0.18;
  let scale1 = targetH / fh;
  let scale2 = targetH / fh2;

  let dw = fw * scale1;
  let dh = fh * scale1;
  let dw2 = fw2 * scale2;
  let dh2 = fh2 * scale2;

  const margin = max(12, targetH * 0.12); // 角色間距

  // 嘗試把角色一放在畫面中央，角色二放在右邊
  let dx1 = width / 2 - dw / 2;
  let dx2 = dx1 + dw + margin;

  // 若角色二會超出畫面，先嘗試把兩個一起向左移動以容納
  const overflow = (dx2 + dw2) - (width - 8);
  if (overflow > 0) {
    // 可以往左移動的最大距離
    const maxLeftShift = dx1 - 8;
    const shift = min(overflow, maxLeftShift);
    dx1 -= shift;
    dx2 -= shift;
  }

  // 若仍超出（空間不足），縮小比例以同時容納兩個角色
  const totalNeeded = (dx2 + dw2) - (width - 8);
  if (totalNeeded > 0) {
    const available = width - 16; // 預留邊界
    const currentTotal = dw + margin + dw2;
    const reduceFactor = available / currentTotal;
    scale1 *= reduceFactor;
    scale2 *= reduceFactor;
    dw = fw * scale1;
    dh = fh * scale1;
    dw2 = fw2 * scale2;
    dh2 = fh2 * scale2;
    // 重新定位，以保持角色一接近中心
    dx1 = width / 2 - dw / 2;
    dx2 = dx1 + dw + margin;
  }

  const dy1 = height / 2 - dh / 2;
  const dy2 = height / 2 - dh2 / 2;

  // 更新幀（角色二）
  if (animating) {
    if (now - lastFrameTime2 > frameDuration) {
      spriteFrame2 = (spriteFrame2 + 1) % totalFrames2;
      lastFrameTime2 = now;
    }
  }
  const sx2 = spriteFrame2 * fw2;

  // 繪製兩個角色
  copy(spriteImg, sx, 0, fw, fh, dx1, dy1, dw, dh);
  copy(spriteImg2, sx2, 0, fw2, fh2, dx2, dy2, dw2, dh2);
}

function mousePressed() {
  animating = !animating;
  // 當剛開啟動畫時，重設時間基準，避免立即跳過多幀
  if (animating) {
    lastFrameTime1 = millis();
    lastFrameTime2 = millis();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
