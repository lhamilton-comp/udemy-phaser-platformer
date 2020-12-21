const collidable = {

   addCollider: function(gameObject, callback=null, context) {
    this.scene.physics.add.collider(
      this,
      gameObject,
      callback,
      null,
      (context || this)
    );
    return this;
  },

  addOverlap: function(gameObject, callback=null, context) {
   this.scene.physics.add.overlap(
     this,
     gameObject, 
     callback,
     null,
     (context || this)
   );
   return this;
 },

  setBounded: function(status) {
    this.setCollideWorldBounds(status);
    return this;
  },

  distSinceCast: 0,
  prevRayCast: {ray: null, hasHit: null},

  raycast: function(layer, recastDist=2, length=30, steepness=0.3) {

    this.distSinceCast += this.body.deltaX();
    let {ray, hasHit} = this.prevRayCast;

    if (Math.abs(this.distSinceCast) > recastDist || !ray) {
      ray = new Phaser.Geom.Line();
      if (this.body.facing == Phaser.Physics.Arcade.FACING_RIGHT) {
        ray.x1 = this.body.x + this.body.width;
        ray.x2 = ray.x1 + length * steepness;
      } else if (this.body.facing == Phaser.Physics.Arcade.FACING_LEFT) {
        ray.x1 = this.body.x;
        ray.x2 = ray.x1 - length * steepness;
      }

      ray.y1 = this.body.y + this.body.halfHeight;
      ray.y2 = ray.y1 + length;

      hasHit = layer.getTilesWithinShape(ray).some(tile => (
        tile.index !== -1
      ));
      this.distSinceCast = 0;
      this.prevRayCast = {ray, hasHit};
    }

    return {ray, hasHit};
  }

};

export default collidable;
