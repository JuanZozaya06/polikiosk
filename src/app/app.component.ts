import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AutoResetService } from './core/services/auto-reset.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private auto: AutoResetService, private router: Router) {}
  ngOnInit() {
    //  this.auto.start();
    this.router.navigateByUrl('/');
  }
  ngOnDestroy() {
    // this.auto.clear();
  }
}
