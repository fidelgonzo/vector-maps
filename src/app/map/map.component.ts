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
      center: [16.4, 48.2],
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

      this.addCustomMarkers();

    });

    // Handle errors
    this.map.on('error', (e) => {
      console.error('MapLibre Error:', e);
    });
  }

  addCustomMarkers(): void {
    // 1. Basic marker with popup
    const popup = new maplibregl.Popup({ offset: 25 })
    .setHTML('<h3>Simple Marker</h3><p>This is a basic marker with a popup.</p>');

    const marker = new maplibregl.Marker()
    .setLngLat([16.4, 48.2])
    .setPopup(popup)
    .addTo(this.map);

    // 2. Custom colored marker
    const redMarker = new maplibregl.Marker({
      color: '#ff0000'  // Red color
    })
    .setLngLat([16.41, 48.21])
    .setPopup(new maplibregl.Popup().setHTML('<h3>Red Marker</h3>'))
    .addTo(this.map);

    // 3. Custom HTML element marker
    const customElement = document.createElement('div');
    customElement.className = 'custom-marker';
    customElement.style.backgroundColor = '#3887be';
    customElement.style.width = '25px';
    customElement.style.height = '25px';
    customElement.style.borderRadius = '50%';
    customElement.style.border = '2px solid white';
    customElement.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';

    const customMarker = new maplibregl.Marker({
      element: customElement,
      anchor: 'bottom'
    })
    .setLngLat([-122.405, 37.785])
    .setPopup(new maplibregl.Popup().setHTML('<h3>Custom Element Marker</h3>'))
    .addTo(this.map);

    // 4. Draggable marker
    const draggableMarker = new maplibregl.Marker({
      color: '#50C878',  // Emerald green
      draggable: true   // Make it draggable
    })
    .setLngLat([16.43, 48.22])
    .addTo(this.map);

    // Listen for drag events
    draggableMarker.on('dragend', () => {
      const lngLat = draggableMarker.getLngLat();
      console.log(`Marker dropped at: ${lngLat.lng}, ${lngLat.lat}`);

      // Create a popup with the coordinates
      new maplibregl.Popup()
      .setLngLat(lngLat)
      .setHTML(`<p>New coordinates:<br>${lngLat.lng.toFixed(5)}, ${lngLat.lat.toFixed(5)}</p>`)
      .addTo(this.map);
    });

    // 5. Add multiple markers from data source
    const locations = [
      { name: "Location 1", lng: 16.425, lat: 48.775, color: "#9370DB" },  // Purple
      { name: "Location 2", lng: 16.415, lat: 48.792, color: "#FFA500" },  // Orange
      { name: "Location 3", lng: 16.395, lat: 48.782, color: "#008080" }   // Teal
    ];

    locations.forEach(location => {
      const popup = new maplibregl.Popup({ offset: 25 })
      .setHTML(`<h3>${location.name}</h3><p>Coordinates: ${location.lng}, ${location.lat}</p>`);

      new maplibregl.Marker({ color: location.color })
      .setLngLat([location.lng, location.lat])
      .setPopup(popup)
      .addTo(this.map);
    });
  }

}
