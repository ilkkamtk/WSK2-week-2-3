import fetchData from '../api/lib/fetchData';
import {ImageFromWikipedia} from '../types/ImageFromWikipedia';

export default async (query: string) => {
  try {
    const url = `http://en.wikipedia.org/w/api.php?action=query&titles=${query}&prop=pageimages&format=json&pithumbsize=640&formatversion=2`;
    const imageData = await fetchData<ImageFromWikipedia>(url);
    console.log(imageData.query.pages);
    return imageData.query.pages[0].thumbnail.source;
  } catch (error) {
    return `https://via.placeholder.com/640x480?text=${query}`;
  }
};
