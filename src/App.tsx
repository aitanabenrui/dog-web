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

  //que los botones de like y dislike funcionen

  const handleLikes = (index: number) =>{ //recibe el indx del perro en la lista para saber cual debe actualizar
    const updatedList = [...dogList];
    updatedList[index].likes += 1; 
    setDogList(updatedList);
  }

  const handleDislikes = (index: number) =>{
    const updatedList = [...dogList];
    updatedList[index].dislikes += 1; 
    setDogList(updatedList);
  }

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
      <div className = 'dog-list'>
        {showMierdon && <Mierdon name={name} />}
        {/* ahora hacemos un map, con dog(cada perro del array) y su índice correspondinte */}
        {dogList.map((dog, index)=> { 
          return (
            <div className = 'dog'>
          <img src={dog.imgUrl}/>
          <div className='dog__votes'>
            <span>{dog.likes} 💕</span>
            <span>{dog.dislikes} 🤢</span>
          </div>
          <div className='dog__actions'>
            <button onClick={()=>handleLikes(index)}>Like</button> {/* se le pasa el indice de cada perro para que la función handleLikes sepa que dog en concreto debe actualizar */}
            <button onClick={() =>handleDislikes(index)}>DisLike</button>
          </div>
        </div>
          );
        })}
      </div>
    </>
  )
};

export default App
