var imdb = imdb || {};

(function (scope) {
	function loadHtml(selector, data) {
		var container = document.querySelector(selector),
			moviesContainer = document.getElementById('movies'),
			detailsContainer = document.getElementById('details'),
			genresUl = loadGenres(data);

		container.appendChild(genresUl);

		genresUl.addEventListener('click', function (ev) {
			if (ev.target.tagName === 'LI') {
				var genreId,
					genre,
					moviesHtml;

				genreId = parseInt(ev.target.getAttribute('data-id'));
				genre = data.filter(function (genre) {
					return genre._id === genreId;
				})[0];


				moviesHtml = loadMovies(genre.getMovies());
				moviesContainer.innerHTML = moviesHtml.outerHTML;
				moviesContainer.setAttribute('data-genre-id', genreId);
				
				var movieNodes = Array.prototype.slice.call(moviesContainer.firstElementChild.childNodes);
				
				movieNodes.forEach(function (node) {
					node.addEventListener('click', function () {
						detailsContainer.innerHTML = '';

						// other way of empty nodeTag in html:
						// while(detailsContainer.firstElementChild) {
						// 	detailsContainer.removeChild(detailsContainer.firstElementChild);
						// }
						var movieId = this.getAttribute('data-id');
						var movie = genre.getMovies().filter(function(thisMovie) {
							return thisMovie._id == movieId;
						})[0];
						var actors = movie.getActors();
						var reviews = movie.getReviews();

						var actorsFragment = document.createDocumentFragment();
						var actorsH3 = document.createElement('h3');
						actorsH3.innerHTML = 'Actors';
						var actorsUl = document.createElement('ul');
						actors.forEach(function (actor) {
							var li = document.createElement('li');
							var h4 = document.createElement('h4');
							h4.innerHTML = actor.name;
							var p = document.createElement('p');
							p.innerHTML = '<strong>Bio: </strong>' + actor.bio + '<br>' + '<strong>Born: </strong>' + actor.born;
							li.appendChild(h4);
							li.appendChild(p);
							actorsUl.appendChild(li);
						});
						actorsFragment.appendChild(actorsH3);
						actorsFragment.appendChild(actorsUl);

						var reviewsFragment = document.createDocumentFragment();
						var reviewsH3 = document.createElement('h3');
						reviewsH3.innerHTML = 'Reviews';
						var reviewsUl = document.createElement('ul');
						reviews.forEach(function (review) {
							var li = document.createElement('li');
							var h4 = document.createElement('h4');
							h4.innerHTML = review.author;
							var p = document.createElement('p');
							p.innerHTML = '<strong>Content: </strong>' + review.content + '<br>' + '<strong>Date: </strong>' + review.date;
							var button = document.createElement('button');
							button.value = 'Delete';
							button.innerHTML = 'Delete Review';

							button.addEventListener('click', function () {
								movie.deleteReviewById(review._id);
								reviewsUl.removeChild(li);
							});

							li.appendChild(h4);
							li.appendChild(p);
							li.appendChild(button);
							reviewsUl.appendChild(li);
						});
						reviewsFragment.appendChild(reviewsH3);
						reviewsFragment.appendChild(reviewsUl);

						detailsContainer.appendChild(actorsFragment);
						detailsContainer.appendChild(reviewsFragment);
					});
				});
			}
		});

		// Task 2 - Add event listener for movies boxes
	}

	function loadGenres(genres) {
		var genresUl = document.createElement('ul');
		genresUl.setAttribute('class', 'nav navbar-nav');
		genres.forEach(function (genre) {
			var liGenre = document.createElement('li');
			liGenre.innerHTML = genre.name;
			liGenre.setAttribute('data-id', genre._id);
			genresUl.appendChild(liGenre);
		});

		return genresUl;
	}

	function loadMovies(movies) {
		var moviesUl = document.createElement('ul');
		movies.forEach(function (movie) {
			var liMovie = document.createElement('li');
			liMovie.setAttribute('data-id', movie._id);

			liMovie.innerHTML = '<h3>' + movie.title + '</h3>';
			liMovie.innerHTML += '<div>Country: ' + movie.country + '</div>';
			liMovie.innerHTML += '<div>Time: ' + movie.length + '</div>';
			liMovie.innerHTML += '<div>Rating: ' + movie.rating + '</div>';
			liMovie.innerHTML += '<div>Actors: ' + movie._actors.length + '</div>';
			liMovie.innerHTML += '<div>Reviews: ' + movie._reviews.length + '</div>';
			
			moviesUl.appendChild(liMovie);
		});

		return moviesUl;
	}

	function loadMovieInfo(reviews) {
		var actorsFragment = document.createDocumentFragment();
		var actorsH3 = document.createElement('h3');
		actorsH3.innerHTML = 'Actors';
		var actorsUl = document.createElement('ul');
		actors.forEach(function (actor) {
			var li = document.createElement('li');
			var h4 = document.createElement('h4');
			h4.innerHTML = actor.name;
			var p = document.createElement('p');
			p.innerHTML = '<strong>Bio: </strong>' + actor.bio + '<br>' + '<strong>Born: </strong>' + actor.born;
			li.appendChild(h4);
			li.appendChild(p);
			actorsUl.appendChild(li);
		});
		actorsFragment.appendChild(actorsH3);
		actorsFragment.appendChild(actorsUl);

		detailsContainer.appendChild(actorsFragment);

		return detailsContainer;
	}

	scope.loadHtml = loadHtml;
}(imdb));