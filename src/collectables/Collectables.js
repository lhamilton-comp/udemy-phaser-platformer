import Phaser from "phaser";
import Collectable from "./Collectable"
import collidable from "../entities/mixins/collidable"

class Collectables extends Phaser.Physics.Arcade.StaticGroup {

  constructor(scene) {
    super(scene.physics.world, scene);
    this.createFromConfig({classType: Collectable});
    Object.assign(this, collidable);
  }

  mapProperties(properties) {
    if (!properties || properties.length == 0) { return {} };
    return properties.reduce((map, object) => {
      map[object.name] = object.value;
      return map;
    }, {});
  }

  addFromLayer(layer) {
    const {score: defaultScore} = this.mapProperties(layer.properties);
    layer.objects.forEach(object => {
      const collectable = this.get(object.x, object.y, "diamond");
      const objectProperties = this.mapProperties(object.properties);
      collectable.score = (objectProperties.score || defaultScore);
    });
  }

}



export default Collectables;
