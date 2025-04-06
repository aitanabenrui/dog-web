import { useEffect } from 'react';
import mierdon from './assets/mierdon.jpeg'

interface MierdonProps {
    name: string;
}

export const Mierdon = (props: MierdonProps) => {
    const {name} = props;

    //Ese useEffect se ejecuta cada vez que el componente se renderiza, es decir cuando se monta. 
    // Pero cuando el componente desaparece (es decir, se desmonta del DOM), ese efecto no se ejecuta automáticamente
    useEffect(()=>{ //Cada vez que apoarezca saldrá viva mierdón en la consola
        
    /*   const handleWindowsClick = () => {
            console.log('click', name);
        }
        window.addEventListener('click', handleWindowsClick); 
         */
        console.log('viva mierdon'); //al mostrar se ejecuta viva mierdon, al cambiar name se ejecuta adiós mierdón y viva mierdón, y al desmontarse se ejecutará nos volveremos a ver
        return() =>{
            console.log('adiós mierdon'); //se captura el momento en el que se desmonta el componente
        }
    }, [name]);//este array se llama array de dependencias: Ejecuta este efecto una sola vez: justo cuando el componente se monta, y luego nunca más… salvo cuando se desmonte, si tengo una función de limpieza (return)
    //si le pasamos una propiedad al array, [name] se ejecutará cada vez que se renderice el objeto y cada vez que la propiedad se actualice
    
    //el useEffect solo existe mientras el componente esté montado. Si un componente no está en el árbol de renderizado (es decir, no se está mostrando en pantalla), entonces React no ejecuta su lógica interna, incluyendo hooks como useEffect

    return (
        <div className="dog">
            <img src={mierdon}/>
            <div className="dog__votes">
                <span>1 💕</span>
                <span>1000 🤢</span>
            </div>
        </div>
    );
};