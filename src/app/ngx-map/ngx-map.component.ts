import {Component} from '@angular/core';
import {MapComponent} from '@maplibre/ngx-maplibre-gl';
import maplibregl from 'maplibre-gl';
import {addClusters} from '../map/services/clusters.service';

@Component({
  selector: 'app-ngx-map',
  imports: [
    MapComponent
  ],
  templateUrl: './ngx-map.component.html',
  styleUrl: './ngx-map.component.scss'
})
export class NgxMapComponent {

  vectorStyleUrl = 'http://localhost:8090/styles/basic-preview/style.json';

  public map: maplibregl.Map | undefined;

  onMapLoad(map: maplibregl.Map): void {
    this.map = map; // Save the map instance for later use
    console.log('Map initialized and loaded:', map);

    // Generate and add markers
    this.addMarkers(this.generateMarkers());

    addClusters(this.map);

  }

  addMarkers(markers: GeoJSON.Feature[]): void {
    if (!this.map) return;

    markers.forEach((marker) => {
      const {coordinates} = marker.geometry as GeoJSON.Point;

      // Create and add marker to map
      new maplibregl.Marker()
      .setLngLat(coordinates as any)
      .addTo(this.map!);
    });
  }


  generateMarkers(): GeoJSON.Feature[] {
    const predefinedMarkers = [
      {type: "Feature", geometry: {type: 'Point', coordinates: [16.3738, 48.2082]}, properties: {}}, // Vienna
      {type: "Feature", geometry: {type: 'Point', coordinates: [16.385, 48.215]}, properties: {}},   // Nearby point
      {type: "Feature", geometry: {type: 'Point', coordinates: [16.4, 48.2]}, properties: {}},       // Nearby point
      {type: "Feature", geometry: {type: 'Point', coordinates: [16.35, 48.22]}, properties: {}},     // Another point
      {type: "Feature", geometry: {type: 'Point', coordinates: [16.5, 48.25]}, properties: {}},      // Another point
      {type: "Feature", geometry: {type: 'Point', coordinates: [16.6, 48.15]}, properties: {}}       // Farther away
    ];

    // Generate 30 additional random markers
    const randomMarkers = Array.from({length: 30}, () => {
      const randomLng = 16.2 + Math.random() * 0.4; // Longitude between 16.2 and 16.6
      const randomLat = 48.1 + Math.random() * 0.2; // Latitude between 48.1 and 48.3

      return {
        type: 'Feature',
        properties: {},
        geometry: {type: 'Point', coordinates: [randomLng, randomLat]}
      };
    });
    return [...predefinedMarkers, ...randomMarkers as any];
  }

}
