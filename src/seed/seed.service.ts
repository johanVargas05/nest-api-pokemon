import { Injectable } from '@nestjs/common';
import axios,{AxiosInstance} from 'axios';
import { PokeResponse } from './interfaces/poke-response-interfaces';

@Injectable()
export class SeedService {

  private _axios:AxiosInstance = axios;


  async executeSeed() {
    const {data} = await this._axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=300');
    const dataNew=data.results.map(({name, url})=>{
      const segment = url.split('/');
      const no:number = +segment[segment.length - 2];
      return {no,name};
    });

    return dataNew;
  }

}
