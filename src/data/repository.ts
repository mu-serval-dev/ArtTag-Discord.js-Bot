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
                throw new Error(`received status ${response.status}`)
            }

            const json = await response.json()
            if (!Array.isArray(json)) {
                throw new Error(`response is not an array, got ${json}`)
            }
            return json;
        }
        catch (error) {
            console.error("[ERROR] getTags failed to fetch:", error)
            return []
        }
    }

    async getArtists(createdAfter:string|null = null): Promise<Tag[]> {
        try {
            const url = new URL("/artists/list", config.apiURL)
            if (createdAfter) {
                url.searchParams.append('created_after', createdAfter)
            }
            // console.log(url.toString())
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`received status ${response.status}`)
            }

            const json = await response.json()
            if (!Array.isArray(json)) {
                throw new Error(`response is not an array, got ${json}`)
            }
            return json;
        }
        catch (error) {
            console.error("[ERROR] getArtists failed to fetch:", error)
            return []
        }
    }

    async createTags(tags:Array<string>): Promise<boolean> {
        const url = new URL("/tags/create", config.apiURL)
        // TODO: make sure len is < 50

        const body = {
            "tags" : tags
        }
        return false;
    }
}

export const repo = Object.freeze(new ArtTagRepository())