/**
 * Regenerates src/data/maps/world-network.svg.json
 * Run: node scripts/generate-world-map.mjs
 */
import fs from "node:fs";
import { feature } from "topojson-client";
import { geoEquirectangular, geoPath } from "d3-geo";

const countries50 = JSON.parse(
  fs.readFileSync("public/maps/countries-50m.json", "utf8"),
);
const countries110 = JSON.parse(
  fs.readFileSync("public/maps/countries-110m.json", "utf8"),
);
const landTopo = JSON.parse(
  fs.readFileSync("public/maps/land-110m.json", "utf8"),
);

const countriesHi = feature(countries50, countries50.objects.countries);
const countriesLo = feature(countries110, countries110.objects.countries);
const landFc = feature(landTopo, landTopo.objects.land);

const OFFICE_ISO = {
  840: "usa",
  528: "netherlands",
  792: "turkiye",
  784: "dubai",
};

const MARKET = new Set([
  276, 578, 752, 246, 208, 250, 56, 724, 380, 826, 616, 40, 756, 203, 348, 642, 100,
  300, 191, 705, 504, 12, 788, 818, 682, 368, 400, 422, 760, 364, 512, 48, 414,
  70, 8, 807, 499,
]);

/** Label anchors placed on the country body. */
const LABEL_LL = {
  usa: [-97.5, 39.5],
  netherlands: [5.3, 52.1],
  turkiye: [35.2, 39.0],
  dubai: [54.5, 24.4],
};

/** Counter-clockwise ring (required for correct d3 fitExtent). */
function ring(west, south, east, north) {
  return [
    [west, south],
    [west, north],
    [east, north],
    [east, south],
    [west, south],
  ];
}

function build({
  west,
  south,
  east,
  north,
  width,
  height,
  pad = 14,
  detail = "lo",
  officeKeys = null,
}) {
  const extent = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [ring(west, south, east, north)],
    },
  };

  const projection = geoEquirectangular().fitExtent(
    [
      [pad, pad],
      [width - pad, height - pad],
    ],
    extent,
  );
  const path = geoPath(projection);
  const countries = detail === "hi" ? countriesHi : countriesLo;

  const land = path(landFc);
  const offices = [];
  const markets = [];

  for (const country of countries.features) {
    const iso = Number(country.id);
    const d = path(country);
    if (!d) continue;
    const key = OFFICE_ISO[iso];
    if (key) {
      if (officeKeys && !officeKeys.includes(key)) continue;
      offices.push({ id: iso, key, d });
    }
  }

  for (const country of countriesLo.features) {
    const iso = Number(country.id);
    if (!MARKET.has(iso) || OFFICE_ISO[iso]) continue;
    const d = path(country);
    if (d) markets.push({ id: iso, d });
  }

  const keys = officeKeys ?? Object.values(OFFICE_ISO);
  const markers = keys.map((key) => {
    const [lon, lat] = LABEL_LL[key];
    const [x, y] = projection([lon, lat]);
    return {
      id: key,
      x: +x.toFixed(2),
      y: +y.toFixed(2),
      hq: key === "netherlands",
    };
  });

  return {
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    land,
    offices,
    markets,
    markers,
  };
}

const main = build({
  west: -118,
  south: 10,
  east: 65,
  north: 70,
  width: 1200,
  height: 540,
  pad: 10,
  detail: "lo",
});

const europe = build({
  west: -2,
  south: 46.8,
  east: 17.5,
  north: 55.2,
  width: 760,
  height: 560,
  pad: 20,
  detail: "hi",
  officeKeys: ["netherlands"],
});

const east = build({
  west: 24,
  south: 20,
  east: 60,
  north: 43,
  width: 760,
  height: 560,
  pad: 20,
  detail: "hi",
  officeKeys: ["turkiye", "dubai"],
});

fs.mkdirSync("src/data/maps", { recursive: true });
fs.writeFileSync(
  "src/data/maps/world-network.svg.json",
  JSON.stringify({ main, europe, east }),
);

console.log("main USA", main.markers.find((m) => m.id === "usa"));
console.log("europe", europe.markers);
console.log("east", east.markers);
console.log(
  "file kb",
  (fs.statSync("src/data/maps/world-network.svg.json").size / 1024).toFixed(1),
);
