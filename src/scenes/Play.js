import Phaser from "phaser";
import Player from "../entities/Player"
import Birdman from "../entities/Birdman"
import Snakeman from "../entities/Snakeman"
import Enemies from "../entities/groups/Enemies"
import Collectables from "../collectables/Collectables"
import Hud from "../hud/Hud"
import HealthBar from "../hud/HealthBar"
import Emitter from "../events/Emitter"
import initAnims from "../effects/anims/effectAnims"

const GRAVITY = 500;

const TILESET = ["main_lev_build_1", "tileset-1"];
const TILE_LAYERS = ["collision", "environment", "platforms", "traps"];
const ZONE_LAYER = "player_zones";
const SPAWN_LAYER = "enemy_spawns";
const COLLECTABLE_LAYER = "collectables";

const ENEMY_TYPES = {Birdman, Snakeman};

const HUD_MARGIN = 5;

class Play extends Phaser.Scene {

  constructor(config) {
    super("Play");
    this.config = config;
  }

  create({restart}) {
    this.map = this.createMap();
    this.background = this.createBackground();

    initAnims(this.anims);
    this.player = this.createEntity(this.map.zones.start, Player);
    this.enemies = this.createEnemies(this.map.spawns.objects);
    this.collectables = this.createCollectables(this.map.collectables);
    this.levelEnd = this.createLevelEnd(this.map.zones.end);
    this.sfx = this.createSounds();
    this.setupColliders();
    this.setupCamera();
    this.hud = this.createHud();
    this.createBackButton();
    if (!restart) { this.setupEvents() }

    this.score = 0;

  }

  createMap() {
    const tiles = this.make.tilemap({key: `level-${this.currentLevel}`});
    const tileset = tiles.addTilesetImage(...TILESET);
    const spikes = tiles.addTilesetImage("bg_spikes_tileset", "bg-spikes-tileset");

    const layers = {};
    for (let layer of TILE_LAYERS) {
      layers[layer] = tiles.createStaticLayer(layer, tileset);
    }
    layers.collision.setCollisionByProperty({collision: true}).setAlpha(0);
    layers.traps.setCollisionByExclusion(-1);
    tiles.createStaticLayer("distance", spikes).setDepth(-3);

    const zones = {};
    for (let zone of tiles.getObjectLayer(ZONE_LAYER).objects) {
      zones[zone.name] = zone;
    }

    const spawns = tiles.getObjectLayer(SPAWN_LAYER);
    const collectables = tiles.getObjectLayer(COLLECTABLE_LAYER);

    return {tiles, tileset, layers, zones, spawns, collectables};
  }

  createBackground() {
    const [bg] = this.map.tiles.getObjectLayer("distance_bg").objects;
    const spikes = this.add.tileSprite(bg.x, bg.y, this.config.width, bg.height, "bg-spikes-dark")
      .setOrigin(0, 1)
      .setDepth(-1)
      .setScrollFactor(0, 1);
    const sky = this.add.tileSprite(0, 0, this.config.width, 180, "bg-sky-blue")
      .setOrigin(0, 0)
      .setDepth(-2)
      .setScrollFactor(0, 1);
    return {spikes, sky};
  }

  createLevelEnd({x, y}) {
    const levelEnd = this.physics.add.sprite(x, y, "end")
      .setAlpha(0)
      .setOrigin(0.5, 1)
      .setSize(5, this.config.height);
    return levelEnd;
  }

  createEntity({x, y}, Type) {
    const entity = new Type(this, x, y)
      .setBounded(true)
      .addCollider(this.map.layers.collision)
      .setOrigin(0.5, 1);
    entity.body.setGravityY(GRAVITY);
    return entity;
  }

  createEnemies(spawns) {
    const enemies = new Enemies(this);
    for (let spawn of spawns) {
      let enemy = this.createEntity(spawn, ENEMY_TYPES[spawn.type]);
      enemies.add(enemy);
    }
    return enemies;
  }

  createCollectables(layer) {
    const collectables = new Collectables(this);
    collectables.addFromLayer(layer);
    collectables.playAnimation("diamond-shine");
    return collectables;
  }

  createHud() {
    const scoreBoard = new Hud(this, 0 , 0);

    let anchor = [
      this.config.leftTopCorner.x + HUD_MARGIN,
      this.config.leftTopCorner.y + HUD_MARGIN
    ]
    const healthBar = new HealthBar(this, ...anchor, this.player.health);
    return { scoreBoard, healthBar };
  }

  createBackButton() {
    const {x, y} = this.config.rightBottomCorner;
    const btn = this.add.image(x, y, "back")
      .setOrigin(1)
      .setScrollFactor(0)
      .setScale(2)
      .setInteractive();

    btn.on("pointerup", () => this.scene.start("Menu"));
  }

  setupColliders() {
    this.player
      .addCollider(this.enemies, this.hit)
      .addCollider(this.enemies.projectiles, this.hit)
      .addCollider(this.map.layers.traps, this.hit)
      .addOverlap(this.collectables, this.collect, this)
      .addOverlap(this.levelEnd, this.win, this);
    this.enemies
      .addCollider(this.player.projectiles, this.hit)
      .addOverlap(this.player.meleeWeapon, this.hit);
  }

  setupCamera() {
    const {width, height, offset} = this.config;
    this.physics.world.setBounds(0, 0, (width + offset), height + 200);
    this.cameras.main.setBounds(0, 0, (width + offset), height)
      .setZoom(this.config.zoomFactor);
    this.cameras.main.startFollow(this.player);
  }

  setupEvents() {
    Emitter.on("GAME_OVER", this.gameOver.bind(this));
  }


  createSounds() {
    return {
      themeMusic: this.sound.add("theme-music", {loop: true, volume: 0.1}),
      pickup: this.sound.add("pickup", {volume: 0.2})
    }

  }

  update() {
    this.background.spikes.tilePositionX = this.cameras.main.scrollX * 0.3;
    this.background.sky.tilePositionX = this.cameras.main.scrollX * 0.1;
  }

  hit(target, source) {
    if (target.takesHit) {
      target.takesHit(source);
    }
    if (source.deliversHit) {
      source.deliversHit(target);
    }
  }

  collect(collector, collectable) {
    this.sfx.pickup.play();
    this.score += collectable.score;
    this.hud.scoreBoard.updateScoreBoard(this.score);
    collectable.disableBody(true, true);
  }

  win() {
    if (this.currentLevel >= this.config.levels) {
      this.scene.start("Credits");
    } else {
      if (this.currentLevel >= this.registry.get("progress")) {
        this.registry.inc("progress", 1);
      }
      this.registry.inc("level", 1);
      this.scene.restart({restart: true});
    }
  }

  gameOver() {
    this.scene.restart({restart: true});
  }

  get currentLevel() {
    return this.registry.get("level");
  }

}

export default Play;
