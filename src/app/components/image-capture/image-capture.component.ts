import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ImageUploadService } from '../../services/capture/image-upload.service';
import { DialogComponent } from '../dialog/dialog.component';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'app-image-capture',
  template: `<div class="d-flex justify-content-end py-2 px-4"><button mat-flat-button color="primary" type="submit" (click)="openDialog()">Open Camera</button> </div>`,
  styles: [''],
})
export class ImageCaptureComponent implements OnInit {

  constructor(
    public matDialog:MatDialog,
    
  ){

  }
  ngOnInit(): void {
    
  }
  @ViewChild('exampleModal') modalElement!: ElementRef;

  openModal() {
    this.modalElement.nativeElement.modal('show');
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(DialogComponent, {
      width: '500px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
