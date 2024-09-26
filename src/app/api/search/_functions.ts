import prisma, { Prisma } from "@prisma/prismaClient";
import { Post, SearchResult, PostContent } from "@types";

export const search = async (term: string): Promise<SearchResult> => {
  const posts = await searchPosts(term);
  const users = await searchUsers(term);
  return { posts, users };
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
