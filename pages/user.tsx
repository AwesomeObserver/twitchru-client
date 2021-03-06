import gql from 'graphql-tag';
import Head from 'next/head';
import { RouterProps, withRouter } from 'next/router';
import * as React from 'react';
import { Query } from 'react-apollo';
import Posts from '../components/Posts';
import Streams from '../components/Stream';
import UserPanelProfile from '../components/User/UserPanelProfile';
import Layout from '../layouts/Main';
import styled from '../theme';

const GET_USER = gql`
  query getUser($id: ID) {
    user(id: $id) {
      id
      role
      postsCount
      mainProfile {
        id
        name
        avatar
        serviceName
        serviceId
        visible
      }
      profiles {
        id
        name
        avatar
        serviceName
        serviceId
        visible
      }
    }
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
`;

const PostsBox = styled.div`
  margin: 0 20px;
  display: flex;
  flex: 1;
  flex-direction: column;
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

    let userId;

    if (typeof router.query.id === 'string') {
      userId = router.query.id;
    }

    return (
      <Query query={GET_USER} variables={{ id: userId }}>
        {({ loading, error, data }) => {
          if (loading || error) {
            return null;
          }

          if (!data || !data.user) {
            return 'User not found';
          }

          const user = data.user;

          return (
            <Layout fixedTopContent={<UserPanelProfile user={user} />}>
              <Box>
                <Head>
                  <title>{user.mainProfile.name}</title>
                </Head>

                <PostsBox>
                  <Streams />
                  <Posts title="Клипы" authorId={user.id} sort="new" />
                </PostsBox>
              </Box>
            </Layout>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(UserPage);
