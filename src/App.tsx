import { ChangeEvent, useEffect, useState } from 'react';
import { getBreeds, getRandomDogImage } from './services/dog.service';
import { Mierdon } from './Mierdon';
import './App.css'

interface Dog {
  imgUrl: string;
  likes: number;
  dislikes: number;
}

function App() {
  //selectedBreedFilter es un array
  const[selectedBreedFilter, setSelectedBreedFilter] = useState<string[]>([]); //para manejar los filstros de raza
  const[filterByLikes, setFilterByLikes] = useState(false); //para manejar el filtro de like
  const[filterByDislikes, setFilterByDislikes] = useState(false); //para manejar el filtro de dislike
  const[breed, setBreed] = useState('')
  const[allBreeds, setAllBreeds] = useState<string[]>([])
  const[name, setName] = useState('');
  const[showMierdon, setShowMierdon] = useState(false)
  const [dogList, setDogList] = useState<Dog []>([
    {
      imgUrl: 'https://images.dog.ceo/breeds/kelpie/n02105412_3329.jpg',
      likes: 0,
      dislikes: 0,
    },
    {
      imgUrl: 'https://images.dog.ceo/breeds/pitbull/pitbull_dog.jpg',
      likes: 0,
      dislikes: 0,
    },
    {
      imgUrl: 'https://images.dog.ceo/breeds/lhasa/n02098413_14953.jpg',
      likes: 0,
      dislikes: 0,
    },
  ]);

  useEffect(()=>{
    const fetchAllBreeds = async () => {
      const breeds = await getBreeds();
      if(breeds) {
        setAllBreeds(breeds);
        setBreed(breeds[0]);
      }
    };
    fetchAllBreeds();
  }, []) //el array está vacío porque es lo que indica que solo se ejecutará cuando se monta

  const handleAddDogClick = async () => {
    console.log('añadir al final clicado');
    
    const dog = await getRandomDogImage(breed);
    if(dog){
      setDogList([...dogList,
        {
          imgUrl: dog?.imgUrl,
          likes: dog.likeCount,
          dislikes: dog.dislikeCount,
      }])
    }
  };

  //añadir un perro al final
  const handleAddStartDogClick = async () => {
    console.log('añadir al principio');
    
    const dog = await getRandomDogImage(breed);
    if(dog){
      setDogList([
        {
          imgUrl: dog?.imgUrl,
          likes: dog.likeCount,
          dislikes: dog.dislikeCount,
      }, ...dogList])
    }
  };

  //que los botones de like y dislike funcionen:
  /*Esto funciona solo si no estás filtrando, porque el index en el map() coincide con la posición real del perro en dogList.
Pero cuando filtras (por raza, por likes o por dislikes), estás mostrando 
una copia filtrada: filteredDogs. El índice dentro de filteredDogs ya no 
corresponde con dogList, así que terminas dándole like al perro equivocado 
(¡o a ninguno si el índice no existe!). */

  /* const handleLikes = (index: number) =>{ //recibe el indx del perro en la lista para saber cual debe actualizar
    const updatedList = [...dogList];
    updatedList[index].likes += 1; 
    setDogList(updatedList);
  }

  const handleDislikes = (index: number) =>{
    const updatedList = [...dogList];
    updatedList[index].dislikes += 1; 
    setDogList(updatedList);
  } */

    //a ver si con esto funciona, en vez de pasar los indices, que ya no coinciden,se le pasan las imágenes url 
    const handleLikes = (imgUrl: string) => {
      const updatedList = [...dogList]; //copia de dogList para no modificarlo directamente
      const index = updatedList.findIndex(dog => dog.imgUrl === imgUrl); //buscamos el índice real en dogList
      if (index !== -1) {  // si encontramos el perro...
        updatedList[index].likes += 1;  // le sumamos un like
        setDogList(updatedList); // y actualizamos el estado
      }
    };
    
    const handleDislikes = (imgUrl: string) => {
      const updatedList = [...dogList];
      const index = updatedList.findIndex(dog => dog.imgUrl === imgUrl);
      if (index !== -1) {
        updatedList[index].dislikes += 1;
        setDogList(updatedList);
      }
    };
    

  //función para extraer la raza a partir de la url
  const getBreedFromUrl = (url: string): string =>{
    const match = url.match(/breeds\/([^/]+)/); //expresión regular. Busca la parte después de "breeds/" hasta que encuentra el siguiente /
    return match ? match[1]: 'unknown'; //si encuentra algo (match no es null) devuelve el primer grupo de captura (match[1]), que es el nombre de la raza
  } //Si no encuentra nada, devuelve 'unknown'

  //Contar las razas:  mapa que tiene como clave una raza (string) y como valor un número (number).
  const breedCountMap: Record<string, number> = {}; //se crea un objeto llamado breedCountMap

  dogList.forEach(dog => {
    const breed = getBreedFromUrl(dog.imgUrl); //llama a la función que obtiene la raza de la url
    breedCountMap[breed] = (breedCountMap[breed] || 0) + 1; // en l objeto breedCountMap añade o suma 1 a la raza dependiendo de si existe
  });


  const handleBreedChange = (event: ChangeEvent<HTMLSelectElement>) =>{
    setBreed(event.target.value);
    
  };

  const fetchAllBreeds = async() => {
    if (allBreeds.length > 0){
      return;
    }
    const breeds = await getBreeds();
    if(breeds) {
      setAllBreeds(breeds);
    }
  };

  fetchAllBreeds();
  
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) =>{
    setName(event.target.value);
  }

  //manejo de los filtros: se construye una nueva lista "filteredDogs" en bas a los filstros activos y se utiliza esta nueva lita para renderizarla en dogList
//rcorre los perros de la dogList y dcide cuales debe mostrarse en pantalla
  const filteredDogs = dogList.filter(dog => {
    const breed = getBreedFromUrl(dog.imgUrl); //se define breed
    const matchBreed = //acepta cualqur perro que coincida con cualquier raza seleccionada
    selectedBreedFilter.length > 0
    ? selectedBreedFilter.includes(breed) // Acepta cualquier perro que coincida con cualquiera de las razas seleccionadas
    : true;
    const matchLikes = filterByLikes ? dog.likes > 0 : true; //si el filtro de likes está activado, este perro solo pasa si tiene más likes que dislikes, s no está activado, retorna true para que no afecte al filtrado.
    const matchDislikes = filterByDislikes ? dog.dislikes > 0 : true; //igual que con los likes
    return matchBreed && matchLikes && matchDislikes; //el perro solo pasa el filtro si cumple con la raza, los likes y los dislikes. Si algún filtro no se cumple, ese perro no se mostrará.
  });

  //función para quitar o añadir raza al filtro, se utiliza setSelectedBreedFilter para actualizar el array de razas, si la raza está, dejará de estarlo y viceversa
  const toggleBreedFilter = (breed: string) => {
    setSelectedBreedFilter((prevFilters) => //prevFilters es el calor actual de selectedBreedFilter
      prevFilters.includes(breed) //si incluye la raza en el array la elimina
        ? prevFilters.filter((item) => item !== breed) // Si la raza ya está seleccionada, la eliminamos del filtro, crea un nuevo array que excliye la raza, todo será true menos esa raza en concreto
        : [...prevFilters, breed] // Si no está seleccionada, la añadimos al filtro
    );
  };

  return (
    <>
    <h1>Pawesome Pup Generator</h1>
    <input placeholder='Nombre del perrito' value={name} onChange={handleNameChange}/>
    <div className='breed-picker'>
      Selecciona la raza del perro que quieras Añadir
      <select value={breed} onChange={handleBreedChange}>
        {allBreeds.map((breed) =>{
          return <option value={breed}>{breed}</option>;
        })}
      </select>
    </div>
    <button className='add-btn'onClick={handleAddDogClick}>
      Añadir 1 perro al final
    </button>
    <button className='add-btn'onClick={handleAddStartDogClick}>
      Añadir 1 perro al principio
    </button>
    <button className='add-btn'onClick={() =>{ setShowMierdon(!showMierdon);}}>
        Que {showMierdon ? 'desaparezca' : 'aparezca'} mierdon
    </button>
    <div>
      <p>Filtrar por:</p>
      <button className={`filter-btn ${filterByLikes ? 'like-selected' : ''}`} onClick={() => setFilterByLikes(!filterByLikes)}>
        {filterByLikes ? 'Quitar filtro de Likes 💕' : 'Filtrar por Likes 💕'}
      </button>
      <button className={`filter-btn ${filterByDislikes ? 'dislike-selected' : ''}`} onClick={() => setFilterByDislikes(!filterByDislikes)}>
        {filterByDislikes ? 'Quitar filtro de Dislikes 🤢' : 'Filtrar por Dislikes 🤢'}
      </button>
    </div>
    <div className='breed-btns'>
      <h2>Razas actuales:</h2>
      {/* Object.entries(breedCountMap) convierte el objeto a un array así: [["pitbull", 2], ["lhasa", 1]] */}
      {/* hace un .map(...) para recorrer cada pareja [breed, count] y crea un botón por cada raza */}
      {Object.entries(breedCountMap).map(([breed, count]) => ( 
        <button
        key={breed}
        // dependiendo de si la raza actual breed está en el array de razas seleccionadas o no, se le añadirá la clase selected
        className={`breed-btn ${selectedBreedFilter.includes(breed) ? 'selected' : ''}`} 
        onClick={() => toggleBreedFilter(breed)} // Ahora, con toggle, podemos agregar o quitar razas
        >
          {breed} ({count})
        </button>
      ))}
    </div>
      <div className = 'dog-list'>
        {showMierdon && <Mierdon name={name} />}
        {/* ahora hacemos un map, con dog(cada perro del array) y su índice correspondinte */}
        {filteredDogs.map((dog)=> { 
          return (
            <div className = 'dog'>
          <img src={dog.imgUrl}/>
          <div className='dog__votes'>
            <span>{dog.likes} 💕</span>
            <span>{dog.dislikes} 🤢</span>
          </div>
          <div className='dog__actions'>
            <button onClick={()=>handleLikes(dog.imgUrl)}>Like</button> {/* se le pasa el indice de cada perro para que la función handleLikes sepa que dog en concreto debe actualizar */}
            <button onClick={() =>handleDislikes(dog.imgUrl)}>DisLike</button>
          </div>
        </div>
          );
        })}
      </div>
    </>
  )
};

export default App
