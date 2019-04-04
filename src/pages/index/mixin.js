export default {
  created() {
    console.log('created', 2)
  },
  onShow() {
    console.log('onShow', this)
    this.refreshData();
  }
}