import {Injectable} from '@angular/core';
import * as L from 'leaflet';
import {MapOptions} from 'leaflet';

declare module 'leaflet' {
  interface Map {
    contextmenu: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private mapInstance: L.Map | null = null;

  constructor() {
  }

  private setMap(map: L.Map) {
    this.mapInstance = map;
  }

  getMap(): L.Map | null {
    return this.mapInstance;
  }

  get map(): L.Map {
    if (!this.mapInstance) {
      throw new Error('Map instance is not initialized yet.');
    }
    return this.mapInstance;
  }

  public initializeMap(mapElementId: string) {
    const map = L.map(mapElementId, {
      contextmenu: true,
      contextmenuItems: [],
    } as MapOptions);
    map.addLayer(
      L.tileLayer('/map/tiles/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        opacity: 1,
      }),
    );
    map.attributionControl.setPrefix('');
    this.configureZoomControl(map);
    this.setProjectArea(map);
    this.setMap(map);

    // var geoJsonDocument = {
    //   type: 'FeatureCollection',
    //   features: [ ... ]
    // };
    // L.vectorGrid.slicer(geoJsonDocument, {
    //   vectorTileLayerStyles: {
    //     sliced: { ... }
    //   }
    // }).addTo(map);


  }

  private setProjectArea(map: L.Map) {

    //TODO
    // this.projectConfigService.getMapProjectArea().subscribe((projectArea: ProjectArea) => {
    //   if (projectArea) {
    //     const { latitude, longitude } = projectArea.position;
    //     map.setView([latitude, longitude], projectArea.zoomLevel);
    //   }
    // });
  }

  private configureZoomControl(map: L.Map) {
    map.removeControl(map.zoomControl);
    L.control
    .zoom({
      zoomInTitle: `Zoom In`,
      zoomOutTitle: `:@@map.zoomOut:Zoom Out`,
      position: 'topleft',
    })
    .addTo(map);
  }
}
