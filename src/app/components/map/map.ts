import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})
export class Map implements AfterViewInit {

  ngAfterViewInit(): void {
    // Création de la carte
    const map = L.map('map').setView([45.783954, 4.869893], 19);

    // Ajout des tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 25,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Marqueur statique (ex : ton école)
    L.marker([45.783954, 4.869893])
      .addTo(map)
      .bindPopup('Mon École')
      .openPopup();

    // Chargement dynamique des restaurants depuis ton backend Spring
    fetch('http://localhost:8080/api/restaurants')
      .then(res => res.json())
      .then(data => {
        data.forEach((r: any) => {
          if (r.latitude && r.longitude) {
            L.marker([r.latitude, r.longitude])
              .addTo(map)
              .bindPopup(`<b>${r.name}</b><br>${r.address}<br>${r.city}`);
          }
        });
      })
      .catch(err => console.error('Erreur fetch restaurants:', err));
  }
}
