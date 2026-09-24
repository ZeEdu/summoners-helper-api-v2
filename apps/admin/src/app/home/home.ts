import { Component } from '@angular/core';
import { GuideReport } from '../guide-report/guide-report';

@Component({
  selector: 'app-home',
  imports: [GuideReport],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home { }
