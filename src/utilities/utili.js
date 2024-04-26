export const setItem = (itemname, item) => {
  localStorage.setItem(itemname, item);
};

export const getItem = (itemname) => {
  return localStorage.getItem(itemname);
};

export const removeItem = (itemname) => {
  localStorage.removeItem(itemname);
};

export const getFormattedDate = (date) => {
  const formattedDate = new Date(date);
  return formattedDate.toLocaleDateString("en-GB");
};

export function formatDateFromString(dateString) {
  // Parse the date string as UTC
  const date = new Date(dateString);

  // Format the date
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC', // Ensure the date is treated as UTC
    month: 'short', // "short" for abbreviated month name (e.g., "Oct")
    day: '2-digit', // "2-digit" for two-digit day
    year: 'numeric' // "numeric" for full numeric year
  });
};

export const getMediaFile = (media) => {
  // Define media query conditions for different image size categories
  const mediaQueries = {
    very_small: "(max-width: 319px)",
    small: "(min-width: 320px) and (max-width: 499px)",
    medium_small: "(min-width: 500px) and (max-width: 749px)",
    medium: "(min-width: 750px) and (max-width: 999px)",
    medium_large: "(min-width: 1000px) and (max-width: 1499px)",
    large: "(min-width: 1500px) and (max-width: 2499px)",
    very_large: "(min-width: 2500px)",
  };

  let preferredSize = null;

  // Determine the preferred size based on the media query
  for (const size in mediaQueries) {
    if (window.matchMedia(mediaQueries[size]).matches) {
      preferredSize = size;
      break;
    }
  }

  // If a preferred size is determined, attempt to find a media file that matches
  if (preferredSize) {
    // Flatten the array of arrays to make it easier to search through all media items
    const flatMedia = media.flat();

    const file = flatMedia.find(file => file.size === preferredSize);
    if (file) return file;
  }

  // Fallback logic: return the smallest available size or a specific default if no size matches
  // Flatten the media array for the fallback scenario as well
  const flatMedia = media.flat();

  return flatMedia.find(file => file.size) || null;
};

export const getImageFromList = (media, size) => {
  console.log("User requesting a " + size + " image");
  let image = "";
  console.log(media);
  // if (size == 'thumbnail'){

  // }
  // else if (size == 'very_small'){

  // }
  // else if (size == 'small'){

  // }
  // else if (size == 'medium_small'){

  // }
  // else if (size == 'medium'){

  // }
  // else if (size == 'medium_large'){

  // }
  // else if (size == 'large'){

  // }
  // else if (size == 'very_large'){

  // }
  // else if (size == 'original'){

  // }

  for (let index in media) {
    let item = media[index];
    if (item.size === size) {
      image = item.link;
      console.log("Returning image: " + image);
    }
  }

  return image;
};
