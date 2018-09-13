import { Component, OnInit } from '@angular/core';
import {Hero} from '../heroes';
import {HeroService} from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heros: Hero[];

  constructor(private heroService: HeroService) {
  }

  ngOnInit() {
    this.getHeros();
  }

  getHeros(): void{
    this.heroService.getHeros().subscribe(heroes=>this.heros=heroes);
  }

  add(name: String): void{
    name = name.trim();
    if(!name){return;}
    this.heroService.addHero({name} as Hero).subscribe(hero=>{
      this.heros.push(hero);
    })
  }

  delete(hero: Hero): void{
    this.heros=this.heros.filter(h=>h !== hero)
    this.heroService.deleteHero(hero).subscribe()
  }
}
