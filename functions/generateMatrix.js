// process data
const convertRawDataToMatrix = data => {
  const matrixSize = {
    x: 50,
    y: 50
  };
  const bounds = {
    topLeft: {
      lat: 35.726635,
      lng: 139.67941
    },
    bottomRight: {
      lat: 35.64497384,
      lng: 139.7787656
    }
  };

  const boundsDummy = {
    topLeft: {
      lat: 35.53,
      lng: 139.68
    },
    bottomRight: {
      lat: 36.78,
      lng: 139.81
    }
  };

  const locs = data.map(v => v.location);

  // returns -1,-1 if either lat or lng is outside of bounds
  const mapLatLngToBounds = (lat, lng, x = 50, y = 50, bbox = bounds) => {
    const remap = (value, fromLow, fromHigh, toLow, toHigh) => {
      return (
        toLow + ((toHigh - toLow) * (value - fromLow)) / (fromHigh - fromLow)
      );
    };
    const remapCoord = (value, coordRange, outputRange) =>
      remap(
        value,
        coordRange[0],
        coordRange[1],
        outputRange[0],
        outputRange[1]
      );

    let result = { lat: undefined, lng: undefined };

    const rangeLat = [bbox.topLeft.lat, bbox.bottomRight.lat];
    const rangeLng = [bbox.topLeft.lng, bbox.bottomRight.lng];

    // if outside bounds, fill with -1
    const within = (value, range) => value >= range[0] && value <= range[1];
    if (!within(lat, rangeLat) || !within(lng, rangeLng))
      return { lat: -1, lng: -1 };

    // remaps lat lng from raw data to 0-49 (array of 50)
    result.lat = remapCoord(lat, rangeLat, [0, x - 1]);
    result.lng = remapCoord(lng, rangeLng, [0, y - 1]);

    return result;
  };

  // map all coordinates to integers 0-50
  const mapped = locs.map(c => {
    const m = mapLatLngToBounds(c.lat, c.lng, matrixSize.x, matrixSize.y);
    return { y: Math.round(m.lat), x: Math.round(m.lng) };
  });

  // not used, but fun
  const bin = (data, numBins) => {
    // https://www.answerminer.com/blog/binning-guide-ideal-histogram
    const maxVal = Math.max(data);
    const minVal = Math.min(data);
    const binWidth = numBins;

    return Math.ceil((maxVal - minVal) / binWidth);
  };

  // not a matrix, but a list of items to fill
  const randomMapped = Array.from({ length: 100 }).map(_ => ({
    x: Math.round(Math.random() * 49),
    y: Math.round(Math.random() * 49)
  }));

  // https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript
  const cleanDuplicates = data =>
    data.filter(
      (d, i) => i === data.findIndex(v => v.x === d.x && v.y === d.y)
    );

  const createEmptyArray = (x = 50, y = 50, fill = 0) => {
    return Array.from({ length: y }).map(_ =>
      Array.from({ length: x }).fill(fill)
    );
  };

  const cleaned = cleanDuplicates(mapped);

  // array[y][x]
  // let empty = createEmptyArray();
  // empty[0][0] = 100;

  const buildOriginalDepartureMaps = userCoordsData => {
    // the one that the user promises to reduce
    // [[0,0,0,0,-1,-1,-1,0,0,0], [0,-1,-1,0,0,0]]
    let arr = createEmptyArray(matrixSize.x, matrixSize.y, 0);
    userCoordsData.map(coord => (arr[coord.y][coord.x] = 1));

    return arr;
  };

  const newMap = buildOriginalDepartureMaps(cleaned);

  const buildOffPeakDepartureMaps = () => {
    // the one that is currently tracking
    // [[0,0,0,0,1,1,1,0,0,0], [0,1,1,0,0,0]]
    return [[], []];
  };

  return newMap;
};

module.exports = convertRawDataToMatrix;
