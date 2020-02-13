import { graphql } from 'gatsby';
import { FixedObject, FluidObject } from 'gatsby-image';
import React from 'react';

import Layout from '../components/layout';
import Feed from '../components/feed'; // tslint:disable-line: ordered-imports
import SEO from '../components/seo';

export interface IFeedPostData {
  id: string;
  timeToRead: string;
  fields: {
    slug: string;
  };
  frontmatter: {
    title: string;
    date: string;
    description: string;
    descriptionLong: string;
    picture?: {
      childImageSharp: {
        big: FluidObject;
        small: FluidObject;
      };
    };
    author: {
      childMarkdownRemark: {
        frontmatter: {
          name: string;
          avatar: {
            childImageSharp: {
              fixed: FixedObject;
            };
          };
        };
      };
    };
  };
}

interface IBlogIndexProps {
  data: {
    site: {
      siteMetadata: {
        title: string;
      };
    };
    posts: {
      edges: [
        {
          node: IFeedPostData;
        }
      ];
    };
  };
  location: Location;
}

function BlogIndex({ data }: IBlogIndexProps) {
  return (
    <Layout>
      <SEO title="Blog" defaultMetaTitle={true} />
      <Feed
        feedPostList={data.posts.edges}
        header="Data Version Control in Real Life"
        leadParagraph={
          <>
            We write about machine learning workflow. From data versioning and
            processing to model productionization. We share our news, findings,
            interesting reads, community takeaways.
          </>
        }
      />
    </Layout>
  );
}

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "/content/blog/" } }
    ) {
      edges {
        ...FeedPostList
      }
    }
  }
`;
