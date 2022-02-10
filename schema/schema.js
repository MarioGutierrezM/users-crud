const graphql = require("graphql");
const axios = require("axios");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;


// Note: we solved the circular reference problem (userType -> company & CompanyType -> users) by adding a callback in the fileds property.
//  Because it is in a closure, it gets defined but not executed until the rest of the code is executed.

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then((res) => res.data);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((res) => res.data);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((resp) => resp.data)
          .catch(err => console.log('error', err));
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((resp) => resp.data);
      },
    },
  },
});

// mutations are made to change the data, every mutation must have an specific name (addUser, deleteUser)
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age, companyId }) {
        return axios.post('http://localhost:3000/users', { firstName, age, companyId })
          .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(res => res.data);
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { id, firstName, age, companyId }) {
        return axios.patch(`http://localhost:3000/users/${id}`, { firstName, age, companyId })
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  mutation,
  query: RootQuery,
});

/*

  * * *  Queries  * * * 

  Ex 1 - simple
  {
    company(id: "1") {
      name
      users {
        firstName
      }
    }
  }

  Ex 2 - naming the query
  query findCompany {
    company(id: "1") {
      name
      users {
        firstName
      }
    }
  }

  Ex 3 - getting more companies in the same query
  {
    companyA: company(id: "1") {
      name
      users {
        firstName
      }
    }
    companyB: company(id: "2") {
      name
      users {
        firstName
      }
    }
  }


  * * *  Fragments  * * * 

  fragment companyDetails on Company {
    id
    name
    description
  }

  Then ...

  {
    companyA: company(id: "1") {
      ...companyDetails
    }
    companyB: company(id: "2") {
      ...companyDetails
    }
  }


  * * * Mutations * * * 

  mutation {
    addUser(firstName: "Mario", age: 26) {
      id,
      firstName,
    }
  }

  mutation {
    deleteUser(id: "40") {
      id,
    }
  }

*/
