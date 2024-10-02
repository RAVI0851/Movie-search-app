const button = document.getElementById('searchBtn');
const sec = document.getElementById('sec');
const input = document.getElementById('input');
const favsection = document.getElementById('favourites');
let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
button.addEventListener("click", async function(){
    const MovieName = input.value;
    if(MovieName!==""){
        getMovie(MovieName);
    }
});
async function getMovie(MovieName) {
    const h2 = document.createElement('h2');
    h2.className = "bg-green-500 m-4 p-8 font-bold"
    h2.textContent = MovieName;
    const apikey = '82f62a66';
    const url = `http://www.omdbapi.com/?apikey=${apikey}&s=${encodeURIComponent(MovieName)}`;
    try{
        const existingH2 = sec.querySelector('h2');
        if(existingH2){
            sec.removeChild(existingH2);
        }
        const res = await fetch(url);
        if(!res.ok){
            throw new Error(`Movie not found check spelling here`);
        }
        const data = await res.json();
        displayMovie(h2,data);
    }
    catch(error){
        // h2.textContent = `-Error:${error.message}`;
        h2.textContent = `${MovieName} - Error: ${error.message}`;
    }
    sec.appendChild(h2);
    input.value = "";
}
function addToFav(movie){
    const existingFav = favourites.find(fav => fav.imdbID===movie.imdbID);
    if(!existingFav){
        favourites.push(movie);
        localStorage.setItem('favourites', JSON.stringify(favourites));
        alert(`${movie.Title} added to favourites.`)
        displayFavourites();
    }
    else{
        alert(`${movie.Title} is already in your favourites`)
    }
}
function displayFavourites(){
    const favsection = document.getElementById('favourites');
    favourites.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.className = `bg-red-500 p-4 text-white font-bold block mx-auto`;
        movieItem.innerHTML = 
                              `<h1 class="text-center font-bold text-xl text-black"> Favourites</h1>
                               <img src="https://via.placeholder.com/300x450.png?text=No+Poster+Available" alt="Poster" class="w-full h-auto mt-4">
                               <h2>Title :  ${movie.Title}</h2> <br>
                               <p>Year :  ${movie.Year}</p> <br>
                               <p>Type :  ${movie.Type}</p>`;
        favsection.appendChild(movieItem);
    });
}
window.onload =displayFavourites;

function displayMovie(h2,data){
    const posterUrl = `https://via.placeholder.com/150`;
    if(data.Search&&data.Search.length>0){
        h2.innerHTML = `<img src="https://via.placeholder.com/300x450.png?text=No+Poster+Available" alt="Poster" class="w-full h-auto mt-4"><br>
        Title: ${data.Search[0].Title}<br> 
        Type: ${data.Search[0].Type}<br>
        Year of release: ${data.Search[0].Year}<br>`;
        //Favourite button
        const button = document.createElement('button');
        button.className = 'favBtn bg-red-500 p-4 m-2 rounded-full';
        button.textContent = 'Add to favourites';
        
        button.addEventListener("click", function(){
            addToFav(data.Search[0]);
        });
        h2.appendChild(button);
    }
    else{
        h2.textContent = `Movie not found`;
    }
}