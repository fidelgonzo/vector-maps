import {AfterViewInit, ChangeDetectorRef, Component, signal, ViewContainerRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapService} from './map.service';
import {LeafletModule} from '@bluehalo/ngx-leaflet';
import {latLng, tileLayer} from 'leaflet';
import 'leaflet.vectorgrid';
import L from 'leaflet';

const markerIconSvgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 384 511">
        <path fill="{mapIconColor}" d="M384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2C117 435 0 279.4 0 192C0 86 86 0 192 0C298 0 384 86 384 192Z"/>
        <path fill="white" fill-rule="evenodd" clip-rule="evenodd" d="M244.69 64.1513C244.69 58.5449 240.145 54 234.539 54H233.089C227.482 54 222.937 58.5449 222.937 64.1513V85.9041C222.937 86.3964 222.972 86.8806 223.04 87.3542H205.916C205.983 86.8806 206.018 86.3964 206.018 85.9041V64.1513C206.018 58.5449 201.474 54 195.867 54H194.417C188.811 54 184.266 58.5449 184.266 64.1513V85.9041C184.266 86.3964 184.301 86.8806 184.368 87.3542H167.244C167.312 86.8806 167.347 86.3964 167.347 85.9041V64.1513C167.347 58.5449 162.802 54 157.196 54H155.745C150.139 54 145.594 58.5449 145.594 64.1513V85.9041C145.594 86.3964 145.629 86.8806 145.697 87.3542H121.908C107.224 87.3542 95.321 99.2575 95.321 113.941V134.533C94.5464 134.344 93.737 134.244 92.9041 134.244H71.1513C65.5449 134.244 61 138.788 61 144.395V145.845C61 151.451 65.5449 155.996 71.1513 155.996H92.9041C93.737 155.996 94.5464 155.896 95.321 155.707V173.205C94.5464 173.015 93.737 172.915 92.9041 172.915H71.1513C65.5449 172.915 61 177.46 61 183.066V184.517C61 190.123 65.5449 194.668 71.1513 194.668H92.9041C93.737 194.668 94.5464 194.568 95.321 194.378V211.876C94.5464 211.687 93.737 211.587 92.9041 211.587H71.1513C65.5449 211.587 61 216.132 61 221.738V223.188C61 228.795 65.5449 233.339 71.1513 233.339H92.9041C93.737 233.339 94.5464 233.239 95.321 233.05V254.125C95.321 268.809 107.224 280.712 121.908 280.712H145.214C145.146 281.186 145.111 281.67 145.111 282.162V303.915C145.111 309.521 149.656 314.066 155.262 314.066H156.712C162.319 314.066 166.863 309.521 166.863 303.915V282.162C166.863 281.67 166.828 281.186 166.761 280.712H183.885C183.817 281.186 183.782 281.67 183.782 282.162V303.915C183.782 309.521 188.327 314.066 193.934 314.066H195.384C200.99 314.066 205.535 309.521 205.535 303.915V282.162C205.535 281.67 205.5 281.186 205.432 280.712H222.557C222.489 281.186 222.454 281.67 222.454 282.162V303.915C222.454 309.521 226.999 314.066 232.605 314.066H234.055C239.662 314.066 244.207 309.521 244.207 303.915V282.162C244.207 281.67 244.172 281.186 244.104 280.712H262.092C276.776 280.712 288.679 268.809 288.679 254.125V233.05C289.454 233.239 290.263 233.339 291.096 233.339H312.849C318.455 233.339 323 228.795 323 223.188V221.738C323 216.132 318.455 211.587 312.849 211.587H291.096C290.263 211.587 289.454 211.687 288.679 211.876V194.378C289.454 194.568 290.263 194.668 291.096 194.668H312.849C318.455 194.668 323 190.123 323 184.517V183.066C323 177.46 318.455 172.915 312.849 172.915H291.096C290.263 172.915 289.454 173.015 288.679 173.205V155.707C289.454 155.896 290.263 155.996 291.096 155.996H312.849C318.455 155.996 323 151.451 323 145.845V144.395C323 138.788 318.455 134.244 312.849 134.244H291.096C290.263 134.244 289.454 134.344 288.679 134.533V113.941C288.679 99.2575 276.776 87.3542 262.092 87.3542H244.587C244.655 86.8806 244.69 86.3964 244.69 85.9041V64.1513ZM137.86 116.358C130.385 116.358 124.325 122.418 124.325 129.893V238.173C124.325 245.649 130.385 251.708 137.86 251.708H246.14C253.615 251.708 259.675 245.649 259.675 238.173V129.893C259.675 122.418 253.615 116.358 246.14 116.358H137.86Z"/>
        <path fill="white" d="M146.077 138.111C146.077 136.776 147.16 135.694 148.494 135.694H235.506C236.84 135.694 237.923 136.776 237.923 138.111V225.122C237.923 226.457 236.84 227.539 235.506 227.539H148.494C147.16 227.539 146.077 226.457 146.077 225.122V138.111Z"/>
      </svg>
`;

const workplaceIconSvgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 384 511">
  <path fill="{mapIconColor}" d="M384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2C117 435 0 279.4 0 192C0 86 86 0 192 0C298 0 384 86 384 192Z"/>
  <!-- Image 2 (scaled and centered) -->
  <path class="icon" fill="white"  d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
    transform="translate(80, 80) scale(0.4)"/>
      </svg>
`;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, LeafletModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  readonly MAP_CONTAINER_ID = 'map-view';

  vectorStyleUrl = 'http://localhost:8080/styles/basic-preview/style.json';

  constructor(
    private mapService: MapService,
    // private mapFiltersService: MapFiltersService,
    // private mapItemsService: MapItemsService,
    // private mapConfigService: MapConfigService,
    private cdr: ChangeDetectorRef,
    // private mapMouseHandlers: MapMouseEventsService,
    private viewContainerRef: ViewContainerRef,
  ) {
  }

  map!: L.Map;

  options = {
    layers: [
      // tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 8,
    center: latLng(48.7, 14.7)
  };

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
    const vectorStyles: any = {};

    // Process each layer in the style
    if (styleJson.layers) {
      styleJson.layers.forEach((layer: any) => {
        if (!layer.source || !layer['source-layer']) return;

        const sourceLayer = layer['source-layer'];

        if (!vectorStyles[sourceLayer]) {
          vectorStyles[sourceLayer] = {};
        }

        // Create a style function based on layer type
        vectorStyles[sourceLayer] = (properties: any) => {
          // Apply filter if present
          if (layer.filter) {
            // Simple filter implementation (can be expanded)
            const match = this.evaluateFilter(layer.filter, properties);
            if (!match) {
              // return null; // Skip this feature
            }
          }

          let style: any = {};

          switch (layer.type) {
            case 'fill':
              style = {
                fill: true,
                fillColor: this.getPropertyValue(layer.paint, 'fill-color', properties, '#3388ff'),
                fillOpacity: this.getPropertyValue(layer.paint, 'fill-opacity', properties, 0.2),
                stroke: layer.paint && layer.paint['fill-outline-color'] ? true : false,
                color: this.getPropertyValue(layer.paint, 'fill-outline-color', properties, '#3388ff'),
                weight: 1
              };
              break;

            case 'line':
              style = {
                stroke: true,
                color: this.getPropertyValue(layer.paint, 'line-color', properties, '#3388ff'),
                weight: this.getPropertyValue(layer.paint, 'line-width', properties, 1),
                opacity: this.getPropertyValue(layer.paint, 'line-opacity', properties, 1),
                lineCap: layer.paint ? (layer.paint['line-cap'] || 'butt') : 'butt',
                lineJoin: layer.paint ? (layer.paint['line-join'] || 'miter') : 'miter',
                dashArray: layer.paint && layer.paint['line-dasharray'] ?
                  layer.paint['line-dasharray'].join(',') : null,
                fill: false
              };
              break;

            case 'circle':
              style = {
                radius: this.getPropertyValue(layer.paint, 'circle-radius', properties, 5),
                fillColor: this.getPropertyValue(layer.paint, 'circle-color', properties, '#3388ff'),
                fillOpacity: this.getPropertyValue(layer.paint, 'circle-opacity', properties, 0.6),
                stroke: true,
                color: '#fff',
                weight: 1,
                opacity: 0.5
              };
              break;

            case 'symbol':
              // Basic support for symbol layers (text and icons)
              style = {
                icon: layer.layout && layer.layout['icon-image'] ? true : false,
                iconUrl: layer.layout ? layer.layout['icon-image'] : null,
                text: properties[layer.layout ? layer.layout['text-field'] : null],
                textColor: this.getPropertyValue(layer.paint, 'text-color', properties, '#333'),
                textSize: layer.layout ? (layer.layout['text-size'] || 12) : 12,
                textAlign: layer.layout ? (layer.layout['text-anchor'] || 'center') : 'center'
              };
              break;
          }

          return style;
        };
      });
    }

    return vectorStyles;
  }

// Helper method to evaluate property values (including data-driven styling)
  private getPropertyValue(paint: any, property: string, featureProps: any, defaultValue: any): any {
    if (!paint || !paint[property]) return defaultValue;

    const value = paint[property];

    // Handle data-driven styling (very simplified)
    if (typeof value === 'object' && value.type === 'identity') {
      return featureProps[value.property] || defaultValue;
    }

    if (typeof value === 'object' && value.stops) {
      // Very simple stops implementation
      // In a real app, you'd interpolate based on zoom and/or property value
      return value.stops[0][1];
    }

    return value;
  }

// Simple filter evaluation
  private evaluateFilter(filter: any[], properties: any): boolean {
    if (!filter || !Array.isArray(filter)) return true;

    // Very simplified filter evaluation
    // Only handling a few basic cases
    const operator = filter[0];

    if (operator === '==') {
      const [_, key, value] = filter;
      return properties[key] === value;
    }

    if (operator === '!=') {
      const [_, key, value] = filter;
      return properties[key] !== value;
    }

    if (operator === 'in') {
      const key = filter[1];
      const values = filter.slice(2);
      return values.includes(properties[key]);
    }

    if (operator === '!in') {
      const key = filter[1];
      const values = filter.slice(2);
      return !values.includes(properties[key]);
    }

    if (operator === 'all') {
      return filter.slice(1).every(subfilter => this.evaluateFilter(subfilter, properties));
    }

    if (operator === 'any') {
      return filter.slice(1).some(subfilter => this.evaluateFilter(subfilter, properties));
    }

    if (operator === 'none') {
      return !filter.slice(1).some(subfilter => this.evaluateFilter(subfilter, properties));
    }

    return true;
  }


  isConfigsSidebarOpen = signal(true);

  ngAfterViewInit() {
    this.mapService.initializeMap(this.MAP_CONTAINER_ID);
    // this.mapMouseHandlers.initializeHandlers();
    // this.mapItemsService.showDevicesAndWorkplaces();
    // this.mapConfigService.isEditMode.set(false);
    // this.mapConfigService.loadActiveConfiguration();
    this.cdr.detectChanges();
    // LeafletTooltipService.setViewContainerRef(this.viewContainerRef);
  }

  ngOnDestroy(): void {
    this.mapService.map.off();
    this.mapService.map.remove();
  }

  onFiltersButtonClick(event: Event) {
    event.stopPropagation();
    // this.mapFiltersService.handleToggleIsFilterOpen();
  }
}
