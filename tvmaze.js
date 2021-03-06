/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const missingImageUrl = 'https://tinyurl.com/tv-missing';
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  //console.log(response.data);
  // console.log(response.data[1].show.image.original)
  let shows = response.data.map(function (showData) {
    JSON.stringify(showData);
    let show = showData.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : missingImageUrl
    }
  })
  return shows;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src=" http://api.tvmaze.com/shows/${show.id}/images">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="getEpisodes btn btn-primary">Show Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  const episodesData = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = episodesData.data.map(function (ep) {

    return {
      id: ep.id,
      name: ep.name,
      season: ep.season,
      number: ep.number
    }
  })
  console.log(episodes);
  return episodes;
}

function populateEpisodes(episodesInfo) {
  const epList = document.getElementById('episodes-list');
  console.log('epiInfo:' + episodesInfo);
  for (let episodeDetails of episodesInfo) {
    let item = (`<li>${episodeDetails.name}(season${episodeDetails.season},number${episodeDetails.number})</li>`);

    epList.append(item);
  }
  $("#episodes-area").show();
}
$('#shows-list').on('click', '.getEpisodes', async function handleClick(evt) {
  let getID = $(evt.target).closest(".Show").data("show-id");
  let getEpisode = await getEpisodes(getID)
  let epis = JSON.stringify(getEpisode);
  populateEpisodes(epis);
});