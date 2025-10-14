import { Component } from '@angular/core';
import { Map } from './components/map/map';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Map],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'JeSaisPasOuMangerFront';
}
