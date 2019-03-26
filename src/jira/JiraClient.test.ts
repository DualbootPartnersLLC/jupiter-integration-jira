// import { readFileSync } from "fs";
import "jest-extended";
import nock from "nock";
import JiraClient from "./JiraClient";

// import { Issue, Project, ServerInfo, User } from "./types";

// jest.mock("jira-client", () => {
//   return jest.fn().mockImplementation(() => {
//     return {
//       getServerInfo: readFixture(`${__dirname}/../../test/fixtures/badResponse.json`),
//       listProjects: readFixture(`${__dirname}/../../test/fixtures/badResponse.json`),
//       searchJira: readFixture(`${__dirname}/../../test/fixtures/badResponse.json`),
//       searchUsers: readFixture(`${__dirname}/../../test/fixtures/badResponse.json`),
//     };
//   });
// });
//
// function readFixture(path: string) {
//   return async () => {
//     const raw = readFileSync(path);
//     const result = JSON.parse(raw.toString());
//     return result;
//   };
// }
describe("JiraClient test", () => {
  beforeAll(() => {
    nock.back.fixtures = `${__dirname}/../../test/fixtures/`;
    nock.back.setMode("record");
  });

  async function getAuthenticatedClient() {
    const client = new JiraClient({
      host: "dualboot-test.atlassian.net",
      username: "admin@test.dualboot.com",
      password: "ckMqQhfGZXd9d3",
    });

    await client.authenticate();
    return client;
  }

  test("fetch server info with ok", async () => {
    const { nockDone } = await nock.back("server-info-ok.json");
    const client = await getAuthenticatedClient();
    const response = await client.fetchServerInfo();
    expect(response).toContainKeys(["baseUrl", "serverTitle"]);
    nockDone();
  });

  // test("fetch server info with bad", async () => {
  //   const { nockDone } = await nock.back('server-info-bad.json');
  //   const client = await getAuthenticatedClient();
  //   await client.fetchServerInfo();
  //   // expect(response).toContainKeys(['baseUrl', 'serverTitle']);
  //   nockDone();
  // });

  test("fetch projects info with ok", async () => {
    const { nockDone } = await nock.back("projects-ok.json");
    const client = await getAuthenticatedClient();
    await client.fetchProjects();
    // expect(response).toContainKeys(['baseUrl', 'serverTitle']);
    nockDone();
  });

  // test("fetch projects with bad response", async () => {
  //   const client = await getAuthenticatedClient();
  //   const response = await client.fetchProjects();
  //   expect(response).toEqual([]);
  // });

  // test("fetch users with bad response", async () => {
  //   const client = await getAuthenticatedClient();
  //   const response = await client.fetchUsers();
  //   expect(response).toEqual([]);
  // });

  // test("fetch issue with bad response", async () => {
  //   const client = await getAuthenticatedClient();
  //   const response = await client.fetchIssues("First Project");
  //   expect(response).toEqual([]);
  // });

  nock.restore();
});
