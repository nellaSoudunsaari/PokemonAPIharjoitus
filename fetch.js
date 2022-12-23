let pokemonName = "";

// ladataan localstorageen tallennetut pokemonit ja näytetään ne listana
function loadCache() {
  // haetaan varastoitujen pokemonien listan html-elementti ja tyhjennetään se
  var cache = document.getElementById("cache");
  cache.innerHTML = "";

  
  // loopataan localstorage läpi, tehdään jokaisen varastoidun pokemonin nimelle iso alkukirjain
  for (let index = 0; index < localStorage.length; index ++) {
    let name = localStorage.key(index);
    let nameUpper = name.charAt(0).toUpperCase() + name.slice(1);

    let thumbnailUrl = JSON.parse(localStorage.getItem(name)).sprites.front_default;
    // joka storage itemille luodaan oma linkki, jonka teksti on itemin "key", isolla alkukirjaimella
    // let ikoniurl = pokemonData['sprites']['versions']['generation-viii']['icons']['front_default'];
    // document.getElementById("artwork").setAttribute("src", ikoniurl);
    cache.innerHTML += 
    `<li><img src="" alt="" id="icon"><a href="#" onclick="requestPokemon('${name}')"><img src="${thumbnailUrl}" class="miniimg" />${nameUpper}</a></li>`;
  }
}

// näytetään APIsta tai localstoragesta haetun pokemonin tiedot
function displayPokemon(pokemonData){
  console.log(pokemonData);
  // näyttää pokemonin kuvan  ['versions']['generation-v']['black-white']['animated']['front_default']
  let imageurl = pokemonData['sprites']['other']['official-artwork']['front_default'];
  document.getElementById("artwork").setAttribute("src", imageurl);

  // näyttää perustiedot, nimen, pituuden ja painon
  document.getElementById("title").innerHTML = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
  document.getElementById("xp").innerHTML = "Base XP. " + pokemonData.base_experience;
  document.getElementById("height").innerHTML = "Height: " + pokemonData.height + " ft";
  document.getElementById("weight").innerHTML = "Weight: " + pokemonData.height + " lbs";

  document.getElementById("types").innerHTML = "";

  if(pokemonData.types.length > 1)
    document.getElementById("types").innerHTML += "<p>Types: </p>";
  else
    document.getElementById("types").innerHTML += "<p>Type: </p>";

  pokemonData.types.forEach( type => {
    document.getElementById("types").innerHTMl += `<li>${type.type.name}</li>`
  });

  //statsit
  document.getElementById("stats").innerHTML = "";
  for (let index = 0; index < pokemonData.stats.length; index++) {
    var stat = pokemonData.stats[index];
    document.getElementById("stats").innerHTML += `<li>${stat.stat.name}, base value: ${stat.base_stat}, effort: ${stat.effort}</li>`
  }
  
  // abilityt
  document.getElementById("abilities").innerHTML = "";
  pokemonData.abilities.forEach(ability => {
    document.getElementById("abilities").innerHTML += `<li>${ability.ability.name}</li>`
  });

  // !!! siirretty displayMoves() funktioon moves.js koodissa
  /*
  //movet
  document.getElementById("moves").innerHTML = "";
  pokemonData.moves.forEach(move => {
    document.getElementById("moves").innerHTML += `<li>${move.move.name}</li>`
  });*/

  // näytetään liikkeet hakemalla ne toisesta tiedostosta
  displayMoves();

  // päivitetään localStoragen pokemonien lista
  loadCache();
}

// tallennetaan pokemon localstorageen
function storePokemon(pokemon) {
  console.log("Tallennetaan: " + pokemon);
  window.localStorage.setItem(pokemon.name, JSON.stringify(pokemon));
  displayPokemon(pokemon);
}

// pyydetään pokemonia annetulla nimellä
function requestPokemon (cachedName = "") {

  if(cachedName !== "")
    pokemonName = cachedName;
  else
    pokemonName = document.getElementById("name").value;

  // yritetään etsiä pokemonia muistista
  var storedPokemon = localStorage.getItem(pokemonName);
  // näyttää pokemonin, mikäli löytyi muistista
  if (storedPokemon !== null) {
    console.log("Pokemon löytyi muistista! Ladataan...");
    displayPokemon(JSON.parse(storedPokemon));
  }
  // haetaan netistä pokemonia, jos muistista ei löydy
  else {
    console.log("Ei löytynyt! Haetaan netistä...");
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then(response => response.json())
    .then(data => storePokemon(data));
  }
}

// random pokemon
function randomPokemon() {

  console.log("Haetaan satunnainen pokemon apista")

  let randomPokemonID;

  fetch(`https://pokeapi.co/api/v2/pokemon/`)
  .then(response => response.json())
  .then(data => {
    let allPokemonCount = data.count;
    console.log("Pokemoneja yhteensä: " + allPokemonCount)
      // luo satunnainen luku välille 1-700 jotain
    randomPokemonID = Math.floor(Math.random() * (allPokemonCount - 1));
    console.log("Arvottu ID: " + randomPokemonID);

      fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonID}`)
      .then(response => response.json())
      .then(data => {
        storePokemon(data);
      });
  });


  // hae pokemon apista luvun mukaan (pokemonin ID)

  // tarkista löytyykö satunnainen pokemon jo, jos löytyy, hae uusi

  // tallenna pokemonin tiedot localstorageen, jos niitä ei ole siellä jo

  // näytä pokemonin tiedot ja päivitä se cache listaan 
}