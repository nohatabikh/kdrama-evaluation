  import type { SyntheticEvent } from "react";

  export const DEFAULT_POSTER_URL = "/assets/default-drama-poster.png";

  export const handlePosterError = (
    event: SyntheticEvent<HTMLImageElement>,
  ) => {
    const image = event.currentTarget;

    if (image.src.endsWith(DEFAULT_POSTER_URL)) {
      return;
    }

    image.src = DEFAULT_POSTER_URL;
  };
