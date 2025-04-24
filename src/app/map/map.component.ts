// src/app/map/map.component.ts
import {Component, inject, NgZone, OnInit} from '@angular/core';
import {LeafletModule} from '@bluehalo/ngx-leaflet';
import {CommonModule} from '@angular/common';
import * as L from 'leaflet';
import {HttpClient} from '@angular/common/http';

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
    layers: [
      // We'll initialize layers in ngOnInit
    ],
    zoom: 13,
    center: L.latLng(16.77, 48.41)
  };

  vectorLayer!: L.TileLayer;
  // vtLayer!: L.TileLayer;
  map!: L.Map;

  http = inject(HttpClient);

  constructor(private zone: NgZone) {
  }

  ngOnInit(): void {
    // Create vector tile layer
    this.vectorLayer = L.tileLayer('http://localhost:8080/styles/basic-preview/style.json', {
      maxZoom: 18,
      attribution: '© <a href="https://www.maptiler.com/copyright">MapTiler</a>',
    });

    // Add the layer to options
    this.options.layers = [this.vectorLayer];
  }

  loadGeojson() {
    this.http.get("http://localhost:8080/styles/basic-preview/style.json").subscribe(result => {
      this.vectorLayer = L.vectorGrid.slicer(result, {
        zIndex: 1000
      });
      this.vectorLayer.addTo(this.map);
    });
  }

  addVector() {
    this.zone.runOutsideAngular(() => {
      L.vectorGrid.protobuf("http://localhost:8080/styles/basic-preview/style.json", {
        // vectorTileLayerStyles: {
        //   cities: (properties:any, zoom:any) =>
        //     this.stylingFunction(properties, zoom, 'polygon'),
        //   'cities-point': (properties, zoom) =>
        //     this.stylingFunction(properties, zoom, 'point'),
        //   departments: (properties, zoom) =>
        //     this.stylingFunction(properties, zoom, 'polygon')
        // }
      }).addTo(this.map);
    });
  }

  onMapReady(map: L.Map): void {
    this.map = map;

    // You can add additional map controls or layers here
    L.control.scale().addTo(map);

    this.addVector();
  }
}
