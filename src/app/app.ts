import { Component } from '@angular/core';
import { MapComponent } from './components/map/map';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'JeSaisPasOuMangerFront';
}
