import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/userModel';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { UserManagementService } from '../../services/users/user-management.service';
import { SnackbarService } from '../../services/popup/snackbar.service';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrl: './show-users.component.css'
})
export class ShowUsersComponent implements OnInit {

  public userData: UserModel[] = [];
  displayedColumns: string[] = ['index', 'displayName', 'email', 'roles'];

  constructor(
    private userManage: UserManagementService,
    private popupService: SnackbarService,
    private spinner: SpinnerService,
  ){

  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  private getAllUsers() {
    this.userData = [];
    this.userManage.getAllUsers().subscribe({
      next: (response) => {
        this.userData = response;
        this.userManage.setUserData(this.userData);
        this.popupService.showMessage("User Fetched Success");
        console.log("User Fetched Success");
        this.spinner.hide();
      },
      error: (err) => {
        this.popupService.showMessage("Failed to Fetch the users");
        console.error("Unable to Get the users ", err);
        this.spinner.hide();
      }
    });
  }
}
