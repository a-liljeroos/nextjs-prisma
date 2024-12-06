import prisma, { Prisma } from "@prisma/prismaClient";
import { Post, SearchResult, DocSearchResult, PostContent } from "@types";
import { apiRoutes } from "@/app/docs/endpoints";

export const search = async (term: string): Promise<SearchResult> => {
  const posts = await searchPosts(term);
  const users = await searchUsers(term);
  const docs = searchDocumentation(term);
  return { posts, users, docs };
};

const searchDocumentation = (term: string): DocSearchResult[] => {
  let docs: DocSearchResult[] = [];
  const regex = /doc/i;
  if (regex.test(term)) {
    docs = [{ link: "/docs" }];
  }
  apiRoutes.forEach((route, i) => {
    const splitRoute = route.split("/");
    if (searchArrayWithRegex(splitRoute, term)) {
      docs.push({ link: "/docs" + route });
    }
  });
  return docs.sort((a, b) => a.link.localeCompare(b.link));
};

const searchUsers = async (term: string) => {
  try {
    const result = await prisma.user.findMany({
      where: {
        name: {
          contains: term,
        },
      },
      select: {
        name: true,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const searchPosts = async (term: string) => {
  try {
    const posts = await getPosts(term);
    if (posts.length === 0) {
      return [];
    }
    const prunedPosts = posts.map((post) => prunePost(post, term));
    return prunedPosts;
  } catch (error) {
    console.error(error);
    return [];
  }
};

function searchArrayWithRegex(array: string[], searchTerm: string): boolean {
  if (!searchTerm) return false;
  const regex = new RegExp(searchTerm, "i");
  return array.some((item) => regex.test(item));
}

const prunePost = (post: Post, term: string) => {
  term = term.toLowerCase();
  const sample = sampleContent(post.content, term);
  return {
    id: post.id,
    authorId: post.authorId,
    title: post.title,
    sample: sample,
  };
};

const sampleContent = (content: PostContent[], term: string) => {
  let sample = content.find((content) => {
    const text = content.content.toLowerCase();
    if (text.includes(term)) {
      return content;
    }
  });
  if (!sample) {
    return "";
  }
  const clippedSample = clipSample(sample.content, term);
  return clippedSample;
};

const clipSample = (content: string, term: string) => {
  const text = content.toLowerCase();
  const index = text.indexOf(term);
  const start = index - 40 > 0 ? index - 40 : 0;
  const end = index + 50 < content.length ? index + 50 : content.length;
  return content.slice(start, end);
};

const getPosts = async (term: string) => {
  try {
    const result: Post[] =
      await prisma.$queryRaw`SELECT * FROM "Post" WHERE to_tsvector('english', "Post"."content") @@ to_tsquery('english', ${term});`;

    if (result.length > 0) {
      return result;
    }

    term = term + ":*";

    const resultWithWildcardTerm: Post[] =
      await prisma.$queryRaw`SELECT * FROM "Post" WHERE to_tsvector('english', "Post"."content") @@ to_tsquery('english', ${term});`;

    return resultWithWildcardTerm;
  } catch (error) {
    console.error(error);
    return [];
  }
};
