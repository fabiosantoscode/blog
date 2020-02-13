// Components
import { graphql } from 'gatsby';
import React from 'react';

import Feed from '../components/feed';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { IFeedPostData } from '../pages/index';

interface IListQueryResult<ResultItem> {
  totalCount: number;
  edges: Array<{ node: ResultItem }>;
}

interface ITagPageTemplateProps {
  pageContext: {
    tag: string;
  };
  data: {
    posts: IListQueryResult<IFeedPostData>;
  };
}

const Tags = ({
  pageContext: { tag },
  data: { posts }
}: ITagPageTemplateProps) => {
  const title = `Posts tagged with "${tag}"`;

  return (
    <Layout>
      <SEO title={title} defaultMetaTitle={true} />
      <Feed feedPostList={posts.edges} bigFirst={false} header={title} />
    </Layout>
  );
};

export default Tags;

export const pageQuery = graphql`
  query($tag: String) {
    posts: allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        ...FeedPostList
      }
    }
  }
`;
