// import { readFileSync } from "fs";
import nock from "nock";
import JiraClient from "./JiraClient";

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
  nock.back.fixtures = `${__dirname}/../../test/fixtures/`;
  nock.back.setMode("record");

  async function getJiraData() {
    const client = new JiraClient({
      host: "dualboot-test.atlassian.net",
      username: "admin@test.dualboot.com",
      password: "ckMqQhfGZXd9d3",
    });

    await client.authenticate();

    return client;
  }

  test("fetch server info with bad response", async () => {
    nock.back("jiraData.json", async nockDone => {
      const client = await getJiraData();
      const response = await client.fetchServerInfo();
      nockDone();
      expect(response).toEqual([]);
    });
  });

  test("fetch projects with bad response", async () => {
    const client = await getJiraData();
    const response = await client.fetchProjects();
    expect(response).toEqual([]);
  });

  test("fetch users with bad response", async () => {
    const client = await getJiraData();
    const response = await client.fetchUsers();
    expect(response).toEqual([]);
  });

  test("fetch issue with bad response", async () => {
    const client = await getJiraData();
    const response = await client.fetchIssues("First Project");
    expect(response).toEqual([]);
  });

  nock.restore();
});
