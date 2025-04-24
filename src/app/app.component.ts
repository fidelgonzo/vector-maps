import {Component} from '@angular/core';
import {MapComponent} from './map/map.component';
import {LeafletModule} from '@bluehalo/ngx-leaflet';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [MapComponent, LeafletModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ngx-leaflet';


  constructor(http: HttpClient) {
  }
}
