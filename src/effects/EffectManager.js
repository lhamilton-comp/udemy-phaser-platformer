import SpriteEffect from "./SpriteEffect";

class EffectManager {
  constructor(scene) {
    this.scene = scene;
  }

  playEffectOn(key, target, point) {
    const effect = new SpriteEffect(this.scene, 0, 0, key, point);
    effect.playOn(target);
  }
}

export default EffectManager;
