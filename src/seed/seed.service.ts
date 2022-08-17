import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios,{AxiosInstance} from 'axios';
import { PokeResponse } from './interfaces/poke-response-interfaces';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';



@Injectable()
export class SeedService {

  constructor( @InjectModel(Pokemon.name)
  private readonly _pokemonModel: Model<Pokemon>){}

  private _axios:AxiosInstance = axios;


  async executeSeed() {
    await this._pokemonModel.deleteMany();

    const {data} = await this._axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=300');
    const pokemons = data.results.map(({name, url})=>{
      const segment = url.split('/');
      const no:number = +segment[segment.length - 2];
      return {no,name};
    });
   
    await this._pokemonModel.insertMany(pokemons);
    

    return {
      ok: true,
      message:'The seed ran successfully, now you have the sample data available'
    };
  }

}
