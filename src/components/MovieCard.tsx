import React from 'react'

type MovieProps = {
    poster_path: string;
    release_date: string;
    vote_average: number;
    title: string;
    original_language: string;

}

const MovieCard: React.FC <MovieProps> = ({poster_path,release_date,vote_average,title,original_language}) => {
  return (
    <div className='movie-card'>
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : ''} alt={title} />
        <div className='mt-4'>
          <h3>{title}</h3>
          <div className='content'>
            <div className="rating">
              <img src="/star.png" alt="Star Icon" />
              <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
            </div>
            <span>.</span>
            <p className='lang'>{original_language.toUpperCase()}</p>
            <span>.</span>
            <p className='year'>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
          </div>
        </div>
    </div>
  )
}

export default MovieCard