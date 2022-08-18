import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {
 
  private _default_limited:number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly _pokemonModel: Model<Pokemon>,
    private readonly _configService: ConfigService
    ){
      this._default_limited = this._configService.get<number>('default_limit');
    }


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon =await this._pokemonModel.create(createPokemonDto);
      return pokemon;
      
    } catch (error) {
     this.handleExceptions(error);
    }

  }

  async findAll(paginationDto:PaginationDto) {
    const {limit=this._default_limited,offset=0} = paginationDto;
    return this._pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({no:1})
    .select('-__v');
  }

  async findOne(term: string) {
    let pokemon:Pokemon;

    if(!isNaN(+term)){
      pokemon = await this._pokemonModel.findOne({no:term});
    }

  //Mongo ID 
  if(!pokemon && isValidObjectId(term)) {
    pokemon = await this._pokemonModel.findById(term);
  }

  if(!pokemon){
    pokemon = await this._pokemonModel.findOne({name:term.toLocaleLowerCase().trim()});
  }
  
  if(!pokemon) throw new NotFoundException(`Pokemon with id, name or no '${term}' not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
   
    const pokemon = await this.findOne(term);

    if(updatePokemonDto.name) updatePokemonDto.name=updatePokemonDto.name.toLocaleLowerCase();
   
    try {
      await pokemon.updateOne(updatePokemonDto,{new:true});
      return {...pokemon.toJSON(), ...updatePokemonDto};

    } catch (error) {
      this.handleExceptions(error);
    }
   
    
  }

  async remove(id: string) {
    
    const {deletedCount} = await this._pokemonModel.deleteOne({_id:id});

    if(deletedCount==0) throw new BadRequestException(`Pokemon with id '${id}' not found`);

    return;

  }

  private handleExceptions(error:any){
    if(error.code===11000) throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
    console.log(error);
    throw new InternalServerErrorException();
  }

}
