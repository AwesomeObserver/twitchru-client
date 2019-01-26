import gql from 'graphql-tag';
import Head from 'next/head';
import { RouterProps, withRouter } from 'next/router';
import * as React from 'react';
import { Query } from 'react-apollo';
import RightPanel from '../components/Nav/Right';
import Posts from '../components/Posts';
import Streams from '../components/Streams';
import Layout from '../layouts/Main';
import styled from '../theme';

const GET_TAG = gql`
  query tag($id: ID!) {
    tag(id: $id) {
      id
      title
    }
  }
`;

const Box = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding: 20px 0;
`;

const PostsBox = styled.div`
  margin: 0 20px;
  display: flex;
  flex: 1;
  border-radius: 5px;
  overflow: hidden;
`;

interface IProps {
  router: RouterProps;
}

class UserPage extends React.Component<IProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const { router } = this.props;

    let tagId;

    if (typeof router.query.id === 'string') {
      tagId = router.query.id;
    }

    return (
      <Layout>
        <Box>
          <Query query={GET_TAG} variables={{ id: tagId }}>
            {({ loading, error, data }) => {
              if (loading) {
                return null;
              }

              if (error || !data || !data.tag) {
                return null;
              }

              return (
                <>
                  <Head>
                    <title>#{data.tag.title}</title>
                  </Head>
                  <PostsBox>
                    <Posts
                      title={`#${data.tag.title}`}
                      tagId={tagId}
                      sort="new"
                    />
                  </PostsBox>
                  <RightPanel.Box>
                    <RightPanel.Block>
                      <Streams />
                    </RightPanel.Block>
                  </RightPanel.Box>
                </>
              );
            }}
          </Query>
        </Box>
      </Layout>
    );
  }
}

export default withRouter(UserPage);
