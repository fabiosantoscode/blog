import Image from 'gatsby-image';
import React from 'react';

import { imageMaxWidthHero } from '../../constants';
import { IBlogPostHero, IGatsbyImageProps } from '../../templates/blog-post';

import styles from './styles.module.css';

function NonStretchedImage(props: IGatsbyImageProps) {
  let normalizedProps = props;
  if (props.fluid && props.fluid.presentationWidth) {
    const presetantionWidth = props.fluid?.presentationWidth;
    const width =
      presetantionWidth < imageMaxWidthHero
        ? presetantionWidth / 2
        : presetantionWidth;
    normalizedProps = {
      ...props,
      style: {
        ...(props.style || {}),
        maxWidth: width,
        margin: '0 auto'
      }
    };
  }
  return <Image {...normalizedProps} />;
}

function Hero({ pictureComment, picture }: IBlogPostHero) {
  return (
    <div className={styles.pictureWrapper}>
      <div className={styles.picture}>
        <NonStretchedImage fluid={picture?.childImageSharp.fluid} />
      </div>
      {pictureComment && (
        <div className={styles.pictureComment}>{pictureComment}</div>
      )}
    </div>
  );
}

export default Hero;
