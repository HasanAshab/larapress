export default {
  default: "local",
  disks: {
    local: {
      driver: "local",
      root: base("storage"),
    },
  }
}