import * as maplibregl from 'maplibre-gl';

/**
 * Function to add clusters to the map
 */
export function addClusters(map: maplibregl.Map): void {
  const clusterSource = 'cluster-source';

  // Example GeoJSON data with Points
  const geojsonPoints = {
    type: 'FeatureCollection',
    features: [
      {type: 'Feature', geometry: {type: 'Point', coordinates: [16.3738, 48.2082]}}, // Vienna
      {type: 'Feature', geometry: {type: 'Point', coordinates: [16.385, 48.215]}},   // Nearby point
      {type: 'Feature', geometry: {type: 'Point', coordinates: [16.4, 48.2]}},       // Nearby point
      {type: 'Feature', geometry: {type: 'Point', coordinates: [16.35, 48.22]}},     // Another point
      {type: 'Feature', geometry: {type: 'Point', coordinates: [16.5, 48.25]}},      // Another point
      {type: 'Feature', geometry: {type: 'Point', coordinates: [16.6, 48.15]}},      // Farther away,
      ...generatePointsAroundVienna(300)
    ]
  };

  // Add the GeoJSON source with clustering enabled
  map.addSource(clusterSource, {
    type: 'geojson',
    // @ts-ignore
    data: geojsonPoints,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points (equals or below this zoom level points will cluster)
    clusterRadius: 50 // Radius of each cluster when calculating clusters (in px)
  });

  // Add a circle layer for clusters
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: clusterSource,
    filter: ['has', 'point_count'], // Only show clusters
    paint: {
      // Cluster color based on number of points in cluster
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6', // Color for clusters with 2-10 points
        10,
        '#f1f075', // Color for clusters with 11-50 points
        50,
        '#f28cb1'  // Color for clusters with more than 50 points
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        15, // Radius for clusters with 0-10 points
        10,
        20, // Radius for clusters with 11-50 points
        50,
        25  // Radius for clusters with more than 50 points
      ]
    }
  });

  // Add a layer for cluster count labels
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: clusterSource,
    filter: ['has', 'point_count'], // Only show cluster counts for clusters
    layout: {
      'text-field': '{point_count_abbreviated}', // Number of points in cluster
      'text-font': ['Noto Sans Regular'],
      'text-size': 12
    },
    paint: {
      'text-color': '#000'
    }
  });

  // Add a layer for individual points (not clustered)
  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: clusterSource,
    filter: ['!', ['has', 'point_count']], // Show only unclustered points
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 8,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  // Zoom into clusters when clicked
  // map.on('click', 'clusters', (e) => {
  //   const features = map.queryRenderedFeatures(e.point, {
  //     layers: ['clusters']
  //   });
  //
  //   // @ts-ignore
  //   const clusterId = features[0].properties?.cluster_id;
  //   if (clusterId) {
  //     // @ts-ignore
  //     map.getSource(clusterSource)?.getClusterExpansionZoom(clusterId, (err: any, zoom: any) => {
  //       if (!err) {
  //         map.easeTo({
  //           // @ts-ignore
  //           center: features[0].geometry.coordinates,
  //           zoom
  //         });
  //       }
  //     });
  //   }
  // });

  // inspect a cluster on click
  map.on('click', 'clusters', async (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters']
    });
    // @ts-ignore
    const clusterId = features[0].properties.cluster_id;
    // @ts-ignore
    const zoom = await map.getSource(clusterSource).getClusterExpansionZoom(clusterId);
    map.easeTo({
      // @ts-ignore
      center: features[0].geometry.coordinates,
      zoom
    });
  });


  // Show a popup for individual points on click
  map.on('click', 'unclustered-point', (e) => {
    const coordinates = (e.features![0].geometry as any).coordinates.slice();
    const description = 'Individual point data';

    // Ensure that if the map is zoomed out, the popup location stays correct
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new maplibregl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
  });

  // Change cursor to pointer when hovering over a cluster
  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Reset cursor when leaving cluster
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });
}

/**
 * Generate random features around Vienna
 */
function generatePointsAroundVienna(count: number): any[] {
  const points = [];

  for (let i = 0; i < count; i++) {
    const randomLng = 16.2 + Math.random() * 0.4; // Longitudes between 16.2 and 16.6
    const randomLat = 48.1 + Math.random() * 0.2; // Latitudes between 48.1 and 48.3

    points.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [randomLng, randomLat]
      }
    });
  }

  return points;
}
