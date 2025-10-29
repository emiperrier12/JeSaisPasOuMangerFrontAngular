import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu implements OnChanges {


  @Input() restaurantName: string | null = null;
  @Input() restaurantCategory: string | null = null;
  @Output() closed = new EventEmitter<void>();

  menuItems: any[] = [];
  loading = false;
  error: string | null = null;

  dataRestaurant: any = {};

  ngOnChanges(): void {
    if (this.restaurantName) {
      this.loadMenu(this.restaurantName);
    } else {
      // Si restaurantName devient null, on réinitialise l'état
      this.menuItems = [];
      this.loading = false;
      this.error = null;
    }
  }

  loadMenu(name: string): void {
    if (!name) return;

    this.loading = true;
    this.error = null;
    this.menuItems = [];

    fetch('http://localhost:8080/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantName : name })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la récupération du menu');
        return res.json();
      })
      .then((data: any[]) => {
        this.menuItems = data;
        
    })
      .catch(err => {
        console.error('Erreur fetch menu:', err);
        this.error = 'Impossible de charger le menu';
      })
      .finally(() => {
        this.loading = false;
      });

    fetch('http://localhost:8080/api/getInformation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ restaurantName : name })
    })
    .then(res => {
      if (!res.ok) throw new Error('Erreur lors de la récupération des informations du restaurant');
      return res.json();
    }).then((data: any) => {
      this.dataRestaurant = data;
    })
  }

  
    

  closeMenu(): void {
    this.closed.emit(); // Préviens le parent de fermer le menu
  }

  convertToEmoji(category: string | null): string {
    switch(category) {
        case 'BURGER':
            return '🍔';

        default:
            return 'No Category'
    }
  }
}
