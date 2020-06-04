import { getReq, postReq } from 'src/api/core';

export async function postCustomerAvailability(data) {
  return postReq(
    null,
    'https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=9f16669731fab971ecfbe84705a6',
    data,
  );
}

export async function getCustomers() {
  return getReq(
    null,
    'https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=9f16669731fab971ecfbe84705a6',
  );
}
