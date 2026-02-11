import { Component, OnInit } from '@angular/core';
import { supabase } from 'src/app/services/superbase/superbase';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { EditProfilePage } from '../edit-profile/edit-profile.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: any = null;
  orders: any[] = [];
  loading = true;
  constructor(private modalCtrl: ModalController) {}
  async ngOnInit() {
    await this.loadProfile();
    await this.loadOrders();
    this.loading = false;
  }

  async loadProfile() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error(error);
      return;
    }

    this.user = user;
  }

  async loadOrders() {
    if (!this.user) return;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', this.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    this.orders = data || [];
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  async openEditModal() {
    const modal = await this.modalCtrl.create({
      component: EditProfilePage,
      componentProps: {
        user: this.user,
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.updated) {
      await this.loadProfile(); // Refresh profile
    }
  }

  async logout() {
    await supabase.auth.signOut();
    location.href = '/login';
  }
}
