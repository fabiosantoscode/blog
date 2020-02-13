import { graphql } from 'gatsby';

import React from 'react';

import cn from 'classnames';

import { IFeedPostData } from '../../pages/index';

import FeedItem from './item';

import styles from './styles.module.css';

interface IFeedProps {
  feedPostList: Array<{
    node: IFeedPostData;
  }>;
  bigFirst?: boolean;
  header: React.ReactNode;
  leadParagraph?: React.ReactNode;
}

function Feed({
  feedPostList,
  bigFirst = true,
  header,
  leadParagraph
}: IFeedProps) {
  return (
    <div className={styles.wrapper}>
      <div
        className={cn(styles.meta, {
          [styles.metaSlim]: bigFirst
        })}
      >
        <h2 className={styles.header}>{header}</h2>
        {leadParagraph && <div className={styles.lead}>{leadParagraph}</div>}
      </div>
      <div className={styles.posts}>
        {feedPostList.map(({ node }, index) => (
          <FeedItem
            feedPost={node}
            key={node.id}
            big={bigFirst && index === 0}
          />
        ))}
      </div>
    </div>
  );
}

export const query = graphql`
  fragment FeedPostList on MarkdownRemarkEdge {
    node {
      ...FeedPost
    }
  }
`;

export default Feed;
