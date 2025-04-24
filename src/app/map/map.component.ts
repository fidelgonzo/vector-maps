// src/app/map/map.component.ts
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="map-container" #mapContainer></div>`,
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  map!: maplibregl.Map;
  vectorStyleUrl = 'http://localhost:8080/styles/basic-preview/style.json';

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: this.vectorStyleUrl,  // Direct use of the style.json
      center: [16.4, 48.2],  // San Francisco
      zoom: 10
    });

    // Add navigation controls
    this.map.addControl(new maplibregl.NavigationControl());

    // Add scale
    this.map.addControl(new maplibregl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    }));

    // Map load event
    this.map.on('load', () => {
      console.log('Map loaded successfully');
    });

    // Handle errors
    this.map.on('error', (e) => {
      console.error('MapLibre Error:', e);
    });
  }
}
