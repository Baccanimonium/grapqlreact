const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const createToken = (user, secret, expiresIn) => {
    const {name, email} = user;
    return jwt.sign({name, email}, secret, {expiresIn});
};

exports.resolvers = {
    Query: {
        getAllRecipes: async (root, args, { Recipe }) => {
            return await Recipe.find();
        },

        getRecipe: async (root, { _id }, { Recipe }) => {
            return await Recipe.findOne({ _id });
        },

        searchRecipes: async (root, { searchTerm }, { Recipe }) => {

            if (searchTerm) {
                return await Recipe.find(
                    {
                        $text: { $search: searchTerm }
                    },
                    {
                        score: { $meta: "textScore" }
                    }
                ).sort({
                        score: { $meta: "textScore" }
                    });
            } else {
                return await Recipe.find()
                    .sort({
                        likes: 'desc',
                        createdDate: 'desc',
                    });
            }
        },

        getCurrentUser: async (root, args, { currentUser, User }) => {
            if (!currentUser) {
                return null;
            }
            return await User.findOne({ name: currentUser.name })
                .populate({
                    path: 'favorites',
                    model: 'recipe'
                });
        },
        getUserRecipes: async (root, { username }, { Recipe }) => {
            return await Recipe.find({ username })
                .sort({
                    createdDate: 'desc',
                });
        }
    },

    Mutation: {
        addRecipe: async (root, { name, description, category, instructions, username },
            { Recipe }) => {
            return await new Recipe({
                name,
                description,
                category,
                instructions,
                username
            }).save();
        },

        singinUser: async (root, {name, password}, { User }) => {
            const user = await User.findOne({name});
            if (!user) {
                throw new Error('User not found');
            }

            const isValidPassword = await bcryptjs.compare(password, user.password);

            if (!isValidPassword) {
                throw new Error('Invalid password');
            }

            return {token: createToken(user, process.env.SECRET, '1hr')}
        },

        deleteUserRecipe: async (root, { _id }, { Recipe }) => {
            return await Recipe.findOneAndRemove({ _id });
        },

        singupUser: async (root, {name, email, password}, { User }) => {
            const user = await User.findOne({email});

            if(user) {
                throw new Error('User already exist');
            }

            const newUser = await new User({
                name,
                password,
                email
            }).save();

            return {token: createToken(newUser, process.env.SECRET, '1hr')}
        }
    }
};
