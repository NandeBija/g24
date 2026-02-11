import { Component, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { supabase } from 'src/app/services/superbase/superbase';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: false,
})
export class EditProfilePage {
  @Input() user: any;

  fullName = '';
  phone = '';
  loading = false;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.fullName = this.user?.user_metadata?.full_name || '';
    this.phone = this.user?.user_metadata?.phone || '';
  }

  async save() {
    this.loading = true;

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: this.fullName,
        phone: this.phone,
      },
    });

    this.loading = false;

    if (error) {
      this.showError(error.message);
      return;
    }

    this.modalCtrl.dismiss({ updated: true });
  }

  async showError(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
