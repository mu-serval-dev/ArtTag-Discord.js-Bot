import { isTag, type Tag } from "../types.js";
import config from '../../config.json' with { type: 'json'};

/**
 * Connection to API.
 */
class ArtTagRepository {
    async getTags(createdAfter:string|null = null): Promise<Tag[]> {
        try {
            const url = new URL("/tags/list", config.apiURL)
            if (createdAfter) {
                url.searchParams.append('created_after', createdAfter)
            }
            // console.log(url.toString())
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`getTags: Response status: ${response.status}`)
            }

            const json = await response.json()
            if (!Array.isArray(json)) {
                throw new Error(`getTags: Response is not an array: ${json}`)
            }
            return json;
        }
        catch (error) {
            console.error(error)
            return []
        }
    }
}

export const repo = Object.freeze(new ArtTagRepository())