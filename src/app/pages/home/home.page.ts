import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePage implements OnInit{

  constructor(private router: Router){}

  ngOnInit(): void {
    
  }

  handleNavigation(value:string){
    if(value === 'login'){
      this.router.navigateByUrl('/login', {replaceUrl:true});
    }else{
      this.router.navigateByUrl('/register', {replaceUrl:true});
    }
  }
}
