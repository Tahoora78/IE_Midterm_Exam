
let urls = ["https://swapi.dev/api/films/4", "https://swapi.dev/api/films/5","https://swapi.dev/api/films/6", "https://swapi.dev/api/films/1", "https://swapi.dev/api/films/2", "https://swapi.dev/api/films/3"]


async function main() {
    var currentPage = 0;
    var total_page = 0;
    var footerElement = document.getElementById("footer");
    var contentElement = document.getElementById("content");
    var contentName = document.getElementById("content_name");
    var movieSpaceShips = [];

    var content = ``;
    var spaceShipContent = ``;
    
    contentElement.innerHTML = "Loading movie data";

    // getting all spaceship information
    async function getSpaceshipJsonData(url) {
        var jsonResult = fetch(url).then(
            (response) => {
                return response.json();
            });
    
        var result = jsonResult.then(data => {
            return {
                name: data.name,
                model: data.model,
                manufacturer: data.manufacturer,
                crew: data.crew,
                passengers: data.passengers
            };
        }) 
        return result;
    }


    // getting movie information with its starships of given api
    async function getMovieJsonData(url) {
        var jsonResult = fetch(url).then(
            (response) => {
                return response.json();
            });
    
        var result = jsonResult.then(data => {
            return {
                title: data.title,
                starshipNum: data.starships.length,
                episode_id: data.episode_id,
                release_date: data.release_date,
                starships: data.starships,
            };
        }) 
        return result;
    }
    
    // getting all movie data with its starships api
    var movieSpaceShips = [];
    for (let i=0; i<6; i++) {
        var movie = await getMovieJsonData(urls[i]);
        movieSpaceShips.push(movie);
    }
    
    // getting all starships data of all movies
    contentElement.innerHTML = "Loading starship data";
    for (let i=0; i<6; i++) {
        var starships = [];
        for (let j=0; j<movieSpaceShips[i].starships.length; j++) {
            var spaceship = await getSpaceshipJsonData(movieSpaceShips[i].starships[j]);
            starships.push(spaceship);
        }
        movieSpaceShips[i].starships = starships;
    }


    // showing detail information of one spaceship
    function showDetailSpaceShip(movieNum, spaceNum) {
        let data = movieSpaceShips[movieNum].starships[spaceNum];
        contentName.innerHTML = "";
        let content = `
        <div style="display: flex; justify-content: space-between">
            <div style="margin-right: 35px;">
                <h1 style="font-size:24px;">Starships</h1>
                <ul>
                    <li>${data.name}</li>
                </ul>
            </div>
            <div style="margin-left: 35px;">
                <h1 style="font-size:24px;">${data.name}</h1>
                <ul>
                    <li>Name: ${data.name}</li>
                    <li>Model: ${data.model}</li>
                    <li>Manufacturer: ${data.manufacturer}</li>
                    <li>Crew: ${data.crew}</li>
                    <li>Passengers: ${data.passengers}</li>
                </ul>
            </div>
        </div>
        `;
        contentElement.innerHTML = content;
        currentPage = 0;
    }
    

    // showing all starships of movie whith the given name
    function showSpaceShip(name, part) {
        currentPage = part;
        contentName.innerHTML = "";
        let num=0;
        while(movieSpaceShips[num].title!==name){
            num += 1
        }
        total_page = Math.ceil(movieSpaceShips[num].starships.length/10);
        var total = (movieSpaceShips[num].starships.length>(part*10)) ? part*10 : movieSpaceShips[num].starships.length;
        spaceShipContent = ``;
        spaceShipContent += `
        <div style="display: flex; justify-content: space-between">
            <div>
                <h1 style="font-size:24px;">Movie Name</h1>
                <ul><li>${name}</ul></li>
            </div>
            <div>
                <h1 style="font-size:24px;"> Starships</h1>
                <ul>
        `;

        for (let j=((part-1)*10); j<total; j++) {
            spaceShipContent += `
            <li id='${movieSpaceShips[num].starships[j].name}'><a href="#">${movieSpaceShips[num].starships[j].name}</a></li>
            `;
        }
        spaceShipContent += `</ul> </div> </div>`;
        contentElement.innerHTML = spaceShipContent;
        for(let j=((part-1)*10); j<total; j++) {
            var li = document.getElementById(movieSpaceShips[num].starships[j].name);
            li.addEventListener('click', function handleClick(event){
                showDetailSpaceShip(num, j);
                currentPage = -1;
                showFooter("", -1);
            });
        }
        
    }

    // showing footer
    function showFooter(name, current) {
        currentPage = current;

        var footerContent = ``;
        // previous and next button
        if (currentPage>1 && currentPage<(total_page)){
            footerContent = `
                <ul class="starship">
                    <li>
                        <span><a href="#" id="prev">Prev</a></span>
                        <span href="# id="current">Page- ${currentPage}</span>
                        <span><a href="#" id="next">Next</a></span>
                    </li>
                    <li>
                        <a href="#" id="back_to_movie">Back to Movies</a>
                    </li>
                </ul>
            `;
            footerElement.innerHTML = footerContent;
            var li_prev = document.getElementById("prev");
            li_prev.addEventListener('click', function handleClick(event) {
                currentPage -= 1;
                showSpaceShip(name, (currentPage));
                showFooter(name, currentPage);
            });
            var li_next = document.getElementById("next");
            li_next.addEventListener('click', function handleClick(event){
                currentPage += 1;
                showSpaceShip(name, (currentPage));
                showFooter(name. currentPage);
            });
        }
        // only next button
        if (currentPage === 1 && currentPage< (total_page)) {
            footerContent = `
                <ul class="starship">
                    <li>
                        <span href="# id="current">Page- ${currentPage}</span>
                        <span id="next"><a href="#">Next</a></span>
                    </li>
                    <li>
                        <a href="#" id="back_to_movie">Back to Movies</a>
                    </li>
                </ul>
            `;
            footerElement.innerHTML = footerContent;
            var li_next = document.getElementById("next");
            li_next.addEventListener('click', function 
            handleClick(event){
                currentPage += 1;
                showSpaceShip(name, (currentPage));
                showFooter(name, (currentPage));
            });
        }
        // only previous button
        if (currentPage ==total_page && currentPage>1) {
            footerContent = `
                <ul class="starship">
                    <li>
                        <span id="prev"><a href="#">Prev</a></span>
                        <span href="# id="current">Page- ${currentPage}</span>
                    </li>
                    <li>
                        <a href="#" id="back_to_movie">Back to Movies</a>
                    </li>
                </ul>
            `;
            footerElement.innerHTML = footerContent;
            var li_prev = document.getElementById("prev");
                li_prev.addEventListener('click', function handleClick(event) {
                currentPage -= 1;
                showSpaceShip(name, (currentPage));
                showFooter(name, currentPage);
            });
        }
        // only current page
        if (currentPage==1 && currentPage==(total_page)) {
            footerContent = `
                <ul class="starship">
                    <li>
                        <span href="# id="current">Page- ${currentPage}</span>
                    </li>
                    <li>
                        <a href="#" id="back_to_movie">Back to Movies</a>
                    </li>
                </ul>
            `;
            footerElement.innerHTML = footerContent;
        }
        // only Back to movie part
        if (currentPage==-1) {
            footerContent = `
                <ul class="starship">
                    <li>
                        <a href="#" id="back_to_movie">Back to Movies</a>
                    </li>
                </ul>
            `;
            footerElement.innerHTML = footerContent;
        }

        var li_back_movie = document.getElementById("back_to_movie");
        li_back_movie.addEventListener('click', function handleClick(event)  {
            showMovies();
        })
    }
    

    // showing all movies
    function showMovies() {
        currentPage = 0;
        content = `<ul>`;
        contentName.innerHTML = "Movies";
        footerElement.innerHTML = "";
        for (let i=0; i<6; i++){
            content += `<li><div id='${movieSpaceShips[i].title}' class="movie_style" ><div>${movieSpaceShips[i].title} ${movieSpaceShips[i].episode_id} ${movieSpaceShips[i].release_date} </div><div><a href="#">Starships</a></div></div></li>`;
        }
        content += `</ul>`;
        contentElement.innerHTML = content;
        for (let i=0; i<6; i++) {
            
            var li = document.getElementById(movieSpaceShips[i].title);
            li.addEventListener('click', function handleClick(event){
                showSpaceShip(movieSpaceShips[i].title, currentPage+1);
                next_page = Math.floor(movieSpaceShips[i].starships.length/10) >=1 ? 1 : 0;
                showFooter(movieSpaceShips[i].title, currentPage);
            });
        }

    }    

    showMovies();

    return movieSpaceShips;
}

main();

