import express from 'express';
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config({path: 'variables.env'});

const bodyParser = require('body-parser');
const passport = require('passport');

// models
const Recipe = require('./models/Recipe');
const User = require('./models/User');

// graphQL middleware
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const post = require('./routes/api/post');

const app = express();

const corsOptions = {
    origin: 'http://localhost:4000',
    credentials: true
};

app.use(cors(corsOptions));

// set up jwt authentication middleware
app.use(async(req, res, next) => {
    const token = req.headers['authorization'];
    console.log(token, Date.now)
    if (token !== 'null') {
        try {
            req.currentUser = await jwt.verify(token, process.env.SECRET);
        }
        catch (e) {
            console.log(e);
        }
    }
    next();
});
// create graphql aplication
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

// connect schemas to graphql
app.use('/graphql',bodyParser.json(), graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
        Recipe,
        User,
        currentUser
    }
})));
// Body parser middleware
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongolocal;
// connect to mongo DB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
// passport middleware
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);

// use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/post', post);

const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
