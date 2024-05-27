import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../../services/users/user-management.service';
import { SnackbarService } from '../../services/popup/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public userData: UserModel[] = [];
  createUserForm: FormGroup;
  updateUserForm: FormGroup;
  removeUserForm: FormGroup;
  userIdList: any[] = [];
  loggedInUserId: string | null = null;

  constructor(
    private userManage: UserManagementService,
    private popupService: SnackbarService,
    private fb: FormBuilder,
    private spinner: SpinnerService,
    private authService: AuthService
  ) {
    this.createUserForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      roles: ['', Validators.required],
    });
    this.updateUserForm = this.fb.group({
      uid: ['', Validators.required],
      displayName: ['', Validators.required],
      roles: ['', Validators.required],
    });
    this.removeUserForm = this.fb.group({
      uid: ['', Validators.required],
      displayName: ['', Validators.required],
      roles: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe(user => {
      this.loggedInUserId = user?.uid || null;
      this.getUsers();
      this.getSelectValueChange(this.updateUserForm);
      this.getSelectValueChange(this.removeUserForm);
    });
  }

  private getUsers() {
    this.userData = [];
    this.spinner.show();
    this.userManage.userData$.subscribe({
      next: (users) =>{
        this.userData = users;
        this.updateUserIdList();
      },
      error: (err) =>{
        console.error("Unable to get users ", err);
        this.spinner.hide();
      }
    });
  }

  private updateUserIdList() {
    this.userIdList = this.userData
      .filter(user => user.uid !== this.loggedInUserId)
      .map(user => user.uid);
  }

  private getSelectValueChange(userForm:FormGroup) {
    userForm.get('uid')?.valueChanges.subscribe(uid => {
      const userDetails = this.getUserDetailsById(uid);
      if (userDetails) {
        userForm.patchValue({ displayName: userDetails.displayName, roles:userDetails.roles });
      }
    });
  }

  handleCreateUser() {
    this.createUserForm.markAllAsTouched();
    if (this.createUserForm.valid) {
      this.spinner.show();
      this.createNewUser(this.createUserForm);
    }
  }

  private createNewUser(_formData: any) {
    const userEntity = _formData.value;
    userEntity['emailVerified'] = true;
    userEntity['disabled'] = false;
    this.userManage.createUser(userEntity).subscribe({
      next: (resp) => {
        this.popupService.showMessage("User Created Successfully");
        this.userData.push(resp);
        this.updateUserIdList();
        this.getUsers();
        console.log("User Creation Success:");
        this.spinner.hide();
        this.createUserForm.reset();
      },
      error: (err) => {
        this.popupService.showMessage("Failed to create the user");
        console.error("Unable to Create the User ", err);
        this.spinner.hide();
      }
    });
  }

  handleUpdateRole() {
    this.spinner.show();
    this.updateUserForm.markAllAsTouched();
    if (this.updateUserForm.valid) {
      const { uid, displayName, roles } = this.updateUserForm.value;
      this.userManage.assignRole(uid, roles).subscribe({
        next: (resp) => {
          this.popupService.showMessage("Roles updated successfully");
          console.log("User Roles Updated: ");
          this.getUsers();
          this.spinner.hide();
          this.updateUserForm.reset();
        },
        error: (err) => {
          this.popupService.showMessage("Roles not updated");
          console.error("Unable to change the roles ", err);
          this.spinner.hide();
        }
      });
    }
  }

  getUserDetailsById(id: string) {
    return this.userData.find(user => user.uid === id);
  }

  handleRemoveUser() {
    this.spinner.show();
    this.removeUserForm.markAllAsTouched();
    if (this.removeUserForm.valid) {
      const { uid, displayName, roles } = this.removeUserForm.value;
      this.userManage.removeUser(uid).subscribe({
        next: (resp) => {
          this.popupService.showMessage("User removed successfully");
          console.log('User Deleted Successfully ');
          this.userData = this.userData.filter(user => user.uid !== uid);
          this.updateUserIdList();
          this.spinner.hide();
          this.removeUserForm.reset();
        },
        error: (err) => {
          this.popupService.showMessage("Failed to remove user");
          console.error("Unable to delete the user ", err);
          this.spinner.hide();
        }
      });
    }
  }
}
