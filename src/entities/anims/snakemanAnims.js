const initAnims = (anims) => {
  anims.create({
    key: "snakeman-idle",
    frames: anims.generateFrameNumbers("snakeman", {start: 0, end: 8}),
    frameRate: 8,
    repeat: -1
  });

  anims.create({
    key: "snakeman-hurt",
    frames: anims.generateFrameNumbers("snakeman", {start: 21, end: 22}),
    frameRate: 10,
    repeat: 0
  });
}

export default initAnims;
