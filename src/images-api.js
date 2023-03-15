const API_KEY = '14836280-095028a335045ad546bd82bf5';
export default class ImagesApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.quantity = 40;
  }

  fetchCardByQuery() {
    return fetch(
      `https://pixabay.com/api/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.quantity}`
    ).then(response => {
      if (!response.ok) {
        return;
      }
      this.incrementPage();
      return response.json();
    });
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
