import { getReq, postReq } from 'src/api/core';

export async function authenticate(user, password) {
  return postReq(null, 'https://pokeapi.co/api/v2/', {
    user,
    password,
  });
}

export async function getPokemon() {
  return getReq(null, 'https://pokeapi.co/api/v2/pokemon/ditto');
}
