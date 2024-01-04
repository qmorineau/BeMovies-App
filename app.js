// Swiper

const firstSwiper = new Swiper(".mySwiper1", {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
        nextEl: ".btn-next-s1",
        prevEl: ".btn-prev-s1",
    },
});

const secondSwiper = new Swiper(".mySwiper2", {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
        nextEl: ".btn-next-s2",
        prevEl: ".btn-prev-s2",
    },
});

const thirdSwiper = new Swiper(".mySwiper3", {
    slidesPerView: 4,
    spaceBetween: 20,
    navigation: {
        nextEl: ".btn-next-s3",
        prevEl: ".btn-prev-s3",
    },
}); 

//// Variables

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMTJjZjE0ZDQzNzQyZjJiMWE1ZWFjMmNkMmQxMDU3MiIsInN1YiI6IjY1MzhjMDEzYWUzNjY4MDBhZGE4MDIzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L1jWmZ_mygneYzG_Jd0RZ57Avi5K1qyiSvvFXwl6ybc'
    }
}
const body = document.querySelector("body");
const swiper1 = document.querySelector(".mySwiper1 .swiper-wrapper");
const swiper2 = document.querySelector(".mySwiper2 .swiper-wrapper");
const swiper3 = document.querySelector(".mySwiper3 .swiper-wrapper");
const genres = {
    id28: "Action",
    id12: "Adventure",
    id16: "Animation",
    id35: "Comedy",
    id80: "Crime",
    id99: "Documentary",
    id18: "Drama",
    id10751: "Family",
    id14: "Fantasy",
    id36: "History",
    id27: "Horror",
    id10402: "Music",
    id9648: "Mystery",
    id10749: "Romance",
    id878: "Science Fiction",
    id10770: "TV Movie",
    id53: "Thriller",
    id10572: "War",
    id37: "Western",
  }

/// Functions

const fetchBySearch = async (search) => {
    try {
        let res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US`, options);
        let data = await res.json();
        let arrayData = data.results;
        arrayData.forEach(element => {
            createSlide(element, swiper1);
        });
        const searchingText = document.querySelector(".swiper-text");
        searchingText.textContent = `Results for “${search}”`;
    } catch (error) {
        console.log(error);
    }
}
  
const fetchLatest = async () => {
    try {
        let today = new Date();
        let lastMonth  = new Date(); lastMonth.setMonth(today.getMonth()-1);
        let res = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&release_date.gte=${lastMonth.toISOString().slice(0,10)}&release_date.lte=${today.toISOString().slice(0,10)}&sort_by=popularity.desc`, options);
        let data = await res.json();
        let arrayData = data.results;
        arrayData.forEach(element => {
            createSlide(element, swiper2);
        });
    } catch (error) {
        console.log(error);
    }
}

const fetchByGenre = async (genreId) => {
    try {
        let res = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}`, options);
        let data = await res.json();
        let arrayData = data.results;
        arrayData.forEach(element => {
            createSlide(element, swiper3);
        });
    } catch (error) {
        console.log(error);
    }
}

const castFetchFunc = async (element, clone) => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${element.id}/credits?language=en-US`, options);
        const data = await res.json();
        const castArray = data.cast;
        let actors = [];
        castArray.forEach(actor => {
            actors.push(" " + actor.name);
        })
        return actors.slice(0,5) + "...";
    } catch (error) {
        console.log(error);
    }
}

const genreFunc = (element) => {
    let arrayOfGenre = element.genre_ids;
    let movieGenre = [];
    arrayOfGenre.forEach(cat => {
        movieGenre.push(genres[`id${cat}`]);
    });
    movieGenre = movieGenre.toString();
    movieGenre = movieGenre.replaceAll(","," / ");
    return movieGenre;
}
  
const posterFunc = (element) => {
    let url = element.poster_path;
    if (!url) {
        return "https://static.displate.com/280x392/displate/2022-04-15/7422bfe15b3ea7b5933dffd896e9c7f9_46003a1b7353dc7b5a02949bd074432a.jpg";
    } else {
        return `https://image.tmdb.org/t/p/original${url}`;
    }
}
  
const titleFunc = (element) => {
    let title = element.original_title;
    return title;
}
  
const yearFunc = (element) => {
    let date = element.release_date;
    let year = date.slice(0,4);
    return year;
}
  
const rateFunc = (element) => {
    let rate = parseFloat(element.vote_average);
    return rate.toFixed(1);
}
  
const overviewFunc = (element) => {
    let overview = element.overview;
    return overview;
}
  
const createSlide = (element, swiper) => {
    const template = document.querySelector("#swiper-template");
    const clone = template.content.cloneNode(true);
    createInfo(element, swiper, clone);
}

const createInfo = (element, swiper, clone) => {
    const poster = clone.querySelector(".film-poster");
    poster.src = posterFunc(element);
    const title = clone.querySelector(".film-title");
    title.textContent = titleFunc(element);
    const year = clone.querySelector(".film-year");
    year.textContent = yearFunc(element);
    const genre = clone.querySelector(".film-genre");
    genre.textContent = genreFunc(element);
    const rate = clone.querySelector(".film-rate");
    rate.textContent = rateFunc(element);
    const slide = clone.querySelector(".swiper-slide");
    slide.addEventListener("click", ()=> {
        createPopup(element, slide);
    })
    swiper.appendChild(clone);
  }

const createPopup = (element, slide) => {
    const template = document.querySelector("#template-popup");
    const clone = template.content.cloneNode(true);
    popupInfo(element, clone);
    closePopupFunc(clone);
    body.appendChild(clone);
}

const popupInfo = async (element, clone) => {
    const poster = clone.querySelector(".film-poster");
    poster.src = posterFunc(element);
    const title = clone.querySelector(".film-title");
    title.textContent = titleFunc(element);
    const year = clone.querySelector(".film-year");
    year.textContent = yearFunc(element);
    const genre = clone.querySelector(".film-genre");
    genre.textContent = genreFunc(element);
    const rate = clone.querySelector(".film-rate");
    rate.textContent = rateFunc(element);
    const overview = clone.querySelector(".film-overview");
    overview.textContent = overviewFunc(element);
    const cast = clone.querySelector(".actors");
    cast.textContent = await castFetchFunc(element, clone);
}

const closePopupFunc = (clone) => {
    const modal = clone.querySelector(".modal-popup");
    document.addEventListener("click", (e) => {
        if (e.target.matches("#popup-cross") || e.target.matches(".modal-popup")) {
            modal.remove();
        }
    })
}

const resetSwiper = (swiper) => {
    swiper.innerHTML = "";
}

const clickedColor = (target) => {
    const list = document.querySelectorAll("#genre-list li");
    list.forEach(element => {
        element.removeAttribute("id");
    })
    target.id = "genre-clicked";
}

const openRegisterModal = () => {
    const template = document.querySelector("#register-template");
    const clone = template.content.cloneNode(true);
    body.appendChild(clone);
    document.addEventListener("click", closeModal);
}

const openSigninModal = () => {
    const template = document.querySelector("#login-template");
    const clone = template.content.cloneNode(true);
    body.appendChild(clone);
    document.addEventListener("click", closeModal);
}

const closeModal = (e) => {
    const closeFunc = () => {
        modal.remove();
        document.removeEventListener("click", closeModal);
    }
    const modal = document.querySelector("#modal");
    if (e.target.matches(".closing-cross")) {
        closeFunc();
    } else if (e.target.matches("#modal")) {
        closeFunc();
    } else if (e.target.matches("#modal-register-btn") && !e.target.matches(".clicked")) {
        closeFunc();
        openRegisterModal();
    } else if (e.target.matches("#modal-login-btn") && !e.target.matches(".clicked")) {
        closeFunc();
        openSigninModal();
    } else if (e.target.matches(".modal-register-btn")) {
        closeFunc();
        openRegisterModal();
    }
}

//// Actions

fetchLatest();
fetchByGenre(35);

//Listener for the fetch by search
document.querySelector("#search-btn").addEventListener("click", (e) => {
    const input = document.querySelector("#search");
    const swiperContainer = document.querySelector("#container-swiper1");
    if (input.value) {
        swiperContainer.classList.remove("hidden");
        resetSwiper(swiper1);
        fetchBySearch(input.value);
        input.value = "";
    }
})
document.querySelector("#searching-bar").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.querySelector("#search");
    const swiperContainer = document.querySelector("#container-swiper1");
    if (input.value) {
        swiperContainer.classList.remove("hidden");
        resetSwiper(swiper1);
        fetchBySearch(input.value);
        input.value = "";
    }
})
// Listener for the fetch by genre
document.querySelector("#genre-list").addEventListener("click", (e) => {
    const changeGenre = (e) => {
        resetSwiper(swiper3);
        clickedColor(e.target);
        const textGenre = document.querySelector("#genre-selected");
        textGenre.textContent = e.target.textContent;
    }
    if (!e.target.matches("#genre-clicked")) {
        if (e.target.matches(".comedy-genre")) {
            changeGenre(e);
            fetchByGenre(35);
        } else if (e.target.matches(".drama-genre")) {
            changeGenre(e);
            fetchByGenre(18);
        } else if (e.target.matches(".action-genre")) {
            changeGenre(e);
            fetchByGenre(28);
        } else if (e.target.matches(".romance-genre")) {
            changeGenre(e);
            fetchByGenre(10749);
        } else if (e.target.matches(".fantasy-genre")) {
            changeGenre(e);
            fetchByGenre(14);
        } else if (e.target.matches(".animation-genre")) {
            changeGenre(e);
            fetchByGenre(16);
        }
    }
})
// Listener for the modals
document.addEventListener("click", (e) => {
    if (e.target.matches(".register-btn")) {
        openRegisterModal();
    } else if (e.target.matches(".signin-btn")) {
        openSigninModal();
    } else if (e.target.matches(".form-btn") || e.target.matches(".forgot-psw")) {
        document.querySelector("#modal").remove();
    } else if (document.querySelector("#burger-check").checked === true && e.target.matches("#burger-check")) {
        const template = document.querySelector("#burger-template");
        const clone = template.content.cloneNode(true);
        body.appendChild(clone);
    } else if (document.querySelector("#burger-check").checked === false && e.target.matches("#burger-check")) {
        const modal = document.querySelector("#modal-burger");
        setTimeout(() => {
            modal.remove();
        }, 500);
    }
})