import { isTag, type StoreOptions, type Tag } from "../types.js";
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

        const body = JSON.stringify({
            "tags" : tags
        })
        console.log(body)

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: body
            })

            if (!response.ok) {
                const res_body = await response.text()
                throw new Error(`received status ${response.status}: ${res_body}`)
            }

            return true;
        }
        catch (error) {
            console.error("[ERROR] createTags: failed to PUT:", error)
            return false;
        }
    }

    async createArtist(artist:string): Promise<boolean> {
        const url = new URL("/artists/create", config.apiURL)
        const body = {
            "artists" : [artist]
        }

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                const res_body = await response.text()
                throw new Error(`received status ${response.status}: ${res_body}`)
            }

            return true;
        }
        catch (error) {
            console.error("[ERROR] createArtist: failed to PUT:", error)
            return false;
        }

    }

    async storeImage(data:StoreOptions): Promise<boolean> {
        // TODO: use XML form data
        return false;
    }
}

export const repo = Object.freeze(new ArtTagRepository())