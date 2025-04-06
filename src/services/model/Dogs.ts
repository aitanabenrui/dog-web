export interface DogResponse {
    id: number;
    breed: string;
    imgUrl: string; 
    dislikeCount: number;
    likeCount: number;

}

export type AllBreedsResponse = Record<string, string[]>;