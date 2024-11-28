import { isTag, type Tag } from "../types.js";
import config from '../../config.json' assert { type: 'json'};

class ArtTagAPIRepository {
    async getTags(afterId:bigint|null = null): Promise<Tag[]> {
        try {
            console.log(afterId)
            const url = new URL("/tags", config.apiDomain)
            if (afterId && afterId >= 0) {
                url.searchParams.append('after_id', afterId.toString())
            }
            console.log(url.toString())
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }

            const json = await response.json()
            if (!Array.isArray(json)) {
                throw new Error(`Response is not an array: ${json}`)
            }
            return json.filter<Tag>(isTag);
        }
        catch (error) {
            console.error(error)
            return []
        }
    }
}

export const repo = Object.freeze(new ArtTagAPIRepository())