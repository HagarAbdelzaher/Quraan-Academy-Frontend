import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {

  email: string = "";
  constructor(private _authService: AuthService, private toastr: ToastrService) {
    this._authService.currentUser$.subscribe({
      next: (data: any) => {
        this.email = data?.email;
      },
      error: (error : any) => {
        let {error : {message}}  = error;
        if(!message) message = error.error.error;
        this.toastr.error(`${message}`,'Error');
      }
    })
  }
  logOut() {
    this._authService.logout();
    this.email = '';
  }

  toggleMenu() {
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar?.classList.contains('active')) {
      sidebar?.classList.remove('active');
    } else {
      sidebar?.classList.add('active');
    }
    const sidebarLists = document.querySelectorAll('.admin-sidebar-list');

    sidebarLists.forEach(sidebarList => {
      if (sidebarList.classList.contains('active')) {
        sidebarList.classList.remove('active');
      } else {
        sidebarList.classList.add('active');
      }
    });
  }
}
