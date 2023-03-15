import './css/styles.css';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import Notiflix from 'notiflix';
import ImagesApi from './images-api';

const refs = {
  form: document.querySelector('form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
const imagesApi = new ImagesApi();
let count = 0;

async function onSubmit(event) {
  event.preventDefault();
  imagesApi.resetPage();
  refs.loadMoreBtn.classList.add('is-hidden');

  imagesApi.searchQuery = event.currentTarget.elements.searchQuery.value;
  try {
    const { hits, totalHits } = await imagesApi.fetchCardByQuery();

    if (hits.length > 0) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    if (hits.length === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    clearGalleryContainer();
    renderCard(hits);
    refs.loadMoreBtn.classList.remove('is-hidden');
    count = totalHits -40;
    error => console.log(error.message);
  }
}

async function onLoadMore() {
  try {
    const { hits } = await imagesApi.fetchCardByQuery();

    if (count < 40) {
      refs.loadMoreBtn.classList.add('is-hidden');
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    renderCard(hits);
    count -= 40;
  } catch {
    error => console.log(error.message);
  }
}

function renderCard(dataCard) {
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    dataCard
      .map(
        card => `<div class="photo-card">
        <img src="${card.webformatURL}" alt="${card.tags} width = 250 "loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes: ${card.likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${card.views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${card.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${card.downloads}</b>
          </p>
        </div>
      </div>
        `
      )
      .join('')
  );
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = '';
}
