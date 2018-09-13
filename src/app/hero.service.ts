import { Injectable } from '@angular/core';
import {Hero} from './heroes';
import {Observable, of} from 'rxjs';
import {MessageService} from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroUrl = 'api/heroes';

  getHeros(): Observable<Hero[]>{
    return this.httpClient.get<Hero[]>(this.heroUrl).pipe(
      tap(heroes=>this.log('fetchd heroes')),
      catchError(this.handleError('getHeroes', [])))
  }
  constructor(private messageService: MessageService, private httpClient: HttpClient) { }

  getHero(id: number): Observable<Hero>{
    const url = `${this.heroUrl}/${id}`;
    return this.httpClient.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({'Content-type': 'application/json'})
    }
    return this.httpClient.put(this.heroUrl, hero, httpOptions).pipe(
      tap(_=>this.log(`update hero name = ${hero.name}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero>{
    const httpOptions={
      headers: new HttpHeaders({'Content-type': 'application/json'})
    }
    return this.httpClient.post(this.heroUrl, hero, httpOptions).pipe(
      tap((hero: Hero)=>this.log(`update hero name = ${hero.name}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero>{
    const httpOptions={
      headers: new HttpHeaders({'Content-type': 'application/json'})
    }
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroUrl}/${id}`;
    return this.httpClient.delete<Hero>(url, httpOptions).pipe(
      tap(_=>this.log('delete')),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeros(term: string): Observable<Hero[]>{
    if(!term.trim()){
      return of([])
    }
    return this.httpClient.get<Hero[]>(`${this.heroUrl}/?name=${term}`).pipe(
      tap(_=>this.log(`search heroes by name: ${term}`)),
      catchError(this.handleError<Hero[]>('search heros', []))
    )
  }

  private log(message: string){
    this.messageService.add(`hero Service: ${message}`);
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
