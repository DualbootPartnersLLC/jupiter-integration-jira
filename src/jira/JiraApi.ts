import JiraApi from "jira-client";

export default class ExtendedJiraApi extends JiraApi {
  public async serverInfo(): Promise<JiraApi.JsonResponse> {
    // @ts-ignore: calling private method
    return this.doRequest(
      // @ts-ignore: calling private method
      this.makeRequestHeader(
        // @ts-ignore: calling private method
        this.makeUri({
          pathname: `/serverInfo`,
        }),
      ),
    );
  }
}
