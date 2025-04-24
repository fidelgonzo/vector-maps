// src/app/map/map.component.ts
import {Component, OnInit} from '@angular/core';
import {LeafletModule} from '@bluehalo/ngx-leaflet';
import {CommonModule} from '@angular/common';
import * as L from 'leaflet';
import 'leaflet.vectorgrid';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, LeafletModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  // Map configuration
  options: L.MapOptions = {
    layers: [],
    zoom: 12,
    center: L.latLng(48.27, 16.41)
  };

  map!: L.Map;
  vectorStyleUrl = 'http://localhost:8080/styles/basic-preview/style.json';

  ngOnInit(): void {
    // We'll initialize the vector layers after the map is ready
  }

  onMapReady(map: L.Map): void {
    this.map = map;

    // Add scale control
    L.control.scale().addTo(map);

    // Fetch and process the style.json to set up the vector tiles
    this.setupVectorTiles(map);
  }

  setupVectorTiles(map: L.Map): void {
    // Fetch the style.json from the TileServer-GL
    fetch(this.vectorStyleUrl)
    .then(response => response.json())
    .then(styleJson => {
      // Extract the tile source URL from the style.json
      const sources = styleJson.sources;
      const sourceKey = Object.keys(sources)[0]; // Usually 'openmaptiles' or similar
      const tileSource = sources[sourceKey];

      if (tileSource && tileSource.url) {
        console.log('Using TileJSON URL:', tileSource.url);
        // Fetch the TileJSON to get tile URLs
        fetch(tileSource.url)
        .then(response => response.json())
        .then(tileJson => {
          this.addVectorTileLayer(map, tileJson, styleJson);
        });
      } else if (tileSource && tileSource.tiles) {
        // If the tiles array is directly specified
        this.addVectorTileLayer(map, tileSource, styleJson);
      } else {
        console.error('Could not find tile source in style.json');
      }
    })
    .catch(error => {
      console.error('Error fetching style.json:', error);
    });
  }

  addVectorTileLayer(map: L.Map, tileSource: any, styleJson: any): void {
    const tileUrls = tileSource.tiles || [tileSource.url];

    // Create vector tile layer using leaflet.vectorgrid
    // @ts-ignore - VectorGrid might not be well-typed
    const vectorGrid = L.vectorGrid.protobuf(tileUrls[0], {
      // @ts-ignore
      rendererFactory: L.canvas.tile,
      vectorTileLayerStyles: this.generateVectorTileStyles(styleJson),
      maxZoom: tileSource.maxzoom || 18,
      minZoom: tileSource.minzoom || 0,
      attribution: styleJson.attribution || '© MapTiler'
    });

    vectorGrid.addTo(map);
  }

  generateVectorTileStyles(styleJson: any): any {
    // This is a simplified conversion of MapBox GL styles to VectorGrid styles
    const vectorStyles: any = {};

    // Process each layer in the style
    if (styleJson.layers) {
      styleJson.layers.forEach((layer: any) => {
        if (layer.type === 'fill' || layer.type === 'line' || layer.type === 'circle') {
          // Extract source-layer which is the layer name in vector tiles
          const sourceLayer = layer['source-layer'];

          if (!vectorStyles[sourceLayer]) {
            vectorStyles[sourceLayer] = {};
          }

          // Create a simple style function
          vectorStyles[sourceLayer] = (properties: any) => {
            // Simple style conversion
            return {
              weight: layer.paint ? (layer.paint['line-width'] || 1) : 1,
              color: layer.paint ? (layer.paint['line-color'] || '#3388ff') : '#3388ff',
              opacity: layer.paint ? (layer.paint['line-opacity'] || 1) : 1,
              fill: true,
              fillColor: layer.paint ? (layer.paint['fill-color'] || '#3388ff') : '#3388ff',
              fillOpacity: layer.paint ? (layer.paint['fill-opacity'] || 0.2) : 0.2,
              radius: layer.paint ? (layer.paint['circle-radius'] || 5) : 5
            };
          };
        }
      });
    }

    return vectorStyles;
  }
}
