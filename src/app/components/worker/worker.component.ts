import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrl: './worker.component.css'
})
export class WorkerComponent implements OnInit{

  constructor(
    private spinner: SpinnerService
  ){

  }
  ngOnInit(): void {
    this.spinner.hide();
  }
}
