import { Client, Databases, ID, Query } from "appwrite";
interface Movie {
  id: string;
  poster_path: string;
}

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(projectId);
const database = new Databases(client);

export const updateSearchCount = async (searchTerm: string, movie: Movie) => {
    try {
    // 1. Use Appwrite to check if a search term already exists in the database.
    const result = await database.listDocuments(databaseId, collectionId, [
      Query.equal("searchTerm", searchTerm),
    ]);

    // 2. Update the count
    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(databaseId, collectionId, doc.$id, {
        count: doc.count + 1,
      });
    // 3. If search term does not exists, create a new document with the search term and count - set count as 1
    } else {
      await database.createDocument(databaseId, collectionId, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error searching movie");
    }
  }
  
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(databaseId, collectionId, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return result.documents || [];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return []; 
  }
};
