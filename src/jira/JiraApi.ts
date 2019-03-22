import JiraApi from "jira-client";

export default class ExtendedJiraApi extends JiraApi {
  public async findGroups({
    query,
    maxResults,
  }: {
    query: string;
    maxResults?: number;
  }): Promise<JiraApi.JsonResponse> {
    // @ts-ignore: calling private method
    return this.doRequest(
      // @ts-ignore: calling private method
      this.makeRequestHeader(
        // @ts-ignore: calling private method
        this.makeUri({
          pathname: `/groups/picker`,
          query: {
            query,
            maxResults: maxResults || 50,
          },
        }),
      ),
    );
  }
}
