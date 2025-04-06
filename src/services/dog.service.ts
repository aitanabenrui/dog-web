import { DogResponse } from "./model/Dogs"; //se importa DogResponse, define la estructura del objeto

function getRandomInt(min: number, max: number): number { //la función recibe dos números
    min = Math.ceil(min); //Math.ceil(min): Redondea min hacia arriba al entero más cercano.
    max = Math.floor(max); //Math.floor(max): Redondea max hacia abajo al entero más cercano.
    return Math.floor(Math.random() * (max - min + 1)) + min;
    //Math.random(): Devuelve un número entre 0 y 1 (excluyendo 1).
    //(max - min + 1) ajusta el rango para cubrir desde min hasta max.
    //Math.floor(...): Redondea hacia abajo para obtener un número entero.
  }
  
  export async function getRandomDogImage(breed: string): Promise<DogResponse | undefined > {
    const url =
      breed === '' ? 'https://dog.ceo/api/breeds/image/random' : `https://dog.ceo/api/breed/${breed}/images/random`;
  
    try {
      const response = await fetch(url); //Hace una petición HTTP para obtener la imagen y Espera la respuesta de la API.
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json(); //convierte la respusta en json
      // const json: {messag: string; status: string} = await response.json(); una forma de tipar json
  
      // TODO random breed
      return {
        id: Date.now() + Math.random(),
        breed,
        imgUrl: json.message,
        dislikeCount: getRandomInt(0, 2),
        likeCount: getRandomInt(0, 1)
      };
    } catch (error : any) { //Si hay un error, lo muestra en la consola con console.error(error.message)
      console.error(error.message);
    }
    return undefined; 
  }
  
  export async function getBreeds(): Promise<string[] | undefined> {
    const url = 'https://dog.ceo/api/breeds/list/all';
  
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
  
      return Object.keys(json.message);
    } catch (error: any) {
      console.error(error.message);
    }
  }
