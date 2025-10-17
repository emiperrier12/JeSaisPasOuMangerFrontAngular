import { AfterViewInit, Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Menu } from "../menu/menu";


@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
  imports: [CommonModule, Menu]
})
export class Map implements AfterViewInit {

  selectedRestaurant: string | null = null;
  selectedRestaurantCategory: string | null = null;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    // Création de la carte
    const map = L.map('map').setView([45.783954, 4.869893], 17);

    // Ajout des tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 25,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Marqueur statique (exemple)
    L.marker([45.783954, 4.869893])
      .addTo(map)
      .bindPopup('Mon École')
      .openPopup();

    // Chargement des restaurants depuis le backend Spring
    fetch('http://localhost:8080/api/restaurants')
      .then(res => res.json())
      .then(data => {
        data.forEach((r: any) => {
          if (r.latitude && r.longitude) {
            const marker = L.marker([r.latitude, r.longitude]).addTo(map);

            // 1️⃣ Affichage du tooltip au survol
            marker.bindTooltip(
              `<b>${r.name}</b><br>${r.address}<br>${r.city}`,
              { direction: 'top' }
            );

            // 2️⃣ Requête sur le nom du restaurant au clic
            marker.on('click', () => {
              this.ngZone.run(() => {
                this.selectedRestaurant = r.name;
                this.selectedRestaurantCategory = r.category;
              });
            });
          }
        });
      })
      .catch(err => console.error('Erreur fetch restaurants:', err));
  }
}
