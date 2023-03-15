import './css/styles.css';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import Notiflix from 'notiflix';
import ImagesApi from './images-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const imagesApi = new ImagesApi();

let galery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  showCounter: false,
  docClose: true,
  sourceAttr: 'href',
  scrollZoom: false,
});

async function onSubmit(event) {
  event.preventDefault();
  imagesApi.resetPage();

  refs.loadMoreBtn.classList.add('is-hidden');

  imagesApi.searchQuery = event.currentTarget.elements.searchQuery.value;

  try {
    const { hits, totalHits } = await imagesApi.fetchCardByQuery();

    if (hits.length === 0 || imagesApi.searchQuery === '') {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (hits.length > 0) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    clearGalleryContainer();
    renderCard(hits);
    galery.refresh();
    eazyLoadingImages();
    refs.loadMoreBtn.classList.remove('is-hidden');
  } catch {
    error => console.log(error.message);
  }
}

async function onLoadMore() {
  try {
    const { hits, totalHits } = await imagesApi.fetchCardByQuery();
    const totalPages = totalHits / imagesApi.quantity;
    if (imagesApi.page > totalPages) {
      refs.loadMoreBtn.classList.add('is-hidden');
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    renderCard(hits);
    galery.refresh();

    eazyLoadingImages();
  } catch {
    error => console.log(error.message);
  }
}

function renderCard(dataCard) {
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    dataCard
      .map(
        card => `<a class="photo-card" href="${card.largeImageURL}"> <div >
       <img src="${card.webformatURL}" alt="${card.tags}" width = 250 "loading="lazy" />
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
      </div></a>
        `
      )
      .join('')
  );
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = '';
}

function eazyLoadingImages() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
