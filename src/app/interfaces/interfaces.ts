export interface RespuestaMDB {
  page: number;
  results: Pelicula[];
  total_pages: number;
  total_results: number;
}

export interface Pelicula {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface PeliculaDetalle {
  adult?: boolean;
  backdrop_path?: string;
  belongs_to_collection?: any;
  budget?: number;
  genres?: Genre[];
  homepage?: string;
  id: number;
  imdb_id?: string;
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  production_companies?: Productioncompany[];
  production_countries?: Productioncountry[];
  release_date?: string;
  revenue?: number;
  runtime?: number;
  spoken_languages?: Spokenlanguage[];
  status?: string;
  tagline?: string;
  title?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
  name?: string;
  first_air_date?: string,
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export interface Spokenlanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Productioncountry {
  iso_3166_1: string;
  name: string;
}

export interface Productioncompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface RespuestaCredits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string;
  credit_id: string;
  department: string;
  job: string;
}

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface SearchResult {
  page: number;
  results: SearchedPelicula[];
  total_pages: number;
  total_results: number;
}

export interface SearchedPelicula {
  adult: boolean;
  backdrop_path?: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface Genres {
  genres: Genre[];
}

export interface Persona {
    id: number;
    name: string;
    profile_path?: string;
    known_for_department?: string;
    popularity?: number;
    character?: string; // solo cast
    job?: string;       // solo crew
}

export interface RespuestaCombinedCredits {
    id: number;
    cast: FilmografiaItem[];
}

export interface FilmografiaItem {
    adult: boolean;
    backdrop_path?: string;
    genre_ids: number[];
    id: number;

    original_language: string;
    original_title?: string;

    overview: string;
    popularity: number;
    poster_path?: string;

    release_date?: string;      // movie
    first_air_date?: string;    // tv

    title?: string;             // movie
    name?: string;              // tv

    video?: boolean;

    vote_average: number;
    vote_count: number;

    // específicos del actor
    character: string;
    credit_id: string;
    order: number;

    media_type: 'movie' | 'tv';
}
