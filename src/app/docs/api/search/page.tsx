"use client";
// types
import { TsearchResultString } from "@types";
// components
import Docs from "@docComponents/docs";
import Api from "@docComponents/api";

const SearchDocs = () => {
  return (
    <Docs title="Search">
      <Docs.Introduction>
        <Api.Path path="/api/search" />
        <Api.Method method="GET" />

        <Docs.Description>
          {
            "This endpoint allows users to search for posts, users, and documentation. The user must provide a search query parameter `q` with a minimum length of 3 characters and a maximum length of 20 characters."
          }
        </Docs.Description>
        <Docs.Description>
          <Docs.Hr />
          <h3 className="font-bold text-lg mb-3">Federated Search</h3>
          <p className="my-4">
            The mechanics of the search are implemented from scratch. It finds
            results for the search term from three different data. On the
            client, in the search form, data fetch runs after the thrid written
            character and after 1 second of inactivity on the keyboard.
          </p>
          <p className="mb-4 w-3/4">
            The search functionality is implemented in the _functions.ts file
            and works as follows:
          </p>
          <ul className="flex flex-col text-base list-decimal gap-3 p-4 px-6 text-pretty bg-neutral-700/50 rounded">
            <li>
              <b>Search Term Validation:</b> The search term is validated to
              ensure it is between 3 and 20 characters long.
            </li>
            <li>
              <b>Search Posts:</b> The searchPosts function queries the database
              for posts containing the search term using PostgreSQLs full-text
              search capabilities. It returns a list of posts that match the
              search term.
            </li>
            <li>
              <b>Search Users:</b> The searchUsers function queries the database
              for users whose names contain the search term.
            </li>
            <li>
              <b>Search Documentation:</b> The searchDocumentation function
              searches through the API routes to find documentation links that
              match the search term.
            </li>
            <li>
              <b>Combining Results:</b> The results from the posts, users, and
              documentation searches are combined into a single SearchResult
              object and returned to the client.
            </li>
          </ul>
        </Docs.Description>
      </Docs.Introduction>
      <Docs.CloseFoldersBtn />
      <div className="flex flex-col gap-2">
        <Docs.Folder title="Query Parameters">
          <Docs.Table
            description="The query parameters contain the following fields."
            items={[
              {
                key: "q",
                type: "string",
                description: "The search term to query.",
              },
            ]}
          />

          <Api.Code
            title="Query example:"
            description="Search request contains the search term as a query parameter."
          >
            {`/api/search?q=example`}
          </Api.Code>
        </Docs.Folder>
        <Docs.Folder title="Types">
          <Api.Code>{TsearchResultString}</Api.Code>
        </Docs.Folder>
        <Docs.Folder title="Response Codes">
          <Api.ResponseCodes
            title="Success Codes"
            codes={[
              { code: 200, message: "Search results returned successfully." },
            ]}
          />
          <Docs.Hr />
          <Api.ResponseCodes
            title="Error Codes"
            codes={[
              { code: 400, message: "Bad request." },
              { code: 500, message: "Internal Server Error." },
            ]}
          />
        </Docs.Folder>
      </div>
    </Docs>
  );
};

export default SearchDocs;
