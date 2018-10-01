import React from 'react';

import { Query } from 'react-apollo';
import { GET_CURRENT_USER } from './queries/index';

const withSession = Component => props => (
    <Query query={GET_CURRENT_USER}>
        {({ data : { getCurrentUser }, loading, refetch }) => {
            if (loading) return null;
            return (
                <Component
                    {...props}
                    refetch={refetch}
                    session={getCurrentUser ? getCurrentUser : undefined}
                />
            )
        }}
    </Query>
);

export default withSession;
