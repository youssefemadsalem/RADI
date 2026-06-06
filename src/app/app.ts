import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Preloader } from './components/preloader/preloader';
import { Footer } from "./components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Preloader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'radi-studio';
}
