exports.typeDefs = `
    type Recipe { 
        _id: ID
        name: String!
        category: String!
        description: String!
        instructions: String!
        createdDate: String
        likes: Int
        username: String
    }
    
    type Users {
         _id: ID
         name: String! @unique
         password: String!
         email: String!
         avatar: String
         date: String
         favorites: [Recipe]
    }
    
    type Token {
        token: String!
    }        

    
    type Query {
        getAllRecipes: [Recipe]
        
        getRecipe(_id: ID!): Recipe
        
        searchRecipes(searchTerm: String): [Recipe]
        
        getCurrentUser: Users
        
        getUserRecipes(username: String!): [Recipe]
    }
    
    type Mutation {
        addRecipe(
            name: String!,
            description: String!,
            category: String!,
            instructions: String!,
            username: String!
        ): Recipe
        
        deleteUserRecipe(_id: ID!): Recipe
        singinUser(name: String!, password: String!): Token
        
        singupUser(name: String!, email: String!, password: String!): Token
    }
`;
