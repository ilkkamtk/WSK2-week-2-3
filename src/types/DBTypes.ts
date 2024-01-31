import {Types} from 'mongoose';

type Category = {
  _id: Types.ObjectId;
  category_name: string;
};

type Animal = {
  animal_id: number;
  animal_name: string;
  species: number;
  birthdate: Date;
};

type FullAnimal = Omit<Animal, 'species'> & {
  species: FullSpecies;
};

type Species = {
  species_id: number;
  species_name: string;
  category: number;
  image: string;
};

type FullSpecies = Omit<Species, 'category'> & {
  category: Category;
};

export {Category, Animal, Species, FullSpecies, FullAnimal};
