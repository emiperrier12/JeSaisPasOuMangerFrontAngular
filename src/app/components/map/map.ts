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
              const requestBody = { restaurantName: r.name };

              fetch('http://localhost:8080/api/menu', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
              })
              .then(res => res.json())
              .then((menuItems: any[]) => {
                if (!menuItems || menuItems.length === 0) {
                  marker.bindPopup(
                    `<b>${r.name}</b><br>${r.address}<br>${r.city}<hr><i>Aucun menu trouvé.</i>`
                  ).openPopup();
                  return;
                }

                const menuHtml = menuItems
                  .map(item => `<li>${item.dishName} — <b>${item.dishPrice}€</b></li>`)
                  .join('');

                marker.bindPopup(
                  `<b>${r.name}</b><br>${r.address}<br>${r.city}<hr><ul>${menuHtml}</ul>`
                ).openPopup();
              })
              .catch(err => {
                console.error('Erreur fetch menu:', err);
                marker.bindPopup(
                  `<b>${r.name}</b><br>${r.address}<br>${r.city}<hr><i>Erreur de chargement du menu.</i>`
                ).openPopup();
              });
            });
          }
        });
      })
      .catch(err => console.error('Erreur fetch restaurants:', err));
  }
}
