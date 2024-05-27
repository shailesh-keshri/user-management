import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ImageUploadService } from '../../services/capture/image-upload.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { SnackbarService } from '../../services/popup/snackbar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  WIDTH = 500;
  HEIGHT = 500;
  isCaptured: boolean = false;
  user: any;

  @ViewChild('video')
  public video!: ElementRef;

  @ViewChild('canvas')
  public canvas!: ElementRef;

  captures: string[] = [];
  error: any;
  public stream: MediaStream | null = null;

  constructor(
    private authService: AuthService,
    private imageUploadService: ImageUploadService,
    private spinner: SpinnerService,
    private popup: SnackbarService,
    public dialogRef: MatDialogRef<DialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {}

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe((user) => {
      this.user = user;
    });
  }

  async ngAfterViewInit() {
    await this.setupDevices();
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
         this.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (this.stream) {
          this.video.nativeElement.srcObject = this.stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = 'You have no output video device';
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  snapImage() {
    this.drawImageToCanvas(this.video.nativeElement);
    this.popup.showMessage("Image captured!");
    this.isCaptured = true;
  }

  saveImage() {
    this.spinner.show();
    this.canvas.nativeElement.toBlob((blob:any) => {
      if (blob) {
        this.imageUploadService.uploadImage(blob, this.user.uid)
        .subscribe({
          next: (downloadURL) => {
            this.popup.showMessage("Image uploaded successfully");
            console.log('Image uploaded successfully');
            this.spinner.hide();
          },
          error: (err) => {
            console.error('Error uploading image', err);
            this.spinner.hide();
          }
        });
      }
    }, 'image/png');
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }

  async startAgain(){
    this.isCaptured = false; 
    await this.setupDevices();
  }

  closeDialog() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.dialogRef.close();
  }
}
