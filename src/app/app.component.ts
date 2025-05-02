import {Component} from '@angular/core';
import {MapComponent} from './map/map.component';
import {HttpClient} from '@angular/common/http';
import {NgxMapLibreGLModule} from '@maplibre/ngx-maplibre-gl';
import {NgxMapComponent} from './ngx-map/ngx-map.component';

@Component({
  selector: 'app-root',
  imports: [MapComponent, NgxMapLibreGLModule, NgxMapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ngx-leaflet';


  constructor(http: HttpClient) {
  }
}
