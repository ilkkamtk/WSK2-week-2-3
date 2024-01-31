import {Point} from 'geojson';
import {Types} from 'mongoose';

type Category = {
  _id: Types.ObjectId;
  category_name: string;
};

type Animal = {
  _id: Types.ObjectId;
  animal_name: string;
  species: Types.ObjectId;
  birthdate: Date;
  gender: 'Male' | 'Female';
};

type FullAnimal = Omit<Animal, 'species'> & {
  species: FullSpecies;
};

type Species = {
  _id: Types.ObjectId;
  species_name: string;
  category: Types.ObjectId;
  image: string;
  location: Point;
};

type FullSpecies = Omit<Species, 'category'> & {
  category: Category;
};

export {Category, Animal, Species, FullSpecies, FullAnimal};
