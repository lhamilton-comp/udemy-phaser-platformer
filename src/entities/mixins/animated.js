const animated = {
  isPlayingAnim: function(key) {
   return (this.anims.isPlaying && this.anims.getCurrentKey() == key);
 }
}

export default animated;
