class OrderHelper {
  decimalPrice(price) {
    return `${Number(price) / 100}`;
  }

  haversine_distance(location1, location2) {
    if (location1 && location2) {
      const R = 6371.0710
      var rlat1 = location1.latitude * (Math.PI / 180);
      var rlat2 = location2.latitude * (Math.PI / 180);
      var difflat = (rlat2 - rlat1)
      var difflon = (location2.longitude - location1.longitude) * (Math.PI / 180);
      const a = Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2))
      const d = 2 * R * Math.asin(a);
      return Number(d).toFixed(1);
    } else {
      console.log("Haversine distance", location1, location2)
      return 0
    }

  }

}

module.exports = new OrderHelper()
