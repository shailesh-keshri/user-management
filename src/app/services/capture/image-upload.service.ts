import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private storage: AngularFireStorage) {}

  uploadImage(blob: Blob, userId: string): Observable<string> {
    const filePath = `images/${userId}_${new Date().getTime()}.png`;
    const ref = this.storage.ref(filePath);
    
    return new Observable<string>(observer => {
      const task = ref.put(blob);
      task.snapshotChanges().pipe(
        finalize(async () => {
          const downloadURL = await ref.getDownloadURL().toPromise();
          observer.next(downloadURL);
          observer.complete();
        })
      ).subscribe();
    });
  }
}
